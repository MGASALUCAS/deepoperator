
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChartBar, TrendingUp, Users, Bell, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MetricData {
  metric: string;
  description?: string;
  value: number | string;
  timestamp: string;
  error?: string;
}

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState<{ [key: number]: MetricData }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMetrics = async () => {
      const endpoints = Array.from({length: 16}, (_, i) => i + 1);
      const promises = endpoints.map(async (endpointNum) => {
        try {
          const response = await fetch(`http://localhost:4900/api/end${endpointNum}`);
          const data = await response.json();
          return { endpointNum, data };
        } catch (error) {
          console.error(`Failed to fetch end${endpointNum}:`, error);
          return { endpointNum, data: { error: 'Failed to fetch', metric: `Endpoint ${endpointNum}`, value: 'N/A', timestamp: new Date().toISOString() } };
        }
      });

      const results = await Promise.all(promises);
      const newMetricsData: { [key: number]: MetricData } = {};
      
      results.forEach(({ endpointNum, data }) => {
        newMetricsData[endpointNum] = data;
      });
      
      setMetricsData(newMetricsData);
      setLoading(false);
    };

    fetchAllMetrics();
  }, []);

  const stats = [
    { endpointNum: 100, color: "coral" },
    { endpointNum: 200, color: "mint" },
    { endpointNum: 300, color: "violet" },
    { endpointNum: 400, color: "gold" },
    { endpointNum: 1, color: "coral" },
    { endpointNum: 2, color: "mint" },
    { endpointNum: 3, color: "violet" },
    { endpointNum: 4, color: "gold" },
    { endpointNum: 5, color: "coral" },
    { endpointNum: 6, color: "mint" },
    { endpointNum: 7, color: "violet" },
    { endpointNum: 8, color: "gold" },
    { endpointNum: 9, color: "coral" },
    { endpointNum: 10, color: "mint" },
    { endpointNum: 11, color: "violet" },
    { endpointNum: 12, color: "gold" },
    { endpointNum: 13, color: "coral" },
    { endpointNum: 14, color: "mint" },
    { endpointNum: 15, color: "violet" },
    { endpointNum: 16, color: "gold" }
  ];

  const userLevels = [
    { level: 0, count: 245, percentage: 16.3 },
    { level: 1, count: 312, percentage: 20.8 },
    { level: 2, count: 428, percentage: 28.5 },
    { level: 3, count: 298, percentage: 19.9 },
    { level: 4, count: 167, percentage: 11.1 },
    { level: 5, count: 50, percentage: 3.4 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
            Operation Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time insights powered by emotional intelligence
          </p>
        </div>
        <Button variant="hero" size="lg" className="w-full lg:w-auto group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Launch Actions
        </Button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const metricData = metricsData[stat.endpointNum];
          const displayValue = loading ? "Loading..." : (metricData?.value || "N/A");
          const displayTitle = loading ? "Loading..." : (metricData?.metric || `Metric ${stat.endpointNum}`);
          const displayDescription = loading ? "" : (metricData?.description || "Real-time data");
          
          return (
            <Card key={index} className="bg-card border border-border/50 hover:border-border transition-colors group">
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-foreground mb-1 md:mb-2 group-hover:scale-105 transition-transform">
                  {displayValue}
                </div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground line-clamp-2">
                  {displayTitle}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 hidden md:block line-clamp-2">
                  {displayDescription}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Levels Distribution */}
        <Card className="border-lavender/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-coral" />
              User Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userLevels.map((level) => (
                <div key={level.level} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center border border-coral/20">
                      <span className="text-xs font-medium text-coral">{level.level}</span>
                    </div>
                    <span className="text-sm font-medium">Level {level.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-coral h-2 rounded-full transition-all"
                        style={{ width: `${level.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {level.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core Analytics Dashboard */}
        <Card className="border-lavender/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-coral" />
                Core Analytics Dashboard
              </CardTitle>
              <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5">
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-64 border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden">
              <iframe
                src="https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d"
                frameBorder="0"
                allowFullScreen={true}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                title="Power BI Dashboard"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-mint/20 hover:border-mint/40">
          <CardContent className="p-6 text-center">
            <ChartBar className="w-8 h-8 mx-auto mb-3 text-mint" />
            <h3 className="font-semibold mb-2">Warehouse Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Deep-dive into operational insights
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-tangerine/20 hover:border-tangerine/40">
          <CardContent className="p-6 text-center">
            <Bell className="w-8 h-8 mx-auto mb-3 text-tangerine" />
            <h3 className="font-semibold mb-2">Operator Panel</h3>
            <p className="text-sm text-muted-foreground">
              Automate notifications & engagement
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-lavender/30 hover:border-lavender/50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-lavender" />
            <h3 className="font-semibold mb-2">Feedback Loop</h3>
            <p className="text-sm text-muted-foreground">
              Sentiment analysis & insights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
