import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { CreateTaskDto } from "src/common/dtos/createTask.dto";
import { UpdateTaskDto } from "src/common/dtos/update-task.dto";
import { MYSQL_DATABASE_CONNECTION } from "src/database/database.providers";
import { Task } from "src/database/models/task.model";

@Injectable()
export class TaskService {
  constructor(
    @Inject(MYSQL_DATABASE_CONNECTION) private sequelize: Sequelize,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.create({ ...createTaskDto }, { transaction });
      await transaction.commit();
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
    const transaction = await this.sequelize.transaction();

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new NotFoundException("Task not found");
      }
      await transaction.commit();
      return task;
    } catch (err) {
      console.error(err);
      await transaction.rollback();
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
      await task.update(updateTaskDto, { transaction });
      await transaction.commit();
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
