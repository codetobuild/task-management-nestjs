import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateTaskDto } from "src/common/dtos/createTask.dto";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { TaskService } from "./task.service";
import { CustomThrottlerGuard } from "src/common/guards/throttler.guard";

/**
 * TaskController
 *
 * This controller handles all task-related operations, including creating,
 * retrieving, updating, and deleting tasks. It uses the TaskService to
 * perform these operations and applies necessary guards and interceptors.
 */
@Controller("tasks")
@UseGuards(CustomThrottlerGuard)
@UseInterceptors(ResponseInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Get all tasks
   *
   * This endpoint retrieves all tasks.
   *
   * @returns {Promise<any>} A promise that resolves to an array of tasks.
   */
  @Get()
  async getAllTasks() {
    return await this.taskService.getAllTasks();
  }

  /**
   * Get task by ID
   *
   * This endpoint retrieves a task by its ID.
   *
   * @param {string} id - The ID of the task to retrieve.
   * @returns {Promise<any>} A promise that resolves to the task with the specified ID.
   */
  @Get(":id")
  async getTaskById(@Param("id") id: string) {
    return await this.taskService.getTaskById(id);
  }

  /**
   * Create a new task
   *
   * This endpoint creates a new task.
   *
   * @param {CreateTaskDto} createTaskDto - The data transfer object containing the task details.
   * @returns {Promise<any>} A promise that resolves to the created task.
   */
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(createTaskDto);
  }

  /**
   * Update a task by ID
   *
   * This endpoint updates a task by its ID.
   *
   * @param {string} id - The ID of the task to update.
   * @param {any} updateTaskDto - The data transfer object containing the updated task details.
   * @returns {Promise<any>} A promise that resolves to the updated task.
   */
  @Put(":id")
  async updateTask(@Param("id") id: string, @Body() updateTaskDto: any) {
    return await this.taskService.updateTaskById(id, updateTaskDto);
  }

  /**
   * Delete a task by ID
   *
   * This endpoint deletes a task by its ID.
   *
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
   */
  @Delete(":id")
  async deleteTask(@Param("id") id: string) {
    return await this.taskService.deleteTaskById(id);
  }
}
