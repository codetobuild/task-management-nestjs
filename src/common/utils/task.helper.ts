import { TaskNotificationMessage } from "src/common/interfaces/taskNotification.interface";
import { TaskOperationType } from "src/common/enums";
import { Task } from "src/database/models/task.model";

export class TaskHelper {
  static formatTaskNotificationMessage(
    type: TaskOperationType,
    task: Task,
  ): TaskNotificationMessage {
    return {
      type,
      taskId: task.id,
      payload: task,
      timestamp: new Date().toISOString(),
    };
  }
}
