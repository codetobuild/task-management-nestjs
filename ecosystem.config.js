const apps = [
  {
    name: "task-management-app",
    script: "dist/main.js",
    node_args: "--max-old-space-size=338",
    args: ["--color"],
    watch: true,
    ignore_watch: [
      ".git",
      "tests",
      "pids",
      "logs",
      "node_modules",
      "*.log",
      ".git/*",
      "public",
    ],
    merge_logs: true,
    cwd: ".",
    error_file: "./logs/task-management-app.log",
    out_file: "./logs/task-management-app.log",
    pid_file: "./pids/task-management-app.pid",
    min_uptime: "30s",
    max_restarts: 30,
    restart_delay: 1000,
    max_memory_restart: "423M",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    env: {
      NODE_ENV: "development",
    },
    env_uat: {
      NODE_ENV: "uat",
    },
    env_production: {
      NODE_ENV: "production",
    },
  },
];

module.exports = {
  apps,
};
