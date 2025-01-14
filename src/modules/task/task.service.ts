import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Sequelize } from "sequelize-typescript";
import { TaskPublisher } from "src/broker/publishers/task.publisher";
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
      this.logger.error(err);
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
        this.rabbitmqConfigService.taskConfig.ROUTING_KEYS.DELETE,
      );
      this.logger.info(`Task deleted successfully for id ${task.id}`);
      return "Task deleted successfully";
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      await transaction.rollback();
      throw new BadRequestException("Failed to create tasks");
    }
  }
}
