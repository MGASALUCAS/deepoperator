# Reports API Documentation

This project consumes the Kuza API Dashboard report endpoints. Every endpoint returns
an HTML snippet with an interactive Plotly chart that can be embedded directly inside
this React application.

All endpoints are exposed from the same base URL (`API_BASE_URL`). Update
`src/lib/config.ts` to point at the correct environment. Examples below use
`{BASE_URL}` as a placeholder.

## Available Endpoints

| # | Endpoint | Method | Purpose | Time Window |
|---|----------|--------|---------|-------------|
| 1 | `/reports/expired-users` | `GET` | Track monthly counts of paid users whose subscriptions have expired. | Last 6 months (up to the next month boundary) |
| 2 | `/reports/registrations-and-paid-same-month` | `GET` | Compare registrations vs. paid users within the same month and plot conversion rate. | Rolling 12 months |
| 3 | `/reports/subscriptions-live-breakdown` | `GET` | Show the current month's mix of signups, renewals, and reactivations. | Current calendar month |
| 4 | `/reports/subscriptions-over-time` | `GET` | Show current-month paid transactions split by amount and subscription type. | Current calendar month |
| 5 | `/reports/subscriptions-ending-over-time` | `GET` | Forecast how many paid users will expire in the coming months. | Next `months` months (default 12) |
| 6 | `/reports/active-paid-by-business-nature` | `GET` | Active paid subscriptions grouped by business nature. | Current active base |

### 1. Expired Users Report

- **Endpoint:** `GET {BASE_URL}/reports/expired-users`
- **Return type:** Plotly bar chart (HTML `<div>`).
- **Details:**
  - Counts unique users with `subscriptions.status = 'paid'` whose paid period already expired.
  - Window covers the first day of the month six months ago through the first day of the next month.

### 2. Registrations and Paid in the Same Month

- **Endpoint:** `GET {BASE_URL}/reports/registrations-and-paid-same-month`
- **Return type:** Grouped bar chart with a secondary line for conversion rate.
- **Metrics:**
  - `total_registered`
  - `paid_same_month`
  - `conversion_rate = paid_same_month / total_registered * 100`
- **Window:** Rolling 12 months (current month included).

### 3. Subscriptions Live Breakdown

- **Endpoint:** `GET {BASE_URL}/reports/subscriptions-live-breakdown`
- **Return type:** Single stacked bar chart.
- **Segments:**
  - `Signups & Paid`
  - `Renewals (This Month)`
  - `Reactivated from Churn`
- **Window:** Current calendar month.

### 4. Subscriptions Over Time

- **Endpoint:** `GET {BASE_URL}/reports/subscriptions-over-time`
- **Return type:** Plotly bar chart per amount/subscription type.
- **Highlights:**
  - Counts paid transactions for the current month.
  - Bars use labels such as `90,000 (Year)` with purchase counts.
- **Usage:** Quick scan of which plans are selling right now.

### 5. Subscriptions Ending Over Time

- **Endpoint:** `GET {BASE_URL}/reports/subscriptions-ending-over-time`
- **Query params:**
  - `months` (optional, default `12`, range `1-36`): how far ahead to project.
- **Return type:** Monthly bar chart.
- **Highlights:**
  - Shows how many paid users have a `subscription_end` falling within each upcoming month.
- **Usage:** Planning renewals and retention campaigns.

### 6. Active Paid by Business Nature

- **Endpoint:** `GET {BASE_URL}/reports/active-paid-by-business-nature`
- **Query params:**
  - `min` (default `1`): minimum count threshold to display a segment.
  - `top` (default `10`): limit the chart to the top `N` segments after filtering.
- **Return type:** Sorted bar chart.
- **Highlights:**
  - Counts active paid users grouped by `business_nature`.
  - Chart title summarizes applied filters (`min`, `top`).
- **Usage:** Understand which customer types are currently active and monetizing.

## Usage Notes

- All report endpoints are read-only and do not require bodies or query parameters.
- To embed a chart, inject the HTML into the DOM (for example inside an `<iframe>`).
- When embedding from a different origin, ensure the Flask server's CORS configuration allows it.
- This documentation is mirrored in code via `API_ENDPOINTS` inside `src/lib/config.ts`. The defaults can be overridden via `VITE_REPORT_REGISTRATIONS_PATH` and `VITE_REPORT_SUBSCRIPTIONS_PATH` if your backend exposes different slugs.

