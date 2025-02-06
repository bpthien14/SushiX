export const API_URL = 'http://localhost:3000'

export const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  PROFILE: `${API_URL}/auth/profile`,
  REFRESH: `${API_URL}/auth/refresh`,
  LOGOUT: `${API_URL}/auth/logout`,
  BRANCHES_REVENUE: `${API_URL}/branches/revenue/all`,
} as const 