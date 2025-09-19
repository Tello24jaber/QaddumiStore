import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import pino from 'pino'
import expressPino from 'express-pino-logger'

// Import routes
import categoriesRoutes from './routes/categories.js'
import productsRoutes from './routes/products.js'
import searchRoutes from './routes/search.js'
import compareRoutes from './routes/compare.js'
import quotesRoutes from './routes/quotes.js'
import servicesRoutes from './routes/services.js'
import adminProductsRoutes from './routes/admin/products.js'
import adminCategoriesRoutes from './routes/admin/categories.js'
import adminMediaRoutes from './routes/admin/media.js'

// Import middleware
import { authMiddleware } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import { corsMiddleware } from './middleware/cors.js'

// Load environment variables
config()

// Initialize logger
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty'
  } : undefined
})

const expressLogger = expressPino({ logger })

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}))

// Compression middleware
app.use(compression())

// CORS middleware
app.use(corsMiddleware)

// Request logging
app.use(expressLogger)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/categories', categoriesRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/compare', compareRoutes)
app.use('/api/quotes', quotesRoutes)
app.use('/api/services', servicesRoutes)

// Protected admin routes
app.use('/api/admin/products', authMiddleware, adminProductsRoutes)
app.use('/api/admin/categories', authMiddleware, adminCategoriesRoutes)
app.use('/api/admin/media', authMiddleware, adminMediaRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  })
})

// Global error handler
app.use(errorHandler)

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`)
  
  const server = app.listen(PORT)
  server.close(() => {
    logger.info('HTTP server closed.')
    process.exit(0)
  })
  
  // Force close server after 30secs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 API server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`Health check: http://localhost:${PORT}/health`)
})

export default app