// API Configuration
// Change this URL to switch between local development and production

// For local development
// export const API_BASE_URL = 'http://127.0.0.1:4900';

// For production (uncomment the line below and comment the line above)


export const API_BASE_URL = 'https://api.swahilies.quantumintelligence.co.tz';

// API Endpoints
export const API_ENDPOINTS = {
  // Metrics endpoints
  METRICS: (endpointNum: number) => `${API_BASE_URL}/api/end${endpointNum}`,
  
  // Notification endpoints
  NOTIFY: `${API_BASE_URL}/api/notify`,
  
  // Reports endpoints
  EXPIRED_USERS: `${API_BASE_URL}/reports/expired-users`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Helper function to get the appropriate base URL
export const getApiBaseUrl = () => {
  // You can add logic here to automatically switch based on environment
  // For example, check for a specific environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  return API_BASE_URL;
};
