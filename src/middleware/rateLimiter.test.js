const supertest = require('supertest');
const redis = require('redis');
const express = require('express');
const rateLimiter = require('./rateLimiter');

const app = express();

app.use(rateLimiter('client', 60, 2));

app.get('/test', (req, res) => {
  res.send('Test');
});

beforeAll(async () => {
  const redisClient = await redis.createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  await redisClient.del('rate_limit_client:123');

  redisClient.quit();
});

describe('Rate Limiter Middleware', () => {
  it('should allow requests within the limit', async () => {
    const response = await supertest(app).get('/test?id=123');
    expect(response.status).toBe(200);
  });

  it('should block requests beyond the limit', async () => {
    await supertest(app).get('/test?id=123');
    await supertest(app).get('/test?id=123');

    const response = await supertest(app).get('/test?id=123');
    expect(response.status).toBe(429);
  });

  it('should handle missing id parameter', async () => {
    const response = await supertest(app).get('/test');
    expect(response.status).toBe(400);
  });
});
