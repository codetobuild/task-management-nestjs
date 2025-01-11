import { Inject, Injectable } from "@nestjs/common";
import { MYSQL_DATABASE_CONNECTION } from "./database/database.providers";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class AppService {
  constructor(
    @Inject(MYSQL_DATABASE_CONNECTION) private sequelize: Sequelize,
  ) {}

  getHello(): string {
    return "Hello World!";
  }
}
