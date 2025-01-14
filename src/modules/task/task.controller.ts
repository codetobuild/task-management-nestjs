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

@Controller("tasks")
@UseGuards(CustomThrottlerGuard)
@UseInterceptors(ResponseInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks() {
    return await this.taskService.getAllTasks();
  }

  @Get(":id")
  async getTaskById(@Param("id") id: string) {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(createTaskDto);
  }

  @Put(":id")
  async updateTask(@Param("id") id: string, @Body() updateTaskDto: any) {
    return await this.taskService.updateTaskById(id, updateTaskDto);
  }

  @Delete(":id")
  async deleteTask(@Param("id") id: string) {
    return await this.taskService.deleteTaskById(id);
  }
}
