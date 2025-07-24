import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ChartBar, Filter, TrendingUp, Settings, Maximize } from "lucide-react";

const Warehouse = () => {
  const [filters, setFilters] = useState({
    region: "all",
    businessType: "all",
    userLevel: "all"
  });

  const mockDashboards = [
    {
      title: "Customer Debt Analysis",
      description: "Real-time debt tracking and payment patterns",
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Analytics</h1>
          <p className="text-muted-foreground">
            Real-time business intelligence and operational insights
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-mint/30 text-mint hover:bg-mint/10">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Analytics Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Region</label>
                <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Business Type</label>
                <Select value={filters.businessType} onValueChange={(value) => setFilters({...filters, businessType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">User Level</label>
                <Select value={filters.userLevel} onValueChange={(value) => setFilters({...filters, userLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="0">Level 0</SelectItem>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="bg-coral/5 border-coral/20 text-coral hover:bg-coral/10">All Data</Button>
        <Button variant="outline" size="sm" className="hover:bg-mint/10 border-mint/20">Last 7 Days</Button>
        <Button variant="outline" size="sm" className="hover:bg-tangerine/10 border-tangerine/20">This Month</Button>
        <Button variant="outline" size="sm" className="hover:bg-lavender/10 border-lavender/30">Quarter</Button>
      </div>

      {/* Power BI Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDashboards.map((dashboard, index) => (
          <Card key={index} className="relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 border-coral/30 hover:border-coral/50 bg-gradient-to-br from-coral/10 to-coral-glow/20 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-coral/25">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-coral/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-coral/20 via-coral/40 to-coral/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartBar className="w-5 h-5 text-coral group-hover:scale-110 transition-transform" />
                  {dashboard.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5">
                        <Maximize className="w-4 h-4 mr-1" />
                        Full Screen
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none">
                      <DialogHeader className="absolute top-4 left-4 z-50 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                        <DialogTitle className="text-sm font-medium">{dashboard.title} - Full Screen</DialogTitle>
                      </DialogHeader>
                      <div className="w-full h-full overflow-hidden">
                        <iframe
                          src="https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d"
                          frameBorder="0"
                          allowFullScreen={true}
                          className="w-full h-full"
                          title={`${dashboard.title} Dashboard - Full Screen`}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{dashboard.description}</p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="relative w-full h-64 border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden group/iframe hover:border-coral/40 transition-colors">
                <iframe
                  src="https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d"
                  frameBorder="0"
                  allowFullScreen={true}
                  className="absolute top-0 left-0 w-full h-full rounded-lg transition-opacity group-hover/iframe:opacity-90"
                  title={`${dashboard.title} Dashboard`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coral/10 to-transparent opacity-0 group-hover/iframe:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full bg-mint animate-pulse`} />
                  <span className="text-xs font-medium text-mint">Live Data</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {dashboard.lastUpdated}
                </div>
              </div>
            </CardContent>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-lg bg-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-coral/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-coral">$2.4M</div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="border-mint/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-mint">87%</div>
            <p className="text-sm text-muted-foreground">Retention Rate</p>
          </CardContent>
        </Card>
        <Card className="border-tangerine/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-tangerine">1,247</div>
            <p className="text-sm text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card className="border-lavender/30 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-lavender">23.5%</div>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Warehouse;
