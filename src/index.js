require('dotenv').config();
const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const port = process.env.PORT || 3000;

const clientLimitPerMinute = process.env.CLIENT_LIMIT_PER_MINUTE || 10;
const clientMonthlyLimit = process.env.CLIENT_MONTHLY_LIMIT || 100;
const systemLimitPerMinute = process.env.SYSTEM_LIMIT_PER_MINUTE || 15;

// Apply system rate limiter middleware
app.use(rateLimiter('system', 60, systemLimitPerMinute));

// Apply rate limiter middleware
app.use(rateLimiter('client', 60, clientLimitPerMinute));

// Apply monthly quota rate limiter middleware
app.use(rateLimiter('client_monthly', 30 * 24 * 60 * 60, clientMonthlyLimit));

app.get('/test', (req, res) => {
  res.send('Test');
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };
