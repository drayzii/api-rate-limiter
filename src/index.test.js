const supertest = require('supertest');
const { app, server } = require('./index');

afterAll((done) => {
  server.close(done);
});

describe('index.js', () => {
  it('should respond with "Test" for /test route', async () => {
    const response = await supertest(app).get('/test?id=123');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Test');
  });
});
