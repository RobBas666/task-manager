

import Tag from './tag'
import Task from './task'
import TaskTag from './taskTag'
import User from './user'

Task.belongsToMany(Tag, { through: TaskTag, foreignKey: 'taskId' })
Tag.belongsToMany(Task, { through: TaskTag, foreignKey: 'tagId' })

Task.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' })
Task.belongsTo(User, { foreignKey: 'assignee', as: 'assignedUser', onDelete: 'SET NULL' })

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' })

export { Task, Tag, TaskTag, User }
