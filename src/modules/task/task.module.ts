import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";

/**
 * TaskModule
 *
 * This module is responsible for managing tasks within the application.
 * It provides the necessary services and controllers to handle task-related operations.
 */
@Module({
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
