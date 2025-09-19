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


