import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell, MessageCircle, Smile, ThumbsUp, ThumbsDown, Send, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import CategoryManager from "./CategoryManager";
import MessageCategoriesPanel, { MessageCategory } from "./MessageCategoriesPanel";
import PredefinedCategoriesPanel from "./PredefinedCategoriesPanel";
import AutomationRulesPanel, { AutomationRule } from "./AutomationRulesPanel";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "../lib/config";

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

interface BusinessData {
  id: number;
  registered: string;
  businessName: string;
  subscriptionEnd: string;
  phoneNumber: string;
}

const initialBusinesses: BusinessData[] = [
  {
    id: 1,
    registered: "2024-01-15",
    businessName: "Tech Solutions Ltd",
    subscriptionEnd: "2024-12-31",
    phoneNumber: "+254 712 345 678"
  },
  {
    id: 2,
    registered: "2024-02-20",
    businessName: "African Logistics Co.",
    subscriptionEnd: "2024-11-15",
    phoneNumber: "+254 723 456 789"
  },
  {
    id: 3,
    registered: "2024-03-10",
    businessName: "Green Energy Corp",
    subscriptionEnd: "2024-10-20",
    phoneNumber: "+254 734 567 890"
  },
  {
    id: 4,
    registered: "2024-04-05",
    businessName: "Digital Marketing Hub",
    subscriptionEnd: "2024-09-30",
    phoneNumber: "+254 745 678 901"
  },
  {
    id: 5,
    registered: "2024-05-18",
    businessName: "AgriTech Solutions",
    subscriptionEnd: "2024-08-25",
    phoneNumber: "+254 756 789 012"
  }
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

  // Business data and filtering
  const [businesses, setBusinesses] = useState<BusinessData[]>(initialBusinesses);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filteredBusinesses, setFilteredBusinesses] = useState<BusinessData[]>(initialBusinesses);

  // Filter businesses by subscription end date
  useEffect(() => {
    if (filterDate) {
      const formattedFilterDate = format(filterDate, "yyyy-MM-dd");
      const filtered = businesses.filter(business =>
        business.subscriptionEnd === formattedFilterDate
      );
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses(businesses);
    }
  }, [filterDate, businesses]);


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

      const res = await fetch(API_ENDPOINTS.NOTIFY, {
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
    <div className="space-y-5 sm:space-y-7 pb-24 sm:pb-12 lg:pb-16">
      {/* Predefined Categories section - top priority */}
      <PredefinedCategoriesPanel />
      {/* Professional Operator Panel Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-3.5">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-lg font-bold tracking-tight" style={{ color: "#FF6B6B" }}>Operator Panel</h1>
          <p className="text-xs sm:text-sm lg:text-xs text-muted-foreground">
            Intelligent notification automation and engagement engine
          </p>
        </div>
      </div>
      {/* Main content grid: categories on top, rules middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Automation Rules Panel (new and professional management) */}
          <AutomationRulesPanel
            rules={automationRules}
            onToggle={handleToggleRule}
            onEdit={handleEditRule}
            onAdd={handleAddRule}
          />
          {/* Message Composer */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Message Composer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium">Notification Type</label>
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
                  <label className="text-xs sm:text-sm font-medium">Category</label>
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

              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium">Subject/Title</label>
                <Input value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} placeholder="Enter message title..." className="mt-1" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium">Message Content</label>
                <Textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Write your message..." rows={4} className="mt-1 resize-none" />
              </div>

              <div className="flex gap-2 sm:col-span-2">
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !selectedCategory || !messageTitle || !messageContent}
                  className="w-full sm:w-auto min-w-[110px] text-sm sm:text-base py-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span className="text-sm sm:text-base">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span className="text-sm sm:text-base">SEND</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Business Notifications Table */}
          <Card>
            <CardHeader className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm sm:text-base md:text-lg">Business Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm font-medium">Filter by Subscription End:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-[140px] justify-start text-left font-normal ${
                          !filterDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDate ? format(filterDate, "yyyy-MM-dd") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterDate}
                        onSelect={setFilterDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {filterDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilterDate(undefined)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-4">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm px-2 py-2">Registered</TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 py-2">Business Name</TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 py-2">Subscription End</TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 py-2">Phone Number</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm px-2 py-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinesses.length > 0 ? (
                      filteredBusinesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="text-xs px-2 py-2">{business.registered}</TableCell>
                          <TableCell className="text-xs px-2 py-2">{business.businessName}</TableCell>
                          <TableCell className="text-xs px-2 py-2">{business.subscriptionEnd}</TableCell>
                          <TableCell className="text-xs px-2 py-2">{business.phoneNumber}</TableCell>
                          <TableCell className="px-2 py-2">
                            <div className="flex gap-1 justify-center">
                              <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                                Send
                              </Button>
                              <Button size="sm" variant="secondary" className="text-xs h-7 px-2">
                                Resend
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No businesses found for the selected date.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
              </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business) => (
                    <div key={business.id} className="border rounded-lg p-3 bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{business.businessName}</h4>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            Send
                          </Button>
                          <Button size="sm" variant="secondary" className="text-xs h-7 px-2">
                            Resend
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div><span className="font-medium">Registered:</span> {business.registered}</div>
                        <div><span className="font-medium">Expires:</span> {business.subscriptionEnd}</div>
                        <div className="col-span-2"><span className="font-medium">Phone:</span> {business.phoneNumber}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/20 text-center">
                    <p className="text-muted-foreground">No businesses found for the selected date.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">



          {/* AI Suggestions */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3 sm:p-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
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
                  <p className="text-xs sm:text-sm break-words">{suggestion.suggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Categories section - merged at top, so you can remove here if duplicate */}
          {/* Recent Activity */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3 sm:p-4">
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <span className="truncate flex-1 min-w-0">Welcome Email Sent</span>
                <Badge variant="secondary" className="text-xs">2m ago</Badge>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <span className="truncate flex-1 min-w-0">Payment Reminder</span>
                <Badge variant="secondary" className="text-xs">5m ago</Badge>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <span className="truncate flex-1 min-w-0">Engagement Push</span>
                <Badge variant="secondary" className="text-xs">12m ago</Badge>
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
