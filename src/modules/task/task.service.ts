import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Sequelize } from "sequelize-typescript";
import { TaskPublisher } from "src/broker/publishers";
import { CONSTANTS } from "src/common/constants";
import { CreateTaskDto } from "src/common/dtos/createTask.dto";
import { UpdateTaskDto } from "src/common/dtos/update-task.dto";
import { TaskOperationType } from "src/common/enums";
import { TaskNotificationMessage } from "src/common/interfaces/taskNotification.interface";
import { TaskHelper } from "src/common/utils/task.helper";
import { RabbitMQConfigService } from "src/config";
import { MYSQL_DATABASE_CONNECTION } from "src/database/database.providers";
import { Task } from "src/database/models/task.model";
import { RedisService } from "src/redis/redis.service";
import { Logger } from "winston";

@Injectable()
export class TaskService {
  constructor(
    @Inject(MYSQL_DATABASE_CONNECTION) private sequelize: Sequelize,
    private readonly redisService: RedisService,
    private readonly taskPublisher: TaskPublisher,
    private readonly rabbitmqConfigService: RabbitMQConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Create a new task
   *
   * @param {CreateTaskDto} createTaskDto - The data transfer object containing the task details.
   * @returns {Promise<Task>} A promise that resolves to the created task.
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.create({ ...createTaskDto }, { transaction });
      await transaction.commit();
      const message = TaskHelper.formatTaskNotificationMessage(
        TaskOperationType.CREATE,
        task,
      );
      this.taskPublisher.publish(
        message,
        this.rabbitmqConfigService.taskConfig.ROUTING_KEYS.CREATE,
      );
      this.logger.info("Task created successfully");
      return task;
    } catch (err) {
      console.error(err);
      this.logger.error(err);
      await transaction.rollback();
      throw new BadRequestException({
        message: "Failed to create task",
      });
    }
  }

  /**
   * Get all tasks
   *
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
   */
  async getAllTasks(): Promise<Task[]> {
    const cacheKey = "all_tasks";

    try {
      const cachedTasks = await this.redisService.get<Task[]>(cacheKey);
      if (cachedTasks) {
        return cachedTasks;
      }
      const tasks = await Task.findAll();
      await this.redisService.set(cacheKey, tasks, CONSTANTS.REDIS_TASK_EXP_SS);
      return tasks;
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Failed to fetch all tasks");
    }
  }

  /**
   * Get task by ID
   *
   * @param {string} id - The ID of the task to retrieve.
   * @returns {Promise<Task>} A promise that resolves to the task with the specified ID.
   */
  async getTaskById(id: string): Promise<Task> {
    const cachedTask = await this.redisService.get(`task:${id}`);
    if (cachedTask) {
      return cachedTask as Task;
    }

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new NotFoundException("Task not found");
      }
      await this.redisService.set(
        `task:${task.id}`,
        task,
        CONSTANTS.REDIS_TASK_EXP_SS,
      );
      return task;
    } catch (err) {
      console.error(err);
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException("Failed to fetch task for given id");
    }
  }

  /**
   * Update a task by ID
   *
   * @param {string} id - The ID of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The data transfer object containing the updated task details.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   */
  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new BadRequestException({
          message: "Task not found to update task",
        });
      }
      const updatedTask = await task.update(updateTaskDto, { transaction });
      await transaction.commit();
      const message: TaskNotificationMessage =
        TaskHelper.formatTaskNotificationMessage(
          TaskOperationType.UPDATE,
          updatedTask,
        );
      await this.taskPublisher.publish(
        message,
        this.rabbitmqConfigService.taskConfig.ROUTING_KEYS.UPDATE,
      );
      this.logger.info(`Task updated successfully for task id: ${id}`);
      return task;
    } catch (err) {
      this.logger.error(err);
      await transaction.rollback();
      if (err instanceof BadRequestException) {
        throw err; // Re-throw specific exceptions to preserve context.
      }
      throw new BadRequestException("Failed to update task");
    }
  }

  /**
   * Delete a task by ID
   *
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<string>} A promise that resolves to a success message.
   */
  async deleteTaskById(id: string): Promise<string> {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findByPk(id);

      if (!task) {
        throw new BadRequestException(
          `Task with ID ${id} not found to delete.`,
        );
      }

      await task.destroy({ transaction });
      await transaction.commit();
      await this.redisService.del(`task:${id}`);
      const message: TaskNotificationMessage =
        TaskHelper.formatTaskNotificationMessage(
          TaskOperationType.DELETE,
          task,
        );

      await this.taskPublisher.publish(
        message,
        this.rabbitmqConfigService.taskConfig.ROUTING_KEYS.DELETE,
      );
      this.logger.info(`Task deleted successfully for id ${task.id}`);
      return "Task deleted successfully";
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Failed to delete task");
    }
  }

  /**
   * Bulk create tasks
   *
   * @param {CreateTaskDto[]} tasks - An array of task data transfer objects.
   * @returns {Promise<string>} A promise that resolves to a success message.
   */
  async bulkCreateTasks(tasks: CreateTaskDto[]): Promise<string> {
    const transaction = await this.sequelize.transaction();

    try {
      await Task.bulkCreate(
        tasks.map((task) => ({ ...task })),
        {
          transaction,
          validate: true,
        },
      );

      await transaction.commit();
      return "Tasks created successfully";
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new BadRequestException("Failed to create tasks");
    }
  }
}
