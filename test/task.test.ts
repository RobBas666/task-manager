import { beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { describe, it, expect } from '@jest/globals';
import { jwtUser } from '../src/consts/interfaces';

const mockJwtUser: jwtUser = {
    id: 1,
    iat: 0,
    exp: 0
}

jest.mock('../src/models', () => ({
    User: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn()
    },
    Task: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    },
    Tag: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    },
    TaskTag: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
    }
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

import { User as mockUser, Task as mockTask, Tag as mockTag, TaskTag as mockTaskTag } from '../src/models';
import jwt from 'jsonwebtoken';

import taskRouter from '../src/routes/taskRoutes';
import { mockedTag, mockedTask, mockedTaskTag, mockedUser } from './mocks/sequelizeMock';

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRouter);

describe('POST /api/tasks/create', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should successfully create a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.create as jest.Mock).mockResolvedValueOnce(mockedTask as never);
        (mockTag.findOne as jest.Mock).mockResolvedValue(mockedTag as never);
        (mockTaskTag.create as jest.Mock).mockResolvedValue(mockedTaskTag as never);
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(mockedTask as never);

        const response = await request(app)
            .post('/api/tasks/create')
            .auth("some token",{type: "bearer"})
            .send({
                "title": "Test",
                "description": "Test",
                "dueDate": "2025-03-14",
                "priority": "1",
                "status": "To-do",
                "tags": [
                    "test-tag",
                    "other-tag"
                ]
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully')

    });
    

    it('should fail to create a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.create as jest.Mock).mockRejectedValueOnce((new Error("Failed to create task")) as never);

        const response = await request(app)
            .post('/api/tasks/create')
            .auth("some token",{type: "bearer"})
            .send({
                "title": "Test",
                "description": "Test",
                "dueDate": "2025-03-14",
                "priority": "1",
                "status": "To-do",
                "tags": [
                    "test-tag",
                    "other-tag"
                ]
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toContain("Failed to create task") 
    })
});


describe("GET /api/tasks/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully get a task by id', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(mockedTask as never);

        const response = await request(app)
        .get('/api/tasks/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(1);
    })

    it('should be unable to find any task matching id', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(null as never);

        const response = await request(app)
        .get('/api/tasks/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(500)
        expect(response.body.message).toContain("No tasks for for userId: 1 with taskId: 1")
    });
})

describe("POST /api/tasks/:id/update", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to successfully update a task by id', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        const foundTask = {
            ...mockedTask,
            update: jest.fn()
        };
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(foundTask as never);
        (foundTask.update as jest.Mock).mockResolvedValue({} as never);

        const response = await request(app)
        .post('/api/tasks/1/update')
        .auth("some token",{type: "bearer"})
        .send({
            title: "test",
            description: "test-des",
            dueDate: "2025-03-11",
            priority: 2,
            status: "Complete"
        })

        expect(response.status).toBe(200)
        expect(response.body.message).toContain('Task Updated Successfully')
    })

    it('should fail to update a task by id', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(null as never);

        const response = await request(app)
        .post('/api/tasks/1/update')
        .auth("some token",{type: "bearer"})
        .send({
            title: "test",
            description: "test-des",
            dueDate: "2025-03-11",
            priority: 2,
            status: "Complete"
        })

        expect(response.status).toBe(500)
        expect(response.body.message).toContain("No tasks for for userId: 1 with taskId: 1")
    })
})

describe("GET /api/tasks/user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get a list of tasks created or assigned to the user', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findAll as jest.Mock).mockResolvedValueOnce([mockedTask] as never)

        const response = await request(app)
        .get('/api/tasks/user')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array);
    })

    it("should fail to get a list of tasks", async () => {
        const response = await request(app)
        .get('/api/tasks/user')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("No token provided")
    })
})

describe("DELETE /api/tasks/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully delete a task by id', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        const foundTask = {
            ...mockedTask,
            destroy: jest.fn()
        };
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(foundTask as never);
        (foundTask.destroy as jest.Mock).mockResolvedValue({} as never);

        const response = await request(app)
        .delete('/api/tasks/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Task Deleted Successfully')
    })

    it('should fail to delete a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findOne as jest.Mock).mockResolvedValueOnce(null as never);

        const response = await request(app)
        .delete('/api/tasks/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(500)
        expect(response.body.message).toContain("No tasks for for userId: 1 with taskId: 1")
    })
})

describe("POST /api/tasks/:id/assign", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should assign a user to a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        const foundTask = {
            ...mockedTask,
            save: jest.fn()
        };
        (mockTask.findOne as jest.Mock).mockResolvedValue(foundTask as never);
        (foundTask.save as jest.Mock).mockResolvedValue({} as never);
        (mockUser.findByPk as jest.Mock).mockResolvedValueOnce(mockedUser as never)
        
        const response = await request(app)
        .post('/api/tasks/1/assign')
        .auth("some token",{type: "bearer"})
        .send({
            assignee: 2
        })

        expect(response.status).toBe(200)
        expect(response.body.assignee).toBe(2)      
        
    })

    it('should fail to assign a user to a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findOne as jest.Mock).mockResolvedValue(mockedTask as never);
        (mockUser.findByPk as jest.Mock).mockResolvedValueOnce(null as never)

        const response = await request(app)
        .post('/api/tasks/1/assign')
        .auth("some token",{type: "bearer"})
        .send({
            assignee: 2
        })

        expect(response.status).toBe(500)
        expect(response.body.message).toContain("Assignee user not found")        
    });
})

