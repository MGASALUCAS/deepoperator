import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ChartBar, Filter, TrendingUp, Settings } from "lucide-react";

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
          <Card key={index} className="hover:shadow-lg transition-shadow border-coral/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartBar className="w-5 h-5 text-coral" />
                  {dashboard.title}
                </CardTitle>
                <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/5">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{dashboard.description}</p>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-64 border-2 border-dashed border-coral/25 rounded-lg bg-coral/5 overflow-hidden">
                <iframe
                  src="https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d"
                  frameBorder="0"
                  allowFullScreen={true}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title={`${dashboard.title} Dashboard`}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Button variant="outline" size="sm" className="border-mint/20 text-mint hover:bg-mint/10">
                  Full Screen
                </Button>
                <div className="text-xs text-muted-foreground">
                  Last updated: {dashboard.lastUpdated}
                </div>
              </div>
            </CardContent>
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
