# Task Management Application

The Task Management Application is a robust, feature-rich solution designed to help individuals and teams organize, track, and execute their tasks with ease and efficiency.

## Features

Here is a list of features available in the current project:

1. **Task Management**

   - Create, update, delete, and retrieve tasks.
   - Task attributes include title, description, status, and priority.

2. **API Rate Limiting**

   - Configurable rate limiting to control the number of requests per time window.

3. **Database Integration**

   - Uses Sequelize ORM for database operations.
   - Supports MySQL database.

4. **Redis Integration**

   - Caching support using Redis.
   - Redis configuration and connection management.

5. **RabbitMQ Integration**

   - Message publishing and consuming using RabbitMQ.
   - Task-related notifications via RabbitMQ.

6. **Logging**

   - Winston logger integration.
   - Rotating file logs for application and error logs.

7. **Security**

   - Helmet middleware for enhanced security.
   - Custom HTTP exception filter for standardized error responses.

8. **Configuration Management**

   - Centralized configuration using environment variables.
   - Configurable via `.env` file.

9. **Throttling**

   - Custom throttler guard to handle rate-limiting exceptions.

10. **Modular Architecture**

    - Organized into modules for tasks, notifications, database, Redis, and RabbitMQ.

11. **Interceptors**

    - Response interceptor for standardized API responses.

12. **DTOs and Validation**

    - Data Transfer Objects (DTOs) for request validation.
    - Class-validator for input validation.

13. **PM2 Integration**

    - PM2 configuration for process management and monitoring.

14. **Documentation**
    - README file with setup instructions, running the app, and example `.env` configuration.

## Table of Contents

- [Project Setup](#project-setup)
- [Running the App](#running-the-app)
- [Connecting to RabbitMQ, Redis, and MySQL](#connecting-to-rabbitmq-redis-and-mysql)
- [Example .env File Configuration](#example-env-file-configuration)
- [Run Tests](#run-tests)

## Project Setup

### Installing Dependencies

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-repo/task-management.git
cd task-management
```

Then, install the project dependencies:

```bash
npm install
```

## Running the App

### Running with npm CLI

NestJS provides a built-in CLI for development and debugging. Use the following commands to run the application:

1. **Development Mode**  
   Start the application in watch mode for automatic reloads during development:

   ```bash
   npm run start:dev

   ```

2. **Production Mode**
   ```bash
   npm run build
   npm run start:prod
   ```
3. **Debug Mode**
   ```bash
   npm run start:debug
   ```

### Using PM2

PM2 is a production process manager for Node.js applications. It allows you to keep your application running forever, reload it without downtime, and facilitate common system admin tasks.

Install PM2 globally:

```bash
npm install -g pm2
```

Start the application using PM2:

```bash
pm2 start ecosystem.config.js
```

To view logs:

```bash
pm2 logs task-management-app
```

To stop the application:

```bash
pm2 stop task-management-app
```

To restart the application:

```bash
pm2 restart task-management-app
```

## Connecting to RabbitMQ, Redis, and MySQL

Ensure that RabbitMQ, Redis, and MySQL are installed and running on your machine or accessible from your environment.

### RabbitMQ

Start RabbitMQ server:

```bash
rabbitmq-server
```

### Redis

Start Redis server:

```bash
redis-server
```

### MySQL

Start MySQL server and create a database for the application:

```sql
CREATE DATABASE task_management_db;
```

## Example .env File Configuration

Create a `.env` file in the root directory of your project and add the following configuration:

```env
# Application Configuration
APP_NAME=MyApp                     # Your application name
SERVER_PORT=3000                   # Port number for the server

# API Configuration
API_PREFIX=/api/v1                 # API route prefix

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=300000   # Time window for rate limiting in milliseconds (5 minutes)
RATE_LIMIT_MAX=100           # Maximum number of requests within the time window

# Database Configuration
DB_DIALECT=postgres                # Database type (postgres, mysql, etc.)
DB_HOST=localhost                  # Database host address
DB_PORT=5432                      # Database port number
DB_USERNAME=postgres              # Database username
DB_PASSWORD=postgres123           # Database password
DB_NAME=my_database              # Database name
DB_LOGGING=false                 # Enable/disable database query logging
DB_POOL_MAX=10                   # Maximum number of connections in pool
DB_POOL_MIN=2                    # Minimum number of connections in pool
DB_POOL_ACQUIRE=60000           # Maximum time (ms) to acquire connection
DB_POOL_IDLE=20000             # Maximum time (ms) connection can be idle

# Redis Configuration
REDIS_HOST=localhost            # Redis server host address
REDIS_PORT=6379                # Redis server port
REDIS_USERNAME=default         # Redis username
REDIS_PASSWORD=redis123        # Redis password
REDIS_CONNECTION_TYPE=single   # Redis connection type (single/cluster)

# RabbitMQ Configuration
RABBITMQ_HOST=localhost        # RabbitMQ server host address
RABBITMQ_PORT=5672            # RabbitMQ server port
RABBITMQ_USER=admin           # RabbitMQ username
RABBITMQ_PASSWORD=admin123    # RabbitMQ password

```

## Run Tests

To run the tests, use the following command:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To run end-to-end tests:

```bash
npm run test:e2e
```

To run test coverage:

```bash
npm run test:cov
```
