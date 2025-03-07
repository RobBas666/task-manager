import { Op } from 'sequelize'
import { Priority, Status } from '../consts/enums'
import { Tag, Task, User } from '../models'
import { buildErrorMessage } from '../utils/errorUtils'
import TagService from './tagService'
import Redis from 'ioredis'

const redis = new Redis()

// It is possible to implement pagination should our list of tasks become greater eg:
// const tasks = await Task.findAll({
//   where: {
//     [Op.or]: [
//       { userId: id },
//       { assignee: id }
//     ]
//   },
//   limit,
//   offset,
//   include: [
//     { model: User, as: 'user', attributes: ['email'] },
//     { model: User, as: 'assignedUser', attributes: ['email'] },
//     { model: Tag, through: { attributes: [] }, attributes: ['label'] }
//   ]
// });

class TaskService {
  static async createTask (title: string, description: string, dueDate: Date, priority: Priority, status: Status, tags: string[], userId: number) {
    try {
      const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        status,
        userId
      })

      for (const tag of tags) {
        await TagService.addTagToTask(task.id, tag)
      }

      return TaskService.getTaskByID(task.id, userId)
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error creating task'))
    }
  }

  static async getUserTasks (id: number) {
    try {
      // const cachedTasks = await redis.get(`user-tasks:${id}`) // caching might not be ideal here as tasks can be updated and we would want to return most uptodate information

      // if(cachedTasks){
      //   return JSON.parse(cachedTasks);
      // }
      const tasks = await Task.findAll({
        where: {
          [Op.or]: [
            { userId: id },
            { assignee: id }
          ]
        },
        include: [
          { model: User, as: 'user', attributes: ['email'] },
          { model: User, as: 'assignedUser', attributes: ['email'] },
          { model: Tag, through: { attributes: [] }, attributes: ['label'] }
        ]
      })
      return tasks
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error finding tasks for userId'))
    }
  }

  static async getTaskByID (id: number, userId: number) {
    try {
      const cachedTask = await redis.get(`task:${id}-${userId}`)

      if (cachedTask) {
        return JSON.parse(cachedTask)
      }

      const task = await Task.findOne({
        where: {
          id,
          [Op.or]: [
            { userId },
            { assignee: userId }
          ]
        },
        include: [
          { model: User, as: 'user', attributes: ['email'] },
          { model: User, as: 'assignedUser', attributes: ['email'] },
          { model: Tag, through: { attributes: [] }, attributes: ['label'] }
        ]
      })

      if (!task) {
        throw new Error(`No tasks for for userId: ${userId} with taskId: ${id}`)
      }

      await redis.setex(`task:${id}-${userId}`, 300, JSON.stringify(task))

      return task
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error finding task'))
    }
  }

  static async updateTask (taskId: number, userId: number, updates: { title?: string, description?: string, dueDate?: Date, priority?: Priority, status?: Status }) {
    try {
      const task = await TaskService.getTaskByID(taskId, userId)

      await task.update({
        ...updates,
        updated: new Date()
      })

      await redis.setex(`task:${taskId}-${userId}`, 300, JSON.stringify(task))
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error updating task'))
    }
  }

  static async deleteTask (taskId: number, userId: number) {
    try {
      const task = await TaskService.getTaskByID(taskId, userId)
      await task.destroy()
      await redis.del(`task:${taskId}-${userId}`)
      // try { // we could implement something like this so that if our cache is down we can still proceed with the database calls
      //   await redis.del(`task:${taskId}-${userId}`)
      // } catch (e: unknown) {
      //   console.error(`Failed to remove task from cache: ${e}`)
      // }
      return { message: 'Task deleted' }
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error deleting task'))
    }
  }

  static async assignTask (id: number, userId: number, newUserId: number) {
    try {
      const task = await TaskService.getTaskByID(id, userId)

      if (!task) {
        throw new Error('Task not found')
      } else if (!((task.userId === userId) || (task.assignee === userId))) {
        throw new Error('only the creator or current assignee can assign the task')
      }

      const assignedUser = await User.findByPk(newUserId)

      if (!assignedUser) {
        throw new Error('Assignee user not found')
      }

      task.assignee = newUserId
      task.updatedAt = new Date()
      await task.save()
      return await TaskService.getTaskByID(id, userId)
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error assigning task'))
    }
  }

  static async getTasksByStatus (id: number, status: string) {
    try {
      const tasks = await Task.findAll({
        where: {
          userId: id,
          status
        },
        include: [
          { model: User, as: 'user', attributes: ['email'] },
          { model: User, as: 'assignedUser', attributes: ['email'] },
          { model: Tag, through: { attributes: [] }, attributes: ['label'] }
        ]
      })

      return tasks
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error filtering tasks'))
    }
  }

  static async getSortedTasks (id: number, sortBy: string, orderBy: string) {
    try {
      const tasks = await Task.findAll({
        where: { userId: id },
        order: [[sortBy, orderBy]],
        include: [
          { model: User, as: 'user', attributes: ['email'] },
          { model: User, as: 'assignedUser', attributes: ['email'] },
          { model: Tag, through: { attributes: [] }, attributes: ['label'] }
        ]
      })

      return tasks
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error sorting tasks'))
    }
  }

  static async getSortedAndFilteredTasks (id: number, sortBy: string, orderBy: string, status: string) {
    try {
      const tasks = await Task.findAll({ // this can also be achieved by using one of the above methods and filtering or sorting the result
        where: { userId: id, status },
        order: [[sortBy, orderBy]],
        include: [
          { model: User, as: 'user', attributes: ['email'] },
          { model: User, as: 'assignedUser', attributes: ['email'] },
          { model: Tag, through: { attributes: [] }, attributes: ['label'] }
        ]
      })
      return tasks
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error fitering and sorting tasks'))
    }
  }
}

export default TaskService
