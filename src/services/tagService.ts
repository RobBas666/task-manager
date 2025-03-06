import { Tag, Task, TaskTag } from '../models'
import { buildErrorMessage } from '../utils/errorUtils'

interface TagModel {
  label: string;
}

class TagService {
  static async createTag (label: string) {
    try {
      const tag = await Tag.create({ label })

      return tag
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error creating tag'))
    }
  }

  static async getTags () {
    try {
      const tags = await Tag.findAll()
      return tags
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error getting all tags in table'))
    }
  }

  static async addTagToTask (taskId: number, label: string) {
    try {
      let tag = await Tag.findOne({ where: { label } })

      if (!tag) {
        tag = await TagService.createTag(label)
      }

      const taskTag = await TaskTag.create({ taskId, tagId: tag.id })
      return taskTag
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error adding to task'))
    }
  }

  static async removeTagFromTask (taskId: number, tagId: number) {
    try {
      return await TaskTag.destroy({ where: { taskId, tagId } })
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error removing tag from task'))
    }
  }

  static async getTaskTags (id: number) {
    try {
      const task = await Task.findByPk(id, { include: Tag })

      if (!task) {
        throw new Error(`No tasks with id ${id} found`)
      }

      return (task as unknown as { Tags: TagModel[] }).Tags.map((tag) => tag.label)
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error getting tags for task'))
    }
  }

  static async removeTag (id: number) {
    try {
      await Tag.destroy({ where: { id } })
      await TagService.removeTagFromAllTasks(id)
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error deleting tag'))
    }
  }

  static async removeTagFromAllTasks (id: number) {
    try {
      await TaskTag.destroy({ where: { tagId: id } })
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, 'Error deleting tag'))
    }
  }
}

export default TagService
