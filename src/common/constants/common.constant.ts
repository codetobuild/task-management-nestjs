export const RABBITMQ_EXCHANGE = "task_notifications_exchange";
export const RABBITMQ_QUEUE = "task_notifications_queue";
export const RABBITMQ_ROUTING_KEY = "task.notifications";

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
