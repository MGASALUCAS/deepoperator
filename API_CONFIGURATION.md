# API Configuration Guide

This project now uses a centralized API configuration system that makes it easy to switch between local development and production environments.

## Configuration File

The main configuration is located in `src/lib/config.ts`. This file contains:

- **API_BASE_URL**: The base URL for all API calls
- **API_ENDPOINTS**: Predefined endpoint functions for different API calls
- **Environment detection**: Helper functions to detect development vs production

## How to Switch Between Environments

### Method 1: Direct Configuration (Recommended)

Edit `src/lib/config.ts` and change the `API_BASE_URL`:

```typescript
// For local development
export const API_BASE_URL = 'http://127.0.0.1:4900';

// For production (uncomment the line below and comment the line above)
// export const API_BASE_URL = 'https://api.swahilies.quantumintelligence.co.tz';
```

### Method 2: Environment Variables

You can also use environment variables by setting `REACT_APP_API_URL` in your environment:

```bash
# For local development
REACT_APP_API_URL=http://127.0.0.1:4900

# For production
REACT_APP_API_URL=https://api.swahilies.quantumintelligence.co.tz
```

## Updated Components

The following components have been updated to use the centralized configuration:

1. **Dashboard.tsx** - All metrics API calls now use `API_ENDPOINTS.METRICS(endpointNum)`
2. **OperatorPanel.tsx** - Notification API calls now use `API_ENDPOINTS.NOTIFY`
3. **Warehouse.tsx** - Reports API calls now use `API_ENDPOINTS.EXPIRED_USERS`

## Benefits

- **Single source of truth**: All API URLs are defined in one place
- **Easy switching**: Change one line to switch between environments
- **Type safety**: TypeScript ensures correct usage of endpoints
- **Maintainability**: Easy to add new endpoints or modify existing ones
- **Environment awareness**: Built-in detection of development vs production

## Adding New Endpoints

To add a new API endpoint, simply add it to the `API_ENDPOINTS` object in `config.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_ENDPOINT: `${API_BASE_URL}/api/new-endpoint`,
} as const;
```

Then use it in your components:

```typescript
import { API_ENDPOINTS } from "../lib/config";

const response = await fetch(API_ENDPOINTS.NEW_ENDPOINT);
```
