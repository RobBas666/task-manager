import { Tag, Task, TaskTag } from "../models";


class TagService {
    static async createTag(label: string) {
        try {
            const tag = await Tag.create({ label: label });

            return tag;
        } catch (e: any) {
            throw new Error(`Error creating tag: ${e.message}`);
        }
    }

    static async getTags() {
        try {
            const tags = await Tag.findAll();
            return tags;
        } catch (e: any) {
            throw new Error(`Error getting all tags in table: ${e.message}`);
        }
    }

    static async addTagToTask(taskId: number, label: string) {
        try {
            let tag = await Tag.findOne({ where: { label: label } });

            if (!tag) {
                tag = await TagService.createTag(label);
            }

            const taskTag = await TaskTag.create({ taskId: taskId, tagId: tag.id });
            return taskTag;
        } catch (e: any) {
            throw new Error(`Error adding to task: ${e.message}`);
        }
    }

    static async removeTagFromTask(taskId: number, tagId: number) {
        try {
            return await TaskTag.destroy({ where: { taskId: taskId, tagId: tagId } });
        } catch (e: any) {
            throw new Error(`Error removing tag from task: ${e.message}`);
        }
    }

    static async getTaskTags(id: number) {
        try {
            let task = await Task.findByPk(id, { include: Tag });

            if (!task) {
                throw new Error(`No tasks with id ${id} found`);
            }

            return (task as any).Tags.map((tag: any) => {
                return tag.label;
            });
        } catch (e: any) {
            throw new Error(`Error getting tags for task: ${e.message}`)
        }
    }

    static async removeTag(id: number) {
        try {
            await Tag.destroy({ where: { id: id } });
            await TagService.removeTagFromAllTasks(id);
        } catch (e: any) {
            throw new Error(`Error deleting tag: ${e.message}`)
        }
    }

    static async removeTagFromAllTasks(id: number) {
        try {
            await TaskTag.destroy({ where: { tagId: id } })
        } catch (e: any) {
            throw new Error(`Error deleting tag: ${e.message}`)
        }
    }
}

export default TagService;