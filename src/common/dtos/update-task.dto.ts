import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./createTask.dto";

/**
 * DTO to update a Task
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
