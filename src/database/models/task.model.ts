import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { TaskPriority, TaskStatus } from "src/common/enums";

@Table({
  tableName: "tasks",
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Task extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER, // Integer type
    allowNull: false,
    comment: "Primary Key - Auto incremented task ID",
  })
  id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    comment: "Task title - Required field",
  })
  title: string;

  @Column({ type: DataType.TEXT, comment: "Detailed description of the task" })
  description: string;

  @AllowNull(false)
  @Default(TaskStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    comment: "Current status of the task",
  })
  status: TaskStatus;

  @AllowNull(false)
  @Default(TaskPriority.LOW)
  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    comment: "Priority level of the task",
  })
  priority: TaskPriority;
}
