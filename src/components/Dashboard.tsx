
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChartBar, TrendingUp, Users, Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import PowerBICard from "./PowerBICard";

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
      const endpoints = Array.from({length: 30}, (_, i) => i + 1);
      const promises = endpoints.map(async (endpointNum) => {
        try {
          const response = await fetch(`http://127.0.0.1:4900/api/end${endpointNum}`);
                    // const response = await fetch(`http://54.153.108.186/api/end${endpointNum}`);

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
    { endpointNum: 17, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 18, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    { endpointNum: 19, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    { endpointNum: 20, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    { endpointNum: 21, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 22, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    { endpointNum: 23, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    { endpointNum: 24, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    { endpointNum: 25, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 26, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    // { endpointNum: 27, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    // { endpointNum: 28, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    { endpointNum: 1, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 2, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    { endpointNum: 3, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    { endpointNum: 4, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    { endpointNum: 5, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 6, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    { endpointNum: 7, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    { endpointNum: 8, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    { endpointNum: 9, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    { endpointNum: 10, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    // { endpointNum: 11, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    // { endpointNum: 12, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" },
    // { endpointNum: 13, color: "coral", gradient: "from-coral/20 to-coral-glow/30", shadowColor: "coral" },
    // { endpointNum: 14, color: "mint", gradient: "from-mint/20 to-mint-glow/30", shadowColor: "mint" },
    // { endpointNum: 15, color: "violet", gradient: "from-violet/20 to-violet-glow/30", shadowColor: "violet" },
    // { endpointNum: 16, color: "gold", gradient: "from-gold/20 to-gold-glow/30", shadowColor: "gold" }
  ];

  const getMetricCardStyle = (color: string, gradient: string, shadowColor: string) => {
    const baseClasses = "relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1";
    const borderClasses = `border border-${color}/30 hover:border-${color}/50`;
    const backgroundClasses = `bg-gradient-to-br ${gradient} backdrop-blur-sm`;
    const shadowClasses = `shadow-lg hover:shadow-2xl hover:shadow-${shadowColor}/25`;
    
    return `${baseClasses} ${borderClasses} ${backgroundClasses} ${shadowClasses}`;
  };

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
          {/* <p className="text-lg text-muted-foreground">
            Real-time insights powered by emotional intelligence
          </p> */}
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
          // const displayValue = loading ? "Loading..." : (metricData?.value || "N/A");
          const displayValue = loading ? "Loading..."  : (metricData && metricData.value !== undefined && metricData.value !== null) ? metricData.value : "N/A";  
          const displayTitle = loading ? "Loading..." : (metricData?.metric || `Metric ${stat.endpointNum}`);
          const displayDescription = loading ? "" : (metricData?.description || "Real-time data");
          
          // const displayValue = loading ? "Loading..."  : (metricData && metricData.value !== undefined && metricData.value !== null) ? metricData.value : "N/A";  
          // const displayTitle = loading ? "Loading..." : (metricData?.metric || `Metric ${stat.endpointNum}`);
          // const displayDescription = loading ? "" : (metricData?.description || "Real-time data");
          
          return (
            <Card key={index} className={getMetricCardStyle(stat.color, stat.gradient, stat.shadowColor)}>
              {/* Animated gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${stat.color}/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out`} />
              
              {/* Glowing border effect */}
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${stat.color}/20 via-${stat.color}/40 to-${stat.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
              
              <CardContent className="relative p-3 md:p-4 lg:p-6 text-center z-10">
                {/* Floating icon */}
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-${stat.color}/20 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}>
                  <div className={`w-2 h-2 rounded-full bg-${stat.color} animate-pulse`} />
                </div>

                <div className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-${stat.color} mb-1 md:mb-2 group-hover:scale-110 transition-all duration-300 drop-shadow-sm`}>
                  {displayValue}
                </div>
                <p className="text-xs md:text-sm font-medium text-foreground/90 line-clamp-2 group-hover:text-foreground transition-colors">
                  {displayTitle}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 hidden md:block line-clamp-2">
                  {displayDescription}
                </p>

                {/* Subtle glow effect on hover */}
                <div className={`absolute inset-0 rounded-lg bg-${stat.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
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
        <PowerBICard 
          title="Core Analytics Dashboard"
          embedUrl="https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d"
          className="h-full"
        />
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
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gold/20 hover:border-gold/40">
          <CardContent className="p-6 text-center">
            <Bell className="w-8 h-8 mx-auto mb-3 text-gold" />
            <h3 className="font-semibold mb-2">Operator Panel</h3>
            <p className="text-sm text-muted-foreground">
              Automate notifications & engagement
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-violet/30 hover:border-violet/50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-violet" />
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
