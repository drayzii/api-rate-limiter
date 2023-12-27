const redis = require('redis');

const rateLimiter = (type, RATE_LIMIT_WINDOW_SECONDS, MAX_REQUESTS_PER_WINDOW) => {
  return async (req, res, next) => {
    const redisClient = await redis.createClient()
      .on('error', err => console.log('Redis Client Error', err))
      .connect();
    
    if (!req.query.id) {
      return res.status(400).json({ error: 'Missing id parameter', type });
    }
  
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
        return next();
      } else {
        await redisClient.incr(key);
      }
  
      next();
    } catch (error) {
      console.error('Error in rate limiter:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

module.exports = rateLimiter;
