const apps = [
  {
    // Basic Application Configuration
    name: "task-management-app", // Name of your application in PM2
    script: "dist/main.js", // Path to your compiled NestJS application

    // Memory Management
    instances: "2", // Use 50% of the available CPUs
    exec_mode: "cluster",
    node_args: "--max-old-space-size=338", // Limits Node.js heap size to 338MB
    max_memory_restart: "423M", // Restarts app if memory exceeds 423MB

    // Process Arguments & Watch Settings
    args: ["--color"], // Enables colored output in logs
    watch: false, // Disables file watching for auto-restart

    // Logging Configuration
    merge_logs: true, // Merges child process logs into parent
    error_file: "./logs/task-management-error.log", // Error log file path
    out_file: "./logs/task-management-out.log", // Output log file path
    log_date_format: "YYYY-MM-DD HH:mm Z", // Log timestamp format

    // Restart Behavior
    min_uptime: "30s", // Minimum uptime to consider app "started"
    max_restarts: 30, // Maximum number of restarts before stop
    restart_delay: 2000, // Delay between restarts (2 seconds)

    // Environment Variables
    env_production: {
      NODE_ENV: "production",
    },
    env_development: {
      NODE_ENV: "development",
    },
  },
];

module.exports = {
  apps,
};
