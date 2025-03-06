import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { Priority, Status } from "../consts/enums";
import User from "./User";

class Task extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public dueDate!: Date;
    public priority!: string;
    public status!: string;
    public userId!: number;
    public createdAt !: Date;
    public updatedAt!: Date;
    public assignee!: number;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: Priority.low
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: Status.todo
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        assignee: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id"
            },
            onDelete: "SET NULL"
        }
    },
    {
        sequelize,
        tableName: "tasks",
    }
);

export default Task;