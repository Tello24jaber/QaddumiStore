import rateLimit from 'express-rate-limit'

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Search specific rate limiter
export const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 search requests per 5 minutes
  message: {
    error: 'Too many search requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Admin operations rate limiter (more restrictive)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 admin requests per windowMs
  message: {
    error: 'Too many admin requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Quote/contact form rate limiter
export const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 quote requests per hour
  message: {
    error: 'Too many quote requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
