CREATE DATABASE `task_management_db`;

use `task_management_db`;

CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key - Auto incremented task ID',
  `title` varchar(100) NOT NULL COMMENT 'Task title - Required field',
  `description` text COMMENT 'Detailed description of the task',
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'PENDING' COMMENT 'Current status of the task',
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW' COMMENT 'Priority level of the task',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