describe("POST /api/tasks/tag", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully create a tag", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTag.create as jest.Mock).mockReturnValueOnce(mockedTag);

        const response = await request(app)
        .post('/api/tasks/tag')
        .auth("some token",{type: "bearer"})
        .send({
            "label": "some-tag1"
        })

        expect(response.status).toBe(201)
        expect(response.body.label).toBe("some-tag1")
    })

    it('should fail to create a new tag', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTag.create as jest.Mock).mockRejectedValueOnce((new Error('Unable to create task')) as never)

        const response = await request(app)
        .post('/api/tasks/tag')
        .auth("some token",{type: "bearer"})
        .send({
            "label": "some-tag1"
        })

        expect(response.status).toBe(500)
        expect(response.body.message).toContain('Unable to create task')
    })
})

describe("POST /api/tasks/:id/tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully assign a tag to task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTag.findOne as jest.Mock).mockResolvedValueOnce(null as never)
        const newTag = { 
            ...mockedTag, 
            id: 1, 
            label: "other-label"
        };
        (mockTag.create as jest.Mock).mockResolvedValueOnce(newTag as never)
        const newTaskTag = {
            ...mockedTaskTag,
            tagId: 1
        };
        (mockTaskTag.create as jest.Mock).mockResolvedValueOnce(newTaskTag as never)

        const response = await request(app)
        .post('/api/tasks/1/tags')
        .auth("some token",{type: "bearer"})
        .send({
            "label": "other-label"
        })

        expect(response.status).toBe(200)
        expect(response.body.tagId).toBe(1)
    })

    it('should fail to assign a tag to a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);

        const response = await request(app)
        .post('/api/tasks/1/tags')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Tag label is required")
    })
})

describe("DELETE /api/tasks/:id/tags/:tagId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should remove a tag from a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTaskTag.destroy as jest.Mock).mockResolvedValueOnce({} as never)

        const response = await request(app)
        .delete('/api/tasks/1/tags/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Successfully removed tag from task')

    })

    it('should fail to remove a tag from a task', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTaskTag.destroy as jest.Mock).mockRejectedValueOnce((new Error("Failed to delete")) as never)

        const response = await request(app)
        .delete('/api/tasks/1/tags/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(500)
        expect(response.body.message).toContain('Failed to delete')

    })
})

describe("DELETE /api/tasks/tags/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a tag completely', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTag.destroy as jest.Mock).mockResolvedValueOnce({} as never);
        (mockTaskTag.destroy as jest.Mock).mockResolvedValueOnce({} as never);

        const response = await request(app)
        .delete('/api/tasks/tags/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
    })

    it('should fail to delete a tag completely', async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTag.destroy as jest.Mock).mockRejectedValueOnce((new Error("Failed to delete")) as never)

        const response = await request(app)
        .delete('/api/tasks/tags/1')
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(500)
        expect(response.body.message).toContain("Failed to delete")
    })
})

describe("GET /api/tasks/filter/:status", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully return an array of filtered tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findAll as jest.Mock).mockResolvedValueOnce([mockedTask] as never)

        const response = await request(app)
        .get("/api/tasks/filter/Complete")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
    })

    it("should successfully return an array of filtered tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);

        const response = await request(app)
        .get("/api/tasks/filter/ABC")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(400)
        expect(response.body.message).toContain( `ABC is not a valid status`)
    })
})

describe("GET /api/tasks/sort/:field/:order", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully return an array of sorted tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findAll as jest.Mock).mockResolvedValueOnce([mockedTask] as never)

        const response = await request(app)
        .get("/api/tasks/sort/priority/ASC")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
    })

    it("should successfully return an array of filtered tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);

        const response = await request(app)
        .get("/api/tasks/sort/priority/ABC")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(400)
        expect(response.body.message).toContain( `ABC is not a valid sort order`)
    })
})

describe("GET /filter/:status/sort/:field/:order", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully return an array of sorted and filtered tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);
        (mockTask.findAll as jest.Mock).mockResolvedValueOnce([mockedTask] as never)

        const response = await request(app)
        .get("/api/tasks//filter/Complete/sort/priority/ASC")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
    })

    it("should successfully return an array of filtered tasks", async () => {
        (jwt.verify as jest.Mock).mockReturnValueOnce(mockJwtUser);

        const response = await request(app)
        .get("/api/tasks//filter/Complete/sort/priority/ABC")
        .auth("some token",{type: "bearer"})

        expect(response.status).toBe(400)
        expect(response.body.message).toContain( `ABC is not a valid sort order`)
    })
})