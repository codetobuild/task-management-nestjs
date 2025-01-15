import { TaskNotificationMessage } from "src/common/interfaces/taskNotification.interface";
import { TaskOperationType } from "src/common/enums";
import { Task } from "src/database/models/task.model";

/**
 * TaskHelper
 *
 * This helper class provides utility methods for task-related operations.
 */
export class TaskHelper {
  /**
   * Format a task notification message
   *
   * This method formats a task notification message to be published to RabbitMQ.
   *
   * @param {TaskOperationType} type - The type of task operation (CREATE, UPDATE, DELETE).
   * @param {Task} task - The task object containing task details.
   * @returns {TaskNotificationMessage} The formatted task notification message.
   */
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
