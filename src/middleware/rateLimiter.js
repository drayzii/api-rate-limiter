const redis = require('redis');

const rateLimiter = (type, RATE_LIMIT_WINDOW_SECONDS, MAX_REQUESTS_PER_WINDOW) => {
  return async (req, res, next) => {
    if (!req.query.id) {
      return res.status(400).json({ error: 'Missing id parameter', type });
    }

    // We can connect to centralised Redis server here to ensure that all instances of our application share the same rate limit counters.
    const redisClient = await redis.createClient()
      .on('error', err => console.log('Redis Client Error', err))
      .connect();
  
    const key =  type === 'system'
      ? 'rate_limit'
      : `rate_limit_${type}:${req.query.id}`;

    try {
      const requestsCount = await redisClient.get(key);
  
      if (requestsCount && parseInt(requestsCount) >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({ error: 'Too many requests', type });
      }
  
      if (!requestsCount) {
        await redisClient.setEx(key, RATE_LIMIT_WINDOW_SECONDS, '1');
      } else {
        await redisClient.incr(key);
      }
  
      next();
    } catch (error) {
      console.error('Error in rate limiter:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await redisClient.quit();
    }
  };
}

module.exports = rateLimiter;
