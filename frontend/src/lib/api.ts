// API configuration for backend integration
const ENV_API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) || (typeof process !== 'undefined' && (process as any).env && (process as any).env.VITE_API_BASE_URL)
export const API_BASE_URL = `${ENV_API_BASE || 'http://localhost:5000'}/api`

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const token = localStorage.getItem('authToken')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  // Merge with any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers)
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  if (response.status === 401) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    window.location.href = '/login'
  }
  
  return response
}

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    changePassword: '/auth/change-password'
  },
  
  // Users
  users: {
    list: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`
  },
  
  // Packages
  packages: {
    list: '/packages',
    active: '/packages/active',
    popular: '/packages/popular',
    get: (id: string) => `/packages/${id}`,
    create: '/packages',
    update: (id: string) => `/packages/${id}`,
    delete: (id: string) => `/packages/${id}`,
    togglePopular: (id: string) => `/packages/${id}/toggle-popular`,
    byCategory: (category: string) => `/packages/category/${category}`,
    byPriceRange: '/packages/price-range'
  },
  
  // Venues
  venues: {
    list: '/venues',
    available: '/venues/available',
    get: (id: string) => `/venues/${id}`
  },
  
  // Bookings
  bookings: {
    list: '/bookings',
    get: (id: string) => `/bookings/${id}`
  },
  
  // Messages
  messages: {
    list: '/messages',
    get: (id: string) => `/messages/${id}`
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    overview: '/admin/overview'
  }
} as const

export default apiCall
