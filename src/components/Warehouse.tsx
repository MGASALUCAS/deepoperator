import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ChartBar, Filter, Settings, Maximize, RefreshCcw } from "lucide-react";
import { API_ENDPOINTS } from "../lib/config";

const Warehouse = () => {
  const [filters, setFilters] = useState({
    region: "all",
    businessType: "all",
    userLevel: "all"
  });

  // NEW: key to force-refresh only the Churn iframe
  const [churnRefreshKey, setChurnRefreshKey] = useState(0);

  const mockDashboards = [
    {
      title: "Churn Analysis:",
      description: "Real-time analysis of customers churns",
      type: "financial",
      lastUpdated: "2 minutes ago"
    },
    {
      title: "Login Trends & Patterns",
      description: "User activity and engagement metrics",
      type: "engagement",
      lastUpdated: "5 minutes ago"
    },
    {
      title: "Subscription Renewals",
      description: "Renewal rates and churn prediction",
      type: "subscription",
      lastUpdated: "1 minute ago"
    },
    {
      title: "Sales Distribution",
      description: "Geographic and demographic sales analysis",
      type: "sales",
      lastUpdated: "3 minutes ago"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-24 sm:pb-12 lg:pb-16">
      {/* ... header + filters dialog remain unchanged ... */}

      {/* Quick Filters ... unchanged ... */}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        {mockDashboards.map((dashboard, index) => {
          const isChurn = dashboard.title === "Churn Analysis:";

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
                    {/* Refresh stays only for Churn */}
                    {isChurn && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm"
                        onClick={() => setChurnRefreshKey(k => k + 1)}
                        title="Refresh chart"
                      >
                        <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                    )}

                    {/* FULL SCREEN: Churn uses your Flask Plotly chart; others keep PowerBI */}
                    {isChurn ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm">
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Full Screen</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none">
                          {/* Just the Plotly graph, edge-to-edge */}
                          <iframe
                            key={churnRefreshKey}
                            src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}
                            frameBorder={0}
                            allowFullScreen
                            className="w-full h-full"
                            title="Churn Analysis Chart — Full Screen"
                            style={{ minHeight: '100vh', minWidth: '100vw' }}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5 text-xs sm:text-sm">
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Full Screen</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none">
                          <div className="w-full h-full overflow-hidden">
                            <iframe
                              src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}                              frameBorder={0}
                              allowFullScreen
                              className="w-full h-full"
                              title={`${dashboard.title} Dashboard - Full Screen`}
                              style={{ minHeight: '100vh', minWidth: '100vw' }}
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
              </CardHeader>

              <CardContent className="relative z-10 p-3.5 sm:p-4 min-h-[24rem] lg:min-h-[24rem] xl:min-h-[26rem]">
                {/* BODY: special rendering for Churn (Plotly image only), others unchanged */}
                {isChurn ? (
                  <div className="relative w-full h-[24rem] sm:h-[30rem] lg:h-[24rem] xl:h-[26rem] border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden hover:border-coral/40 transition-colors">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="sm:hidden h-full w-full">
                        <iframe
                          key={churnRefreshKey}
                          src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}
                          frameBorder={0}
                          className="h-full w-full rounded-lg"
                          title="Churn Analysis Chart"
                          style={{ minWidth: "100%", minHeight: 480 }}
                        />
                      </div>
                      <div className="hidden sm:block h-full w-full">
                        <iframe
                          key={`${churnRefreshKey}-desktop`}
                          src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}
                          frameBorder={0}
                          className="h-full w-full rounded-lg"
                          title="Churn Analysis Chart"
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
                          src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}
                          frameBorder={0}
                          allowFullScreen
                          className="h-full w-full rounded-lg"
                          title={`${dashboard.title} Dashboard`}
                          style={{ minWidth: "100%", minHeight: 480 }}
                        />
                      </div>
                      <div className="hidden sm:block h-full w-full">
                        <iframe
                          src={`${API_ENDPOINTS.EXPIRED_USERS}?ts=${churnRefreshKey}`}
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
