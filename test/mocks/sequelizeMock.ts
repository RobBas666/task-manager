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