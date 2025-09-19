import { verifyAuthToken, getUserRole } from '../utils/supabase.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access token is missing or invalid'
      })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the token
    const user = await verifyAuthToken(token)
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid or expired token'
      })
    }

    // Get user role
    const role = await getUserRole(user.id)
    
    req.user = {
      ...user,
      role
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      error: 'Authentication failed'
    })
  }
}

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      })
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      })
    }

    next()
  }
}

// Middleware to require admin or staff role
export const requireStaff = requireRole(['admin', 'staff'])
export const requireAdmin = requireRole(['admin'])

// apps/api/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit'

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict rate limiter for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Search rate limiter
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 search requests per minute
  message: {
    error: 'Too many search requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Quote submission limiter
export const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 quote submissions per hour
  message: {
    error: 'Too many quote requests. Please wait before submitting another.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
