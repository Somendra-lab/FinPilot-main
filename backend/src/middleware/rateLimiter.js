const store = {};

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(store)) {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  }
}, 60 * 1000); // Clean up every 60 seconds

export const createRateLimiter = (maxRequests, windowMs) => {
  return (req, res, next) => {
    // Bypass rate limiting in development mode to prevent blocking developer testing
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    store[key].count++;

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count));
    res.setHeader('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());

    if (store[key].count > maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }

    next();
  };
};

// Auth endpoints: 5 requests per 15 minutes
export const authLimiter = createRateLimiter(5, 15 * 60 * 1000);

// General API: 100 requests per 15 minutes
export const apiLimiter = createRateLimiter(100, 15 * 60 * 1000);
