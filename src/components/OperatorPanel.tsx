import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Bell, MessageCircle, Smile, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import CategoryManager from "./CategoryManager";
import MessageCategoriesPanel, { MessageCategory } from "./MessageCategoriesPanel";
import PredefinedCategoriesPanel from "./PredefinedCategoriesPanel";
import AutomationRulesPanel, { AutomationRule } from "./AutomationRulesPanel";
import { useToast } from "@/hooks/use-toast";

const initialCategories: MessageCategory[] = [
  {
    name: "Onboarding",
    icon: "👋",
    count: 5,
    messages: [
      { id: 1, title: "Welcome!", content: "Welcome to the platform, let's get started!" },
      { id: 2, title: "Intro Offer", content: "Check out our special offer for new users." },
    ],
  },
  {
    name: "Financial",
    icon: "💰",
    count: 8,
    messages: [
      { id: 1, title: "Payment Due", content: "Please pay your invoice due today." },
    ],
  },
  {
    name: "Engagement",
    icon: "🎯",
    count: 12,
    messages: [],
  },
  {
    name: "Support",
    icon: "🛠️",
    count: 6,
    messages: [],
  },
  {
    name: "Marketing",
    icon: "📢",
    count: 9,
    messages: [],
  },
  {
    name: "Retention",
    icon: "💎",
    count: 4,
    messages: [],
  },
];

const initialRules: AutomationRule[] = [
  {
    id: 1,
    name: "Welcome New Users",
    trigger: "User Registration",
    action: "Send Welcome Email",
    status: "active",
    category: "Onboarding"
  },
  {
    id: 2,
    name: "Payment Reminder",
    trigger: "Overdue Payment > 7 days",
    action: "WhatsApp + Email",
    status: "active",
    category: "Financial"
  },
  {
    id: 3,
    name: "Engagement Boost",
    trigger: "No login > 14 days",
    action: "Push Notification",
    status: "paused",
    category: "Engagement"
  },
  // Add more demo/future-proof rules here as needed.
];

const OperatorPanel = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MessageCategory[]>(initialCategories);
  const [activeRule, setActiveRule] = useState(null);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialRules);
  const [isLoading, setIsLoading] = useState(false);

  const [notificationType, setNotificationType] = useState("push");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");


  // --- Rules handlers for the AutomationRulesPanel ---
  const handleToggleRule = (id: number, newStatus: "active" | "paused") => {
    setAutomationRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, status: newStatus } : rule
      )
    );
  };

  const handleEditRule = (updatedRule: AutomationRule) => {
    setAutomationRules(rules =>
      rules.map(rule => rule.id === updatedRule.id ? updatedRule : rule)
    );
  };

  const handleAddRule = (newRule: Omit<AutomationRule, "id">) => {
    setAutomationRules(rules => [
      ...rules,
      { ...newRule, id: Date.now() }
    ]);
  };

  // Add new category
  const handleAddCategory = () => {
    // In real-case, pop up modal
    const name = prompt("Category name?");
    if (!name) return;
    setCategories([
      ...categories,
      {
        name,
        icon: "📄",
        count: 0,
        messages: [],
      },
    ]);
  };

  // Add message to a category
  const handleAddMessage = (categoryName: string, title: string, content: string) => {
    setCategories((cats) =>
      cats.map((cat) =>
        cat.name === categoryName
          ? { ...cat, messages: [...cat.messages, { id: Date.now(), title, content }], count: cat.messages.length + 1 }
          : cat
      )
    );
  };


  const handleSend = async () => {
    if (!selectedCategory || !messageTitle || !messageContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const categoryMapping: { [key: string]: string } = {
        "onboarding": "onboarding message",
        "financial": "active subscribers", 
        "engagement": "expiring soon",
        "support": "active subscribers",
        "marketing": "active subscribers",
        "retention": "expiring soon"
      };

      const backendCategory = categoryMapping[selectedCategory] || selectedCategory;

      const res = await fetch("http://54.153.108.186/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: backendCategory,
          title: messageTitle,
          body: messageContent
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        toast({
          title: "Notification Sent Successfully! 🚀",
          description: `Message delivered to ${data.sent_to} users in the ${selectedCategory} category.`,
        });
        
        // Clear form
        setMessageTitle("");
        setMessageContent("");
        setSelectedCategory("");
      } else {
        toast({
          title: "Sending Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to notification service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Edit existing message
  const handleEditMessage = (
    categoryName: string,
    msgIdx: number,
    title: string,
    content: string
  ) => {
    setCategories((cats) =>
      cats.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              messages: cat.messages.map((msg, idx) =>
                idx === msgIdx ? { ...msg, title, content } : msg
              ),
            }
          : cat

          
      )
    );
  };

  // Add this near the top, before the return, after state declarations.
  const aiSuggestions = [
    {
      type: "Personalization",
      suggestion: "Tumia majina ya wateja kwenye ujumbe ili kuwahusisha zaidi.",
    },
    {
      type: "Timing",
      suggestion: "Tuma arifa wakati wa shughuli nyingi za watumiaji, kama muda wa jioni au mwisho wa wiki.",
    },
    {
      type: "Engagement",
      suggestion: "Ongeza ofa maalum au punguzo kuwashawishi watumiaji kuchukua hatua.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Predefined Categories section - top priority */}
      <PredefinedCategoriesPanel />
      {/* Professional Operator Panel Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#FF6B6B" }}>Operator Panel</h1>
          <p className="text-muted-foreground">
            Intelligent notification automation and engagement engine
          </p>
        </div>
      </div>
      {/* Main content grid: categories on top, rules middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Automation Rules Panel (new and professional management) */}
          <AutomationRulesPanel
            rules={automationRules}
            onToggle={handleToggleRule}
            onEdit={handleEditRule}
            onAdd={handleAddRule}
          />
          {/* Message Composer */}
          <Card>
            <CardHeader>
              <CardTitle>Message Composer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Notification Type</label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="email">Email</SelectItem> */}
                      {/* <SelectItem value="whatsapp">WhatsApp</SelectItem> */}
                      <SelectItem value="push">Push Notification</SelectItem>
                      {/* <SelectItem value="sms">SMS</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="onboarding">👋 Onboarding (New Users)</SelectItem>
                       {/* <SelectItem value="financial">💰 Financial (Active Subscribers)</SelectItem> */}
                       <SelectItem value="engagement">🎯 Engagement (Expiring Soon)</SelectItem>
                       <SelectItem value="support">🛠️ Support (Active Subscribers)</SelectItem>
                       <SelectItem value="marketing">📢 Marketing (Active Subscribers)</SelectItem>
                       <SelectItem value="retention">💎 Inactive (Don't record)</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject/Title</label>
                <Input value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} placeholder="Enter message title..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message Content</label>
                <Textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Write your message..." rows={4} />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || !selectedCategory || !messageTitle || !messageContent}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      SEND
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">



          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="w-5 h-5" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Categories section - merged at top, so you can remove here if duplicate */}
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Welcome Email Sent</span>
                <Badge variant="secondary">2m ago</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Payment Reminder</span>
                <Badge variant="secondary">5m ago</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Engagement Push</span>
                <Badge variant="secondary">12m ago</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Additional sections (such as advanced Category Manager) can go here if needed */}
    </div>
  );
};

export default OperatorPanel;
