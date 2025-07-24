
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ChartBar, Plus, Edit, Trash2, ExternalLink } from "lucide-react";

interface PowerBIDashboard {
  id: string;
  name: string;
  url: string;
  section: string;
}

const Settings = () => {
  const [dashboards, setDashboards] = useState<PowerBIDashboard[]>([
    {
      id: "1",
      name: "Customer Analytics",
      url: "https://app.powerbi.com/reportEmbed?reportId=58fff6f7-f29b-4318-9b56-e7bf0063ea90&autoAuth=true&ctid=1e5b3c3f-31c6-4542-9f7b-66622064c37d",
      section: "dashboard"
    }
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<PowerBIDashboard | null>(null);
  const [newDashboard, setNewDashboard] = useState({
    name: "",
    url: "",
    section: "dashboard"
  });

  const sections = [
    { value: "dashboard", label: "Main Dashboard" },
    { value: "warehouse", label: "Warehouse Analytics" },
    { value: "operator", label: "Operator Panel" },
    { value: "feedback", label: "Feedback Loop" }
  ];

  const handleAddDashboard = () => {
    if (newDashboard.name && newDashboard.url) {
      const dashboard: PowerBIDashboard = {
        id: Date.now().toString(),
        ...newDashboard
      };
      setDashboards([...dashboards, dashboard]);
      setNewDashboard({ name: "", url: "", section: "dashboard" });
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateDashboard = () => {
    if (editingDashboard) {
      setDashboards(dashboards.map(d => 
        d.id === editingDashboard.id ? editingDashboard : d
      ));
      setEditingDashboard(null);
    }
  };

  const handleDeleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Operator Engine preferences and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power BI Dashboards Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="w-5 h-5 text-coral" />
                  Power BI Dashboards
                </CardTitle>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-coral hover:bg-coral/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Dashboard
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Power BI Dashboard</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Dashboard Name</label>
                        <Input
                          placeholder="e.g., Customer Analytics"
                          value={newDashboard.name}
                          onChange={(e) => setNewDashboard({...newDashboard, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Power BI Embed URL</label>
                        <Input
                          placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                          value={newDashboard.url}
                          onChange={(e) => setNewDashboard({...newDashboard, url: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Display Section</label>
                        <Select 
                          value={newDashboard.section} 
                          onValueChange={(value) => setNewDashboard({...newDashboard, section: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section.value} value={section.value}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddDashboard} className="bg-coral hover:bg-coral/90 flex-1">
                          Add Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboards.map((dashboard) => (
                  <div key={dashboard.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{dashboard.name}</h3>
                        <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">
                          {sections.find(s => s.value === dashboard.section)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-96">
                        {dashboard.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={dashboard.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Dialog open={editingDashboard?.id === dashboard.id} onOpenChange={(open) => !open && setEditingDashboard(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingDashboard(dashboard)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Dashboard</DialogTitle>
                          </DialogHeader>
                          {editingDashboard && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Dashboard Name</label>
                                <Input
                                  value={editingDashboard.name}
                                  onChange={(e) => setEditingDashboard({...editingDashboard, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Power BI Embed URL</label>
                                <Input
                                  value={editingDashboard.url}
                                  onChange={(e) => setEditingDashboard({...editingDashboard, url: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Display Section</label>
                                <Select 
                                  value={editingDashboard.section} 
                                  onValueChange={(value) => setEditingDashboard({...editingDashboard, section: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sections.map((section) => (
                                      <SelectItem key={section.value} value={section.value}>
                                        {section.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleUpdateDashboard} className="bg-coral hover:bg-coral/90 flex-1">
                                  Update
                                </Button>
                                <Button variant="outline" onClick={() => setEditingDashboard(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteDashboard(dashboard.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {dashboards.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ChartBar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No Power BI dashboards configured yet.</p>
                    <p className="text-sm">Click "Add Dashboard" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Channel Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">WhatsApp Integration</label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Push Notifications</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">SMS Gateway</label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">AI Suggestion Level</label>
              <Select defaultValue="balanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Sentiment Analysis Sensitivity</label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
