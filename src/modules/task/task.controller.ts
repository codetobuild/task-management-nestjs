import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { CreateTaskDto } from "src/common/dtos/createTask.dto";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";

@Controller("tasks")
@UseInterceptors(ResponseInterceptor)
export class TaskController {
  @Get()
  async getAllTasks() {
    return "tasks";
  }

  @Get(":id")
  async getTaskById(@Param("id") id: string) {
    return "task by id";
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return "task created";
  }

  @Put(":id")
  async updateTask(@Param("id") id: string, @Body() updateTaskDto: any) {
    return "task updated";
  }

  @Delete(":id")
  async deleteTask(@Param("id") id: string) {
    return "task deleted";
  }
}
