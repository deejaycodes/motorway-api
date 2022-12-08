import request from 'supertest';

import app from '../../app';
import { connectDb, disConnectDb } from '../../db/postgreSQL';
import { redisClient } from '../../db/redis';
import { ErrorCodes } from '../../@types';

beforeAll(async () => {
  await connectDb();
  await redisClient.connect();
});

describe('GET /vehicles/:id', () => {
  it('Should return 400 code for missing query params', async () => {
    const res = await request(app).get('/vehicle/1');
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({
      code: ErrorCodes.MISSING_PARAM,
      message: 'timestamp is required',
    });
  });
});

describe('GET /vehicles/:id', () => {
  it('Should return 422 code for incorrect date', async () => {
    const res = await request(app)
      .get('/vehicle/1')
      .query({ timestamp: '2022-20-12 19:03:54%2B02:00' });
    expect(res.status).toEqual(422);
    expect(res.body).toEqual({
      code: ErrorCodes.PARAM_NOT_VALID,
      message: 'Enter a valid timestamp',
    });
  });
});

describe('GET /vehicles/:id', () => {
  it('Should return vehicle details', async () => {
    const res = await request(app)
      .get('/vehicle/1')
      .query({ timestamp: '2022-09-12 19:03:54+02:00' });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: 1,
      make: 'BMW',
      model: 'X1',
      state: 'quoted'
    });
  });
});

afterAll(async () => {
  await disConnectDb();
  await redisClient.quit();
});
