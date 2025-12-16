import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ChartBar, Filter, Settings, Maximize, RefreshCcw, X } from "lucide-react";
import { API_ENDPOINTS } from "../lib/config";

type ReportDashboard = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  endpoint: string;
  timeWindow: string;
  refreshable?: boolean;
};

const Warehouse = () => {
  const [filters, setFilters] = useState({
    region: "all",
    businessType: "all",
    userLevel: "all"
  });

  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  const [openFullscreenId, setOpenFullscreenId] = useState<string | null>(null);

  // Hide SessionIndicator when any fullscreen is open
  useEffect(() => {
    if (openFullscreenId) {
      document.body.classList.add('fullscreen-dialog-open');
    } else {
      document.body.classList.remove('fullscreen-dialog-open');
    }
    return () => {
      document.body.classList.remove('fullscreen-dialog-open');
    };
  }, [openFullscreenId]);

  const dashboards: ReportDashboard[] = [
    {
      id: "expired-users",
      title: "Expired Users Trend",
      description: "Track how many paid customers churn each month.",
      lastUpdated: "1 minute ago",
      endpoint: API_ENDPOINTS.EXPIRED_USERS,
      timeWindow: "Last 6 months",
      refreshable: true
    },
    {
      id: "registrations-paid",
      title: "Registrations vs Paid",
      description: "Compare registrations, paid users, and conversion rate.",
      lastUpdated: "Just now",
      endpoint: API_ENDPOINTS.REGISTRATIONS_AND_PAID_SAME_MONTH,
      timeWindow: "Rolling 12 months"
    },
    {
      id: "subscriptions-live",
      title: "Subscriptions Live Breakdown",
      description: "Current month mix of signups, renewals, and reactivations.",
      lastUpdated: "Current month",
      endpoint: API_ENDPOINTS.SUBSCRIPTIONS_LIVE_BREAKDOWN,
      timeWindow: "Current month"
    },
    {
      id: "subscriptions-over-time",
      title: "Subscriptions Over Time",
      description: "Current month paid transactions by amount and subscription type.",
      lastUpdated: "Live month-to-date",
      endpoint: API_ENDPOINTS.SUBSCRIPTIONS_OVER_TIME,
      timeWindow: "Current month",
      refreshable: true
    },
    {
      id: "subscriptions-ending",
      title: "Subscriptions Ending Over Time",
      description: "Forecast of paid users expiring each month in the future window.",
      lastUpdated: "Updated hourly",
      endpoint: `${API_ENDPOINTS.SUBSCRIPTIONS_ENDING_OVER_TIME}?months=12`,
      timeWindow: "Next 12 months",
      refreshable: true
    },
    {
      id: "active-paid-business-nature",
      title: "Active Paid by Business Nature",
      description: "Active subscriptions grouped by business nature with min/top filters.",
      lastUpdated: "On demand",
      endpoint: `${API_ENDPOINTS.ACTIVE_PAID_BY_BUSINESS_NATURE}?min=1&top=10`,
      timeWindow: "Current active base",
      refreshable: true
    },
    {
      id: "inactive-paid-active-by-regyear",
      title: "Inactive Paid Active by Registration Year",
      description: "Active and inactive paid users segmented by registration year.",
      lastUpdated: "Updated hourly",
      endpoint: API_ENDPOINTS.INACTIVE_PAID_ACTIVE_BY_REGYEAR,
      timeWindow: "By registration year",
      refreshable: true
    },
    {
      id: "inactive-paid-active-ending-soon-by-regyear-simple",
      title: "Ending Soon by Registration Year",
      description: "Paid subscriptions ending soon, grouped by registration year.",
      lastUpdated: "Updated hourly",
      endpoint: API_ENDPOINTS.INACTIVE_PAID_ACTIVE_ENDING_SOON_BY_REGYEAR_SIMPLE,
      timeWindow: "Upcoming expirations",
      refreshable: true
    }
  ];

  const getRefreshKey = (id: string) => refreshKeys[id] ?? 0;

  const handleRefresh = (id: string) => {
    setRefreshKeys(prev => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1
    }));
  };

  const getIframeSrc = (dashboard: ReportDashboard) => {
    if (!dashboard.refreshable) {
      return dashboard.endpoint;
    }
    const refreshSeed = getRefreshKey(dashboard.id);
    return `${dashboard.endpoint}?ts=${refreshSeed}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-24 sm:pb-12 lg:pb-16">
      {/* ... header + filters dialog remain unchanged ... */}

      {/* Quick Filters ... unchanged ... */}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        {dashboards.map((dashboard, index) => {
          const isExpiredReport = dashboard.id === "expired-users";
          const refreshSeed = getRefreshKey(dashboard.id);
          const iframeSrc = getIframeSrc(dashboard);
          return (
            <Card
              key={index}
              className="relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 border-coral/30 hover:border-coral/50 bg-gradient-to-br from-coral/10 to-coral-glow/20 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-coral/25 min-h-[28rem] sm:min-h-[32rem] lg:min-h-[26rem] xl:min-h-[28rem]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-coral/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-coral/20 via-coral/40 to-coral/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

              <CardHeader className="relative z-10 p-3 sm:p-4">
                <div className="flex items-center justify-between flex-wrap gap-1.5 sm:gap-2.5">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 min-w-0 flex-1">
                    <ChartBar className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-coral group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">{dashboard.title}</span>
                  </CardTitle>

                  <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                    {/* Refresh optional per report */}
                    {dashboard.refreshable && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm"
                        onClick={() => handleRefresh(dashboard.id)}
                        title="Refresh chart"
                      >
                        <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                    )}

                    {/* FULL SCREEN: Churn uses your Flask Plotly chart; others keep PowerBI */}
                    {isExpiredReport ? (
                      <Dialog
                        open={openFullscreenId === dashboard.id}
                        onOpenChange={(open) => setOpenFullscreenId(open ? dashboard.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm">
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Full Screen</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="fullscreen-dialog-content max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none [&>button[data-radix-dialog-close]]:hidden relative"
                          onEscapeKeyDown={() => setOpenFullscreenId(null)}
                          onInteractOutside={(e) => e.preventDefault()}
                        >
                          <DialogTitle className="sr-only">{dashboard.title} — Full Screen</DialogTitle>
                          {/* Close button - positioned on the right */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenFullscreenId(null)}
                            className="!absolute top-3 right-3 sm:top-4 sm:right-4 !z-[99999] !bg-white dark:!bg-gray-900 !border-2 !border-gray-300 dark:!border-gray-600 !text-gray-900 dark:!text-gray-100 !h-9 !w-9 sm:!h-10 sm:!w-10 !shadow-xl !rounded-md transition-all duration-200 hover:!bg-red-500 hover:!text-white hover:!border-red-500 hover:!scale-110 active:!scale-95 pointer-events-auto"
                            title="Close fullscreen (Press ESC)"
                            aria-label="Close fullscreen"
                            style={{ zIndex: 99999 }}
                          >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                          {/* Just the Plotly graph, edge-to-edge */}
                          <iframe
                            key={`${dashboard.id}-fullscreen-${refreshSeed}`}
                            src={iframeSrc}
                            frameBorder={0}
                            allowFullScreen
                            className="w-full h-full absolute inset-0"
                            title={`${dashboard.title} — Full Screen`}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog
                        open={openFullscreenId === dashboard.id}
                        onOpenChange={(open) => setOpenFullscreenId(open ? dashboard.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm">
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Full Screen</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="fullscreen-dialog-content max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none [&>button[data-radix-dialog-close]]:hidden relative"
                          onEscapeKeyDown={() => setOpenFullscreenId(null)}
                          onInteractOutside={(e) => e.preventDefault()}
                        >
                          <DialogTitle className="sr-only">{dashboard.title} Dashboard — Full Screen</DialogTitle>
                          {/* Close button - positioned on the right */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenFullscreenId(null)}
                            className="!absolute top-3 right-3 sm:top-4 sm:right-4 !z-[99999] !bg-white dark:!bg-gray-900 !border-2 !border-gray-300 dark:!border-gray-600 !text-gray-900 dark:!text-gray-100 !h-9 !w-9 sm:!h-10 sm:!w-10 !shadow-xl !rounded-md transition-all duration-200 hover:!bg-red-500 hover:!text-white hover:!border-red-500 hover:!scale-110 active:!scale-95 pointer-events-auto"
                            title="Close fullscreen (Press ESC)"
                            aria-label="Close fullscreen"
                            style={{ zIndex: 99999 }}
                          >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                          <div className="w-full h-full overflow-hidden absolute inset-0">
                            <iframe
                              key={`${dashboard.id}-fullscreen-${refreshSeed}`}
                              src={iframeSrc}
                              frameBorder={0}
                              allowFullScreen
                              className="w-full h-full"
                              title={`${dashboard.title} Dashboard - Full Screen`}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>

                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground group-hover:text-foreground transition-colors mt-1.5 sm:mt-2">
                  {dashboard.description}
                </p>
                <p className="text-[10px] sm:text-[11px] text-coral font-medium mt-0.5">
                  Window: {dashboard.timeWindow}
                </p>
              </CardHeader>

              <CardContent className="relative z-10 p-3.5 sm:p-4 min-h-[24rem] lg:min-h-[24rem] xl:min-h-[26rem]">
                {/* BODY: special rendering for Churn (Plotly image only), others unchanged */}
                {isExpiredReport ? (
                  <div className="relative w-full h-[24rem] sm:h-[30rem] lg:h-[24rem] xl:h-[26rem] border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden hover:border-coral/40 transition-colors">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="sm:hidden h-full w-full">
                        <iframe
                          key={`${dashboard.id}-mobile-${refreshSeed}`}
                          src={iframeSrc}
                          frameBorder={0}
                          className="h-full w-full rounded-lg"
                          title={`${dashboard.title} Chart`}
                          style={{ minWidth: "100%", minHeight: 480 }}
                        />
                      </div>
                      <div className="hidden sm:block h-full w-full">
                        <iframe
                          key={`${dashboard.id}-desktop-${refreshSeed}`}
                          src={iframeSrc}
                          frameBorder={0}
                          className="h-full w-full rounded-lg"
                          title={`${dashboard.title} Chart`}
                          style={{ minHeight: 320 }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-[24rem] sm:h-[30rem] lg:h-[24rem] xl:h-[26rem] border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden group/iframe hover:border-coral/40 transition-colors">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="sm:hidden h-full w-full">
                        <iframe
                          key={`${dashboard.id}-mobile-${refreshSeed}`}
                          src={iframeSrc}
                          frameBorder={0}
                          allowFullScreen
                          className="h-full w-full rounded-lg"
                          title={`${dashboard.title} Dashboard`}
                          style={{ minWidth: "100%", minHeight: 480 }}
                        />
                      </div>
                      <div className="hidden sm:block h-full w-full">
                        <iframe
                          key={`${dashboard.id}-desktop-${refreshSeed}`}
                          src={iframeSrc}
                          frameBorder={0}
                          allowFullScreen
                          className="h-full w-full rounded-lg transition-opacity group-hover/iframe:opacity-90"
                          title={`${dashboard.title} Dashboard`}
                          style={{ minHeight: 320 }}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-coral/10 to-transparent opacity-0 group-hover/iframe:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                )}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-0">
                  <div className="flex gap-2 items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-mint animate-pulse" />
                    <span className="text-xs font-medium text-mint">Live Data</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {dashboard.lastUpdated}
                  </div>
                </div>
              </CardContent>

              <div className="absolute inset-0 rounded-lg bg-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          );
        })}
      </div>

      {/* Summary stats ... unchanged ... */}
    </div>
  );
};

export default Warehouse;
