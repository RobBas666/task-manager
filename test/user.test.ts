import { beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { describe, it, expect } from '@jest/globals';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../src/models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

import { User as mockUser } from '../src/models';
import userRouter from "../src/routes/userRoutes";
import { assert } from 'console';

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

const mockedUser = {
  id: 1,
  email: "test@abc.com",
  password: 'test-pass'
};

describe('POST /api/users/signup', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should create a user successfully', async () => {
    (mockUser.create as jest.Mock).mockResolvedValueOnce(mockedUser as never);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("mock-hash" as never);

    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@abc.com',
        password: 'test-pass',
      });

      console.log(response)

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user.id).toEqual(mockedUser.id);
  });

  it('should fail to create a new user', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@abc.com',
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Email and password are required');
  });

  it('should allow a successful login and return a token', async () => {
    (mockUser.findOne as jest.Mock).mockResolvedValueOnce(mockedUser as never);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true as never);
    (jwt.sign as jest.Mock).mockReturnValueOnce('mocked-jwt-token');

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@abc.com',
        password: 'test-pass',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBe('mocked-jwt-token');

  });

  it('should fail to log user in', async () => {
    (mockUser.findOne as jest.Mock).mockResolvedValueOnce(mockedUser as never);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false as never);

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@abc.com',
        password: 'test-pass',
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Invalid credentials")
  });
});
