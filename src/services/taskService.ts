import { Priority, Status } from "../consts/enums";
import { Tag, Task, User } from "../models";

//to do evaluate status based on enums

class TaskService {
    static async createTask(title: string, description: string, dueDate: Date, priority: Priority, status: Status, userId: number) {
        try {
            const task = await Task.create({
                title,
                description,
                dueDate,
                priority,
                status,
                userId
            });

            return task;
        } catch (e: any) {
            throw new Error(`Error creating task: ${e.message}`)
        }
    }

    static async getUserTasks(id: number) {
        try {
            //to do add or clause for assignee
            const tasks = await Task.findAll({
                where: {
                    userId: id
                },
                include: [
                    { model: User, as: "user", attributes: ["email"] },
                    { model: User, as: "assignedUser", attributes: ["email"] },
                    { model: Tag, through: { attributes: [] }, attributes: ["label"] }
                ]
            });
            return tasks;
        } catch (e: any) {
            throw new Error(`Error finding tasks for userId: ${id}`);
        }
    }

    static async getTaskByID(id: number, userId: number) {
        try {
            const task = await Task.findOne({
                where: {
                    id: id,
                    userId: userId
                },
                include: [
                    { model: User, as: "user", attributes: ["email"] },
                    { model: User, as: "assignedUser", attributes: ["email"] },
                    { model: Tag, through: { attributes: [] }, attributes: ["label"] }
                ]
            });

            if (!task) {
                throw new Error(`No tasks for for userId: ${userId} with taskId: ${id}`);
            }

            return task
        } catch (e: any) {
            throw new Error(`Error finding task: ${e.message}`)
        }
    }

    static async updateTask(taskId: number, userId: number, updates: { title?: string, description?: string, dueDate?: Date, priority?: Priority, status?: Status }) {
        try {
            const task = await TaskService.getTaskByID(taskId, userId);

            const updatedTask = await task.update({
                ...updates,
                updated: new Date()
            });
        } catch (e: any) {
            throw new Error(`Error updating task: ${e.message}`);
        }
    }

    static async deleteTask(taskId: number, userId: number) {
        try {
            const task = await TaskService.getTaskByID(taskId, userId);
            await task.destroy();
            return { message: "Task deleted" }
        } catch (e: any) {
            throw new Error(`Error deleting task: ${e.message}`)
        }
    }

    static async assignTask(id: number, userId: number, newUserId: number) {
        try {
            const task = await TaskService.getTaskByID(id, userId);

            if (!task) {
                throw new Error("Task not found");
            } else if (!((task.userId === userId) || (task.assignee === userId))) {
                throw new Error("only the creator or current assignee can assign the task");
            }

            const assignedUser = await User.findByPk(newUserId);

            if (!assignedUser) {
                throw new Error("Assignee user not found");
            }

            task.assignee = newUserId;
            await task.save();
            return await TaskService.getTaskByID(id, userId);
        } catch (e: any) {
            throw new Error(`Error assigning task: ${e.message}`);
        }
    }

    static async getTasksByStatus(id: number, status: string) {
        try {
            const tasks = await Task.findAll({
                where: {
                    userId: id,
                    status: status
                },
                include: [
                    { model: User, as: "user", attributes: ["email"] },
                    { model: User, as: "assignedUser", attributes: ["email"] },
                    { model: Tag, through: { attributes: [] }, attributes: ["label"] }
                ]
            })

            return tasks;

        } catch (e: any) {
            throw new Error(`Error filtering tasks: ${e.message}`);
        }
    }

    static async getSortedTasks(id: number, sortBy: string, orderBy: string ){
        try{
            const tasks = await Task.findAll({
                where: {userId: id},
                order: [[sortBy, orderBy]],
                include: [
                    { model: User, as: "user", attributes: ["email"] },
                    { model: User, as: "assignedUser", attributes: ["email"] },
                    { model: Tag, through: { attributes: [] }, attributes: ["label"] }
                ]
            });

            return tasks;
        }catch(e: any){
            throw new Error(`Error sorting tasks: ${e.message}`);
        }
    }

    static async getSortedAndFilteredTasks(id: number, sortBy: string, orderBy:  string,status: string ){
        try {
            const tasks = await Task.findAll({//this can also be achieved by using one of the above methods and filtering or sorting the result
                where: {userId: id, status: status},
                order: [[sortBy, orderBy]],
                include: [
                    { model: User, as: "user", attributes: ["email"] },
                    { model: User, as: "assignedUser", attributes: ["email"] },
                    { model: Tag, through: { attributes: [] }, attributes: ["label"] }
                ]
            });
            return tasks
        }catch(e: any){
            throw new Error(`Error fitering and sorting tasks: ${e.message}`);
        }
    }
}

export default TaskService;