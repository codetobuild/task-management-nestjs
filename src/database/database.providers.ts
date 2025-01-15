import { ConfigModule } from "@nestjs/config";
import { Dialect } from "sequelize";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { DatabaseConfigService } from "../config";

// Constant for MySQL database connection provider
export const MYSQL_DATABASE_CONNECTION = "MYSQL_DATABASE_CONNECTION";

// Array of database providers
export const databaseProviders = [
  {
    provide: MYSQL_DATABASE_CONNECTION, // Provide the MySQL database connection
    imports: [ConfigModule],
    inject: [DatabaseConfigService],
    useFactory: async (
      databaseConfigService: DatabaseConfigService,
    ): Promise<Sequelize> => {
      // Configure Sequelize options using values from DatabaseConfigService
      const sequelizeOptions: SequelizeOptions = {
        dialect: databaseConfigService.dialect as Dialect,
        host: databaseConfigService.host,
        port: databaseConfigService.port,
        username: databaseConfigService.username,
        password: databaseConfigService.password,
        database: databaseConfigService.database,
        logging: databaseConfigService.logging,
        pool: databaseConfigService.pool,
        models: [__dirname + "/../**/*.model{.ts,.js}"],
        modelMatch: (filename: string, member: string) => {
          return (
            filename.substring(0, filename.indexOf(".model")) ===
            member.toLowerCase()
          );
        },
      };

      const sequelize = new Sequelize(sequelizeOptions);
      await sequelize.sync();
      await sequelize.authenticate();
      return sequelize;
    },
  },
];
