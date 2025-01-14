import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { TaskPublisher } from "src/broker/publishers/task.publisher";
import { TASK_BROKER_CONFIG } from "src/common/constants";
import { CreateTaskDto } from "src/common/dtos/createTask.dto";
import { UpdateTaskDto } from "src/common/dtos/update-task.dto";
import { TaskOperationType } from "src/common/enums";
import { TaskNotificationMessage } from "src/common/interfaces/taskNotification.interface";
import { TaskHelper } from "src/common/utils/task.helper";
import { MYSQL_DATABASE_CONNECTION } from "src/database/database.providers";
import { Task } from "src/database/models/task.model";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class TaskService {
  constructor(
    @Inject(MYSQL_DATABASE_CONNECTION) private sequelize: Sequelize,
    private readonly redisService: RedisService,
    private readonly taskPublisher: TaskPublisher,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
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
        TASK_BROKER_CONFIG.ROUTING_KEYS.CREATE,
      );
      return task;
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw new BadRequestException({
        message: "Failed to create task",
      });
    }
  }

  async getAllTasks() {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findAll({ transaction });
      await transaction.commit();
      return task;
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw new BadRequestException("Failed to fetch all tasks");
    }
  }

  async getTaskById(id: string) {
    const cachedTask = await this.redisService.get(`task:${id}`);
    if (cachedTask) {
      return cachedTask;
    }

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new NotFoundException("Task not found");
      }
      await this.redisService.set(`task:${task.id}`, task, 60);
      return task;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException("Failed to fetch task for given id");
    }
  }

  async updateTaskById(id: string, updateTaskDto: UpdateTaskDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new BadRequestException({
          message: "Task not found",
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
        TASK_BROKER_CONFIG.ROUTING_KEYS.UPDATE,
      );
      return task;
    } catch (err) {
      await transaction.rollback();
      if (err instanceof BadRequestException) {
        throw err; // Re-throw specific exceptions to preserve context.
      }
      throw new BadRequestException("Failed to create task");
    }
  }

  async deleteTaskById(id: string) {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findByPk(id);

      if (!task) {
        await transaction.rollback();
        throw new NotFoundException(`Task with ID ${id} not found`);
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
        TASK_BROKER_CONFIG.ROUTING_KEYS.DELETE,
      );

      return "Task deleted successfully";
    } catch (error) {
      await transaction.rollback();

      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException("Failed to delete task");
    }
  }

  async bulkCreateTasks(tasks: CreateTaskDto[]) {
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
      await transaction.rollback();
      throw new BadRequestException("Failed to create tasks");
    }
  }
}
