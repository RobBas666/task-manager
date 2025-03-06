import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Task from "./Task";
import Tag from "./Tag";

class TaskTag extends Model {
    public taskId!: number;
    public tagId!: number;
}


TaskTag.init(
    {
        taskId: {
            type: DataTypes.INTEGER,
            references: {model: Task, key: "id"},
            onDelete: "CASCADE"
        },
        tagId: {
            type: DataTypes.INTEGER,
            references: {model: Tag, key: "id"},
            onDelete: "CASCADE"
        }
    },
    {
        sequelize,
        tableName: "task_tags",
    }
);

export default TaskTag;