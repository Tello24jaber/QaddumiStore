import { clsx } from 'clsx'

// Utility function to combine classNames
export const cn = (...inputs) => {
  return clsx(inputs)
}

// Format price with currency
export const formatPrice = (price, currency = 'ILS', locale = 'ar') => {
  if (!price) return ''
  
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-PS' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  
  return formatter.format(price)
}

// Format number with localization
export const formatNumber = (number, locale = 'ar') => {
  if (!number) return '0'
  
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-PS' : 'en-US').format(number)
}

// Format date
export const formatDate = (date, locale = 'ar') => {
  if (!date) return ''
  
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-PS' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Get image URL with fallback
export const getImageUrl = (url, fallback = '/images/placeholder.jpg') => {
  if (!url) return fallback
  if (url.startsWith('http')) return url
  return url.startsWith('/') ? url : `/${url}`
}

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Get device type
export const getDeviceType = () => {
  const width = window.innerWidth
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Scroll to top
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

// Scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Generate WhatsApp URL
export const generateWhatsAppUrl = (phone, message = '', locale = 'ar') => {
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[^\d+]/g, ''))
}

// Storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

// URL utilities
export const urlUtils = {
  getSearchParams: () => {
    return new URLSearchParams(window.location.search)
  },
  
  setSearchParam: (key, value) => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.replaceState({}, '', url.toString())
  },
  
  removeSearchParam: (key) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(key)
    window.history.replaceState({}, '', url.toString())
  }
}