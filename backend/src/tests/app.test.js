const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES_IN = '1h';
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Authentication flow', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
  });

  it('logs in an existing user', async () => {
    await User.create({ username: 'tester', email: 'tester@example.com', password: 'password123' });

    const res = await request(app).post('/api/users/login').send({
      email: 'tester@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
