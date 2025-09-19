import pino from 'pino'

const logger = pino()

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  }, 'API Error')

  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: isProduction ? 'Invalid input data' : err.message,
      ...(isProduction ? {} : { details: err.details })
    })
  }

  if (err.name === 'UnauthorizedError' || err.message.includes('JWT')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    })
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Insufficient permissions'
    })
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Resource not found'
    })
  }

  if (err.code === 'PGRST116') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Resource not found'
    })
  }

  if (err.code === 'PGRST301') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Resource not found'
    })
  }

  // Handle Supabase errors
  if (err.message && err.message.includes('duplicate key value')) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists'
    })
  }

  // Default server error
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  })
}

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
    this.status = 401
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
    this.status = 403
  }
}