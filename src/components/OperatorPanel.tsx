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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Bell, MessageCircle, Smile, ThumbsUp, ThumbsDown, Send, CalendarIcon, X, Users, RefreshCw, Filter, ChevronDown } from "lucide-react";
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


interface InactiveUserData {
  Registered: string;
  "Business Name": string;
  "Subscription end": string;
  "Phone Number": string;
  "Send ( Resend )": string;
}

interface InactiveUsersResponse {
  filters: {
    days_without_login: number;
    subscription_end_start?: string;
    subscription_end_end?: string;
    require_phone: boolean;
  };
  count: number;
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  rows: InactiveUserData[];
}

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

  // Inactive users data and filtering
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUserData[]>([]);
  const [inactiveUsersLoading, setInactiveUsersLoading] = useState(false);
  const [inactiveUsersFilters, setInactiveUsersFilters] = useState({
    days: 15,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    requirePhone: true,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load more state
  const [loadMoreState, setLoadMoreState] = useState({
    currentPage: 1,
    total: 0,
    limit: 100,
    hasMore: false,
    loadedCount: 0, // Track how many records are currently loaded
  });

  // Fetch inactive paid users on component mount
  useEffect(() => {
    fetchInactiveUsers(1);
  }, []);

  // Fetch inactive paid users (supports load more)
  const fetchInactiveUsers = async (page: number = 1, isLoadMore: boolean = false) => {
    setInactiveUsersLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('days', inactiveUsersFilters.days.toString());
      params.append('limit', loadMoreState.limit.toString());
      params.append('page', page.toString());

      if (inactiveUsersFilters.startDate) {
        params.append('start', format(inactiveUsersFilters.startDate, 'yyyy-MM-dd'));
      }
      if (inactiveUsersFilters.endDate) {
        params.append('end', format(inactiveUsersFilters.endDate, 'yyyy-MM-dd'));
      }
      params.append('require_phone', inactiveUsersFilters.requirePhone.toString());

      const response = await fetch(`${API_ENDPOINTS.INACTIVE_PAID_USERS}?${params}`);
      const data: InactiveUsersResponse = await response.json();

      if (response.ok) {
        if (isLoadMore) {
          // Append new data to existing data
          setInactiveUsers(prev => [...prev, ...data.rows]);
          setLoadMoreState(prev => ({
            ...prev,
            currentPage: data.page,
            total: data.total,
            hasMore: data.has_more,
            loadedCount: prev.loadedCount + data.rows.length,
          }));

          toast({
            title: "More Users Loaded",
            description: `Loaded ${data.rows.length} additional users. Total loaded: ${loadMoreState.loadedCount + data.rows.length} of ${data.total}.`,
          });
        } else {
          // Initial load - replace data
          setInactiveUsers(data.rows);
          setLoadMoreState(prev => ({
            ...prev,
            currentPage: data.page,
            total: data.total,
            hasMore: data.has_more,
            loadedCount: data.rows.length,
          }));

          toast({
            title: "Inactive Users Loaded",
            description: `Loaded ${data.rows.length} users${data.has_more ? ` (showing first ${loadMoreState.limit} of ${data.total})` : ''}.`,
          });
        }
      } else {
        toast({
          title: "Error Loading Inactive Users",
          description: data.error || "Failed to fetch inactive users data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching inactive users:', error);

      // Check if it's a CORS or network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "CORS/Network Error",
          description: "Unable to connect to the API. Check if the backend server is running and CORS is configured.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to the server. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setInactiveUsersLoading(false);
    }
  };

  // Load more handler
  const handleLoadMore = () => {
    if (loadMoreState.hasMore && !inactiveUsersLoading) {
      fetchInactiveUsers(loadMoreState.currentPage + 1, true);
    }
  };

  // Reset load more state when filters change
  const resetAndFetchUsers = () => {
    setLoadMoreState(prev => ({
      ...prev,
      currentPage: 1,
      loadedCount: 0,
    }));
    fetchInactiveUsers(1, false);
  };

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

          {/* Inactive Paid Users Section */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Inactive Paid Users
                    {inactiveUsers.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {inactiveUsers.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => resetAndFetchUsers()}
                      disabled={inactiveUsersLoading}
                      size="sm"
                      className="h-8"
                    >
                      {inactiveUsersLoading ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                    </Button>
                    <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="w-3 h-3 mr-1" />
                          Filters
                          <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                </div>

                {/* Quick Filters Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Inactive for:</span>
                    <Input
                      type="number"
                      value={inactiveUsersFilters.days}
                      onChange={(e) => {
                        setInactiveUsersFilters(prev => ({
                          ...prev,
                          days: parseInt(e.target.value) || 15
                        }));
                        resetAndFetchUsers();
                      }}
                      className="w-16 h-7 text-xs"
                      min="1"
                      max="365"
                    />
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Phone:</span>
                    <Switch
                      checked={inactiveUsersFilters.requirePhone}
                      onCheckedChange={(checked) => {
                        setInactiveUsersFilters(prev => ({
                          ...prev,
                          requirePhone: checked
                        }));
                        resetAndFetchUsers();
                      }}
                      className="scale-75"
                    />
                    <span className="text-xs text-muted-foreground">Required</span>
                  </div>

                  {(inactiveUsersFilters.startDate || inactiveUsersFilters.endDate || inactiveUsersFilters.days !== 15 || !inactiveUsersFilters.requirePhone) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInactiveUsersFilters({
                          days: 15,
                          startDate: undefined,
                          endDate: undefined,
                          requirePhone: true,
                        });
                        resetAndFetchUsers();
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Advanced Filters */}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <CollapsibleContent className="space-y-3">
                    <div className="border-t pt-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Subscription End Date Range</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`justify-start text-left font-normal text-xs h-8 px-2 ${
                                !inactiveUsersFilters.startDate && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {inactiveUsersFilters.startDate ? format(inactiveUsersFilters.startDate, "MMM dd") : "Start"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={inactiveUsersFilters.startDate}
                              onSelect={(date) => {
                                setInactiveUsersFilters(prev => ({ ...prev, startDate: date }));
                                resetAndFetchUsers();
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`justify-start text-left font-normal text-xs h-8 px-2 ${
                                !inactiveUsersFilters.endDate && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {inactiveUsersFilters.endDate ? format(inactiveUsersFilters.endDate, "MMM dd") : "End"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={inactiveUsersFilters.endDate}
                              onSelect={(date) => {
                                setInactiveUsersFilters(prev => ({ ...prev, endDate: date }));
                                resetAndFetchUsers();
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="rounded-md border">
                <Table>
                  <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-medium px-3 py-2">Business</TableHead>
                        <TableHead className="text-xs font-medium px-3 py-2">Registered</TableHead>
                        <TableHead className="text-xs font-medium px-3 py-2">Expires</TableHead>
                        <TableHead className="text-xs font-medium px-3 py-2">Phone</TableHead>
                        <TableHead className="text-center text-xs font-medium px-3 py-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {inactiveUsers.length > 0 ? (
                        inactiveUsers.map((user, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-medium px-3 py-2 text-sm">{user["Business Name"]}</TableCell>
                            <TableCell className="text-xs text-muted-foreground px-3 py-2">
                              {new Date(user.Registered).toLocaleDateString()}
                    </TableCell>
                            <TableCell className="text-xs px-3 py-2">
                              {new Date(user["Subscription end"]).toLocaleDateString()}
                    </TableCell>
                            <TableCell className="text-xs font-mono px-3 py-2">{user["Phone Number"]}</TableCell>
                            <TableCell className="px-3 py-2">
                      <div className="flex gap-1 justify-center">
                                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                          Send
                        </Button>
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Resend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                        ))
                      ) : (
                  <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {inactiveUsersLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Loading inactive users...
                      </div>
                            ) : (
                              "No inactive users found. Click refresh to load data."
                            )}
                    </TableCell>
                  </TableRow>
                      )}
                </TableBody>
              </Table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-2">
                {inactiveUsers.length > 0 ? (
                  inactiveUsers.map((user, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-card hover:bg-muted/20 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{user["Business Name"]}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Expires: {new Date(user["Subscription end"]).toLocaleDateString()}
                          </p>
                    </div>
                        <div className="flex gap-1 ml-2">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        Send
                      </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                        Resend
                      </Button>
                    </div>
                  </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Registered</span>
                          <span>{new Date(user.Registered).toLocaleDateString()}</span>
                  </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-mono">{user["Phone Number"]}</span>
                    </div>
                  </div>
                  </div>
                  ))
                ) : (
                  <div className="border rounded-lg p-6 bg-muted/20 text-center">
                    {inactiveUsersLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-muted-foreground">Loading inactive users...</span>
                </div>
                    ) : (
                      <div>
                        <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">No inactive users found.</p>
                        <p className="text-xs text-muted-foreground mt-1">Click refresh to load data.</p>
                    </div>
                    )}
                  </div>
                )}
              </div>

              {/* Load More Controls */}
              {(loadMoreState.total > 0) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      Loaded {loadMoreState.loadedCount} of {loadMoreState.total} users
                      {loadMoreState.hasMore && (
                        <span className="text-primary ml-1">
                          (+{Math.min(loadMoreState.limit, loadMoreState.total - loadMoreState.loadedCount)} more available)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Load size:</span>
                      <Select
                        value={loadMoreState.limit.toString()}
                        onValueChange={(value) => {
                          const newLimit = parseInt(value);
                          setLoadMoreState(prev => ({
                            ...prev,
                            limit: newLimit,
                          }));
                        }}
                        disabled={inactiveUsersLoading}
                      >
                        <SelectTrigger className="w-16 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Load More Button */}
                  {loadMoreState.hasMore && (
                    <div className="flex justify-center">
                      <Button
                        onClick={handleLoadMore}
                        disabled={inactiveUsersLoading}
                        variant="outline"
                        className="h-10 px-6"
                      >
                        {inactiveUsersLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Users
                            <span className="ml-2 text-xs">
                              (+{Math.min(loadMoreState.limit, loadMoreState.total - loadMoreState.loadedCount)})
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Load Complete Message */}
                  {!loadMoreState.hasMore && loadMoreState.loadedCount > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      All {loadMoreState.total} users have been loaded
                    </div>
                  )}
                </div>
              )}
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
