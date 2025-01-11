import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskPriority, TaskStatus } from "../enums";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  iority: TaskPriority;
}
