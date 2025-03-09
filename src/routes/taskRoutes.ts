import express from 'express'
import authMiddleware from '../middleware/auth'
import TaskService from '../services/taskService'
import TagService from '../services/tagService'
import { Priority, Status, TaskFilter, TaskSort } from '../consts/enums'
import { handleError } from '../utils/errorUtils'

const taskRouter = express.Router()

taskRouter.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, tags } = req.body
    const userId = Number(req.user?.id)

    if (status && !Object.values(Status).includes(status as Status)) {
      res.status(400).json({ message: `${status} is not a valid status` })
      return
    }

    if (priority && !Object.values(Priority).includes(Number(priority) as Priority)) {
      res.status(400).json({ message: `${priority} is not a valid priority` })
      return
    }

    const task = await TaskService.createTask(title, description, dueDate, priority, status, tags, userId)
    res.status(201).json({ message: 'Task created successfully', task })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.get('/user', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.user?.id)

    const tasks = await TaskService.getUserTasks(id)
    res.status(200).json(tasks)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.get('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = Number(req.user?.id)

    const task = await TaskService.getTaskByID(id, userId)
    res.status(200).json(task)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.post('/:id/update', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = Number(req.user?.id)
    const { title, description, dueDate, priority, status } = req.body

    await TaskService.updateTask(id, userId, { title, description, dueDate, priority, status })
    res.status(200).json({ message: 'Task Updated Successfully' })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = Number(req.user?.id)

    await TaskService.deleteTask(id, userId)
    res.status(200).json({ message: 'Task Deleted Successfully' })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.post('/:id/assign', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = Number(req.user?.id)
    const { assignee } = req.body

    const task = await TaskService.assignTask(Number(id), userId, Number(assignee))

    res.status(200).json(task)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.post('/tag', authMiddleware, async (req, res) => {
  try {
    const { label } = req.body

    const tag = await TagService.createTag(label)

    res.status(201).json(tag)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.post('/:id/tags', authMiddleware, async (req, res) => {
  try {
    const { label } = req.body
    const { id } = req.params

    if (!label) {
      res.status(400).json({ message: 'Tag label is required' })
      return
    }

    const taskTag = await TagService.addTagToTask(Number(id), label)

    res.status(200).json(taskTag)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.delete('/:id/tags/:tagId', authMiddleware, async (req, res) => {
  try {
    const { id, tagId } = req.params

    await TagService.removeTagFromTask(Number(id), Number(tagId))

    res.status(200).json({ message: 'Successfully removed tag from task' })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.delete('/tags/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await TagService.removeTag(Number(id))

    res.status(200).json({ message: 'Successfully removed tag ' })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.get('/filter/:status', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user?.id)
    const { status } = req.params

    if (!Object.values(Status).includes(status as Status)) {
      res.status(400).json({ message: `${status} is not a valid status` })
      return
    }

    const tasks = await TaskService.getTasksByStatus(userId, status as string)
    res.status(200).json(tasks)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.get('/sort/:field/:order', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user?.id)
    const { field, order } = req.params

    if (!Object.values(TaskFilter).includes(field as TaskFilter)) {
      res.status(400).json({ message: `${field} is not a valid field name` })
      return
    }

    if (!Object.values(TaskSort).includes(order as TaskSort)) {
      res.status(400).json({ message: `${order} is not a valid sort order` })
      return
    }

    const tasks = await TaskService.getSortedTasks(userId, field, order)
    res.status(200).json(tasks)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

taskRouter.get('/filter/:status/sort/:field/:order', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user?.id)
    const { status, field, order } = req.params

    if (!Object.values(TaskFilter).includes(field as TaskFilter)) {
      res.status(400).json({ message: `${field} is not a valid field name` })
      return
    }

    if (!Object.values(TaskSort).includes(order as TaskSort)) {
      res.status(400).json({ message: `${order} is not a valid sort order` })
      return
    }

    if (!Object.values(Status).includes(status as Status)) {
      res.status(400).json({ message: `${status} is not a valid status` })
      return
    }

    const tasks = await TaskService.getSortedAndFilteredTasks(userId, field, order, status)
    res.status(200).json(tasks)
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

export default taskRouter
