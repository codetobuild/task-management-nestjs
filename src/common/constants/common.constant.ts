export const TASK_BROKER_CONFIG = Object.freeze({
  EXCHANGE: "task_notifications_exchange",
  QUEUES: {
    CREATE: "task_create_queue",
    UPDATE: "task_update_queue",
    DELETE: "task_delete_queue",
  },
  ROUTING_KEYS: {
    CREATE: "task.create",
    UPDATE: "task.update",
    DELETE: "task.delete",
  },
  EXCHANGE_TYPE: "direct",
});
