import { jest } from '@jest/globals';

export const mockUser = {
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn()
};

export const mockTask = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn()
};

export const mockTag = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn()
};

export const mockTaskTag = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn()
};

export const mockedUser = {
  id: 1,
  email: "test@abc.com",
  password: 'test-pass'
};

export const mockedTask = {
  "id": 1,
  "title": "Updated Task Title",
  "description": "Ensure all API endpoints work",
  "dueDate": "2025-03-11T00:00:00.000Z",
  "priority": 2,
  "status": "Complete",
  "userId": 1,
  "createdAt": "2025-03-08T05:00:41.634Z",
  "updatedAt": "2025-03-08T06:34:01.158Z",
  "assignee": 3,
  "user": { "email": "test123@abc.com" },
  "assignedUser": { "email": "test1234@abc.com" },
  "Tags": [{ "label": "test-tag" }, { "label": "other-tag" }]
}

export const mockedTag = {
  "id": 4,
  "label": "some-tag1",
  "updatedAt": "2025-03-08T20:24:28.631Z",
  "createdAt": "2025-03-08T20:24:28.631Z"
}

export const mockedTaskTag = {
  "taskId": 1,
  "tagId": 4,
  "updatedAt": "2025-03-08T20:25:27.147Z",
  "createdAt": "2025-03-08T20:25:27.147Z"
}    