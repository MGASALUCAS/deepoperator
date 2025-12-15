// API Configuration
// Change this URL to switch between local development and production

// For local development
// export const API_BASE_URL = 'http://127.0.0.1:4900';

// For production (uncomment the line below and comment the line above)


export const API_BASE_URL = 'https://api.swahilies.quantumintelligence.co.tz';

const env = typeof import.meta !== "undefined" ? import.meta.env : undefined;
const REPORT_REGISTRATIONS_PATH =
  env?.VITE_REPORT_REGISTRATIONS_PATH || "/reports/registrations-and-paid-same-month";
const REPORT_SUBSCRIPTIONS_PATH =
  env?.VITE_REPORT_SUBSCRIPTIONS_PATH || "/reports/subscriptions-live-breakdown";
const REPORT_SUBSCRIPTIONS_OVER_TIME_PATH =
  env?.VITE_REPORT_SUBSCRIPTIONS_OVER_TIME_PATH || "/reports/subscriptions-over-time";
const REPORT_SUBSCRIPTIONS_ENDING_PATH =
  env?.VITE_REPORT_SUBSCRIPTIONS_ENDING_PATH || "/reports/subscriptions-ending-over-time";
const REPORT_ACTIVE_PAID_BY_BUSINESS_NATURE_PATH =
  env?.VITE_REPORT_ACTIVE_PAID_BY_BUSINESS_NATURE_PATH || "/reports/active-paid-by-business-nature";
const REPORT_INACTIVE_PAID_ACTIVE_BY_REGYEAR_PATH =
  env?.VITE_REPORT_INACTIVE_PAID_ACTIVE_BY_REGYEAR_PATH || "/reports/inactive-paid-active-by-regyear";
const REPORT_INACTIVE_PAID_ACTIVE_ENDING_SOON_BY_REGYEAR_SIMPLE_PATH =
  env?.VITE_REPORT_INACTIVE_PAID_ACTIVE_ENDING_SOON_BY_REGYEAR_SIMPLE_PATH || "/reports/inactive-paid-active-ending-soon-by-regyear-simple";

// API Endpoints
export const API_ENDPOINTS = {
  // Metrics endpoints
  METRICS: (endpointNum: number) => `${API_BASE_URL}/api/end${endpointNum}`,

  // Notification endpoints
  NOTIFY: `${API_BASE_URL}/api/notify`,

  // Reports endpoints
  EXPIRED_USERS: `${API_BASE_URL}/reports/expired-users`,
  REGISTRATIONS_AND_PAID_SAME_MONTH: `${API_BASE_URL}${REPORT_REGISTRATIONS_PATH}`,
  SUBSCRIPTIONS_LIVE_BREAKDOWN: `${API_BASE_URL}${REPORT_SUBSCRIPTIONS_PATH}`,
  SUBSCRIPTIONS_OVER_TIME: `${API_BASE_URL}${REPORT_SUBSCRIPTIONS_OVER_TIME_PATH}`,
  SUBSCRIPTIONS_ENDING_OVER_TIME: `${API_BASE_URL}${REPORT_SUBSCRIPTIONS_ENDING_PATH}`,
  ACTIVE_PAID_BY_BUSINESS_NATURE: `${API_BASE_URL}${REPORT_ACTIVE_PAID_BY_BUSINESS_NATURE_PATH}`,
  INACTIVE_PAID_ACTIVE_BY_REGYEAR: `${API_BASE_URL}${REPORT_INACTIVE_PAID_ACTIVE_BY_REGYEAR_PATH}`,
  INACTIVE_PAID_ACTIVE_ENDING_SOON_BY_REGYEAR_SIMPLE: `${API_BASE_URL}${REPORT_INACTIVE_PAID_ACTIVE_ENDING_SOON_BY_REGYEAR_SIMPLE_PATH}`,

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
