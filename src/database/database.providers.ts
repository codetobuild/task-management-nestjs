import { ConfigService } from "@nestjs/config";
import { Dialect } from "sequelize";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

export const MYSQL_DATABASE_CONNECTION = "MYSQL_DATABASE_CONNECTION";

export const databaseProviders = [
  {
    provide: MYSQL_DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelizeOptions: SequelizeOptions = {
        dialect: configService.get<string>("database.dialect") as Dialect,
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        // logging: configService.get<boolean | ((msg: string) => void)>(
        //   "database.logging",
        // ),
        pool: configService.get<object>("database.pool"),
        models: [__dirname + "/../**/*.model{.ts,.js}"],
        modelMatch: (filename: string, member: string) => {
          return (
            filename.substring(0, filename.indexOf(".model")) ===
            member.toLowerCase()
          );
        },
      };

      const sequelize = new Sequelize(sequelizeOptions);
      // sequelize.addModels([Task]);
      await sequelize.sync();
      await await sequelize.authenticate();
      return sequelize;
    },
  },
];
