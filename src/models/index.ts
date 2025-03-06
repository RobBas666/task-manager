import Tag from "./Tag";
import Task from "./Task";
import TaskTag from "./TaskTag";
import User from "./User";

Task.belongsToMany(Tag, { through: TaskTag, foreignKey: "taskId" });
Tag.belongsToMany(Task, { through: TaskTag, foreignKey: "tagId" });

Task.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "assignee", as: "assignedUser", onDelete: "SET NULL" });

User.hasMany(Task, { foreignKey: "userId", as: "tasks", onDelete: "CASCADE" });

export { Task, Tag, TaskTag, User };