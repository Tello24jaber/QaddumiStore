import cors from 'cors'

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://qaddumi.ps',
  'https://www.qaddumi.ps',
  process.env.CLIENT_URL
].filter(Boolean)

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Page-Size']
})