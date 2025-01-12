export interface TaskNotificationMessage {
  type: "CREATE" | "UPDATE" | "DELETE";
  taskId: number;
  payload?: any;
  timestamp: string;
}
