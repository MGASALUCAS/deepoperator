import { useState, useEffect, useCallback, useRef } from "react";
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
import { Bell, MessageCircle, Smile, ThumbsUp, ThumbsDown, Send, CalendarIcon, X, Users, RefreshCw, Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  error?: string;
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

  // Amazon-style pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100, // Default like Amazon's larger view
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Store all data for client-side pagination
  const [allInactiveUsers, setAllInactiveUsers] = useState<InactiveUserData[]>([]);

  // Load all data on component mount for client-side pagination
  useEffect(() => {
    fetchAllInactiveUsers();
  }, []);

  // Request deduplication and caching (Amazon-style optimization)
  const activeRequestsRef = useRef<Set<string>>(new Set());
  const responseCacheRef = useRef<Map<string, { data: InactiveUsersResponse, timestamp: number }>>(new Map());

  // Cache duration: 5 minutes for filter results
  const CACHE_DURATION = 5 * 60 * 1000;

  // Amazon-style retry logic with exponential backoff
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError = error instanceof Error && (
          error.name === 'AbortError' ||
          error.message.includes('network') ||
          error.message.includes('fetch') ||
          error.message.includes('HTTP 5') ||
          error.message.includes('HTTP 429')
        );

        if (isLastAttempt || !isRetryableError) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000; // Exponential backoff with jitter
        console.log(`🔄 [Amazon] Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Amazon-quality data fetching with comprehensive error handling and performance optimization
  const fetchAllInactiveUsers = async () => {
    // Generate request signature for deduplication (prevents duplicate requests)
    const requestSignature = JSON.stringify({
      days: inactiveUsersFilters.days,
      startDate: inactiveUsersFilters.startDate?.toISOString(),
      endDate: inactiveUsersFilters.endDate?.toISOString(),
      requirePhone: inactiveUsersFilters.requirePhone
    });

    // Prevent duplicate concurrent requests (Amazon UX pattern)
    if (activeRequestsRef.current.has(requestSignature)) {
      console.log('🚫 [Amazon] Duplicate request prevented:', requestSignature.substring(0, 8));
      return;
    }

    // Check cache first (Amazon performance optimization)
    const cachedResponse = responseCacheRef.current.get(requestSignature);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_DURATION) {
      console.log('⚡ [Amazon] Using cached response for:', requestSignature.substring(0, 8));
      const data = cachedResponse.data;

      // Apply cached data immediately
      setAllInactiveUsers(data.rows);
      const totalItems = Math.max(0, data.total || data.rows.length);
      const totalPages = Math.max(1, Math.ceil(totalItems / pagination.itemsPerPage));

      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: totalPages > 1,
        hasPrevPage: false,
      }));

      applyClientSidePagination(1, pagination.itemsPerPage, data.rows);

      toast({
        title: "Data Loaded Instantly",
        description: `Found ${totalItems.toLocaleString()} users from cache.`,
        variant: "default"
      });

      return; // Skip network request
    }

    // Add to active requests tracker
    activeRequestsRef.current.add(requestSignature);
    setInactiveUsersLoading(true);

    // Show loading feedback for long-running requests
    const loadingToastId = setTimeout(() => {
      if (inactiveUsersLoading) {
        toast({
          title: "Loading Data",
          description: "Fetching user data... This may take a moment for large datasets.",
          variant: "default"
        });
      }
    }, 3000);

    try {
      const params = new URLSearchParams();
      params.append('days', inactiveUsersFilters.days.toString());

      // Build filter parameters with robust validation
      if (inactiveUsersFilters.startDate) {
        try {
          const formattedDate = format(inactiveUsersFilters.startDate, 'yyyy-MM-dd');
          params.append('registered_start', formattedDate);
        } catch (dateError) {
          console.error('❌ [Amazon] Invalid start date format:', inactiveUsersFilters.startDate);
          throw new Error('Invalid registration start date format');
        }
      }

      if (inactiveUsersFilters.endDate) {
        try {
          const formattedDate = format(inactiveUsersFilters.endDate, 'yyyy-MM-dd');
          params.append('subscription_end_end', formattedDate);
        } catch (dateError) {
          console.error('❌ [Amazon] Invalid end date format:', inactiveUsersFilters.endDate);
          throw new Error('Invalid expiration end date format');
        }
      }

      params.append('require_phone', inactiveUsersFilters.requirePhone.toString());

      // Amazon-style comprehensive logging for production debugging
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('🔍 [Amazon] Fetching users with filters:', {
        requestId: requestId.substring(0, 8),
        filters: {
          days: inactiveUsersFilters.days,
          registered_start: inactiveUsersFilters.startDate ? format(inactiveUsersFilters.startDate, 'yyyy-MM-dd') : null,
          subscription_end_end: inactiveUsersFilters.endDate ? format(inactiveUsersFilters.endDate, 'yyyy-MM-dd') : null,
          require_phone: inactiveUsersFilters.requirePhone
        },
        hasFilters: !!(inactiveUsersFilters.startDate || inactiveUsersFilters.endDate),
        timestamp: new Date().toISOString()
      });

      // Add timeout and request tracing (Amazon reliability patterns)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('⏰ [Amazon] Request timeout for:', requestId.substring(0, 8));
        controller.abort();
      }, 90000); // 90s timeout for large datasets

      const response = await retryWithBackoff(async () => {
        return fetch(`${API_ENDPOINTS.INACTIVE_PAID_USERS}?${params}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
            'X-Client-Version': '1.0.0'
          }
        });
      }, 2, 2000); // 2 retries with 2s base delay

      clearTimeout(timeoutId);

      // Handle HTTP errors with specific status codes
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: InactiveUsersResponse = await response.json();

      // Validate response structure (Amazon data validation)
      if (!data) {
        throw new Error('Invalid API response - received empty or null response');
      }

      if (!Array.isArray(data.rows)) {
        throw new Error('Invalid API response structure - rows must be an array');
      }

      // Calculate pagination info with bounds checking and multiple fallbacks
      const totalItems = Math.max(0,
        (typeof data.total === 'number' ? data.total : null) ||
        (typeof data.count === 'number' ? data.count : null) ||
        data.rows.length
      );

      // More flexible total count validation with fallbacks
      if (typeof data.total !== 'number' && typeof data.count !== 'number') {
        console.warn('⚠️ [Amazon] API response missing both total and count fields, using rows.length as fallback');
      }

      console.log('✅ [Amazon] Successfully fetched users:', {
        requestId: requestId.substring(0, 8),
        totalRecords: totalItems,
        totalSource: typeof data.total === 'number' ? 'total' : (typeof data.count === 'number' ? 'count' : 'rows.length'),
        rowsReceived: data.rows.length,
        hasMore: data.has_more,
        filtersApplied: !!(inactiveUsersFilters.startDate || inactiveUsersFilters.endDate),
        responseTime: new Date().toISOString()
      });

      // Store all data for client-side pagination
      setAllInactiveUsers(data.rows);
      const totalPages = Math.max(1, Math.ceil(totalItems / pagination.itemsPerPage));

      setPagination(prev => ({
        ...prev,
        currentPage: 1, // Always reset to first page on new data
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: totalPages > 1,
        hasPrevPage: false,
      }));

      // Apply initial pagination with safety checks
      applyClientSidePagination(1, pagination.itemsPerPage, data.rows);

      // Cache successful response (Amazon performance optimization)
      responseCacheRef.current.set(requestSignature, {
        data: data,
        timestamp: Date.now()
      });

      // Clean up old cache entries (keep cache size manageable)
      if (responseCacheRef.current.size > 10) {
        const oldestKey = responseCacheRef.current.keys().next().value;
        responseCacheRef.current.delete(oldestKey);
      }

      // Smart user feedback based on results
      if (totalItems === 0) {
        toast({
          title: "No Users Found",
          description: "No inactive users match your current filters. Try adjusting your search criteria.",
          variant: "default"
        });
      } else if (totalItems > 1000) {
        toast({
          title: "Large Dataset Loaded",
          description: `Successfully loaded ${totalItems.toLocaleString()} users. Use filters to narrow down results.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Users Loaded Successfully",
          description: `Found ${totalItems.toLocaleString()} inactive paid users matching your filters.`,
          variant: "default"
        });
      }

    } catch (error) {
      // Enhanced error logging with response structure analysis
      let responseStructure = null;
      try {
        // If we have a response object, try to get its structure
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as any).response;
          if (response && typeof response.json === 'function') {
            const responseData = await response.json().catch(() => null);
            if (responseData) {
              responseStructure = {
                hasTotal: typeof responseData.total === 'number',
                hasCount: typeof responseData.count === 'number',
                hasRows: Array.isArray(responseData.rows),
                rowsLength: Array.isArray(responseData.rows) ? responseData.rows.length : 'N/A',
                keys: Object.keys(responseData)
              };
            }
          }
        }
      } catch (analysisError) {
        // Ignore analysis errors
      }

      console.error('❌ [Amazon] Error fetching users:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        responseStructure,
        filters: {
          days: inactiveUsersFilters.days,
          hasStartDate: !!inactiveUsersFilters.startDate,
          hasEndDate: !!inactiveUsersFilters.endDate,
          requirePhone: inactiveUsersFilters.requirePhone
        },
        timestamp: new Date().toISOString()
      });

      // Amazon-style error categorization and user-friendly messages
      let errorTitle = "Unable to Load Users";
      let errorDescription = "We're experiencing technical difficulties. Please try again.";
      let shouldRetry = true;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorTitle = "Request Timeout";
          errorDescription = "The request took longer than expected to load your data. This might be due to a large dataset or slow connection. Please try narrowing your filters or try again.";
          shouldRetry = true;
        } else if (error.message.includes('signal is aborted')) {
          errorTitle = "Request Cancelled";
          errorDescription = "The request was cancelled, possibly due to a new filter being applied. If this persists, please try again.";
          shouldRetry = true;
        } else if (error.message.includes('HTTP 404')) {
          errorTitle = "Service Unavailable";
          errorDescription = "The user service is currently unavailable. Please try again later.";
          shouldRetry = false;
        } else if (error.message.includes('HTTP 429')) {
          errorTitle = "Too Many Requests";
          errorDescription = "Please wait a moment before trying again.";
        } else if (error.message.includes('HTTP 5')) {
          errorTitle = "Server Error";
          errorDescription = "Our servers are experiencing issues. Please try again in a few minutes.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorTitle = "Connection Problem";
          errorDescription = "Please check your internet connection and try again.";
        } else if (error.message.includes('Invalid')) {
          errorTitle = "Invalid Request";
          errorDescription = error.message;
          shouldRetry = false;
        }
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });

      // Clear data on critical errors only
      if (!shouldRetry) {
        setAllInactiveUsers([]);
        setInactiveUsers([]);
      }

    } finally {
      // Always clean up active request tracking and loading indicators
      activeRequestsRef.current.delete(requestSignature);
      setInactiveUsersLoading(false);
      clearTimeout(loadingToastId);
    }
  };

  // Apply client-side pagination to the stored data
  const applyClientSidePagination = (page: number, itemsPerPage: number, data?: InactiveUserData[]) => {
    const dataToPaginate = data || allInactiveUsers;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRows = dataToPaginate.slice(startIndex, endIndex);

    console.log('📄 Client-side pagination applied:', {
      page,
      itemsPerPage,
      startIndex,
      endIndex,
      totalData: dataToPaginate.length,
      paginatedRows: paginatedRows.length,
      showing: `${startIndex + 1}-${Math.min(endIndex, dataToPaginate.length)} of ${dataToPaginate.length}`
    });

    setInactiveUsers(paginatedRows);
  };

  // Client-side pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && !inactiveUsersLoading) {
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: page < pagination.totalPages,
      }));
      applyClientSidePagination(page, pagination.itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const totalPages = Math.ceil(pagination.totalItems / newItemsPerPage);

    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1, // Reset to first page when changing items per page
      totalPages: totalPages,
      hasNextPage: totalPages > 1,
      hasPrevPage: false,
    }));

    applyClientSidePagination(1, newItemsPerPage);
  };

  // Amazon-style date validation and filtering
  const validateDateFilters = (filters: typeof inactiveUsersFilters) => {
    const { startDate, endDate } = filters;
    const errors: string[] = [];

    // Check if dates are in reasonable ranges
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    if (startDate) {
      if (startDate < oneYearAgo) {
        errors.push('Registration start date cannot be more than 1 year ago');
      }
      if (startDate > oneYearFromNow) {
        errors.push('Registration start date cannot be more than 1 year in the future');
      }
    }

    if (endDate) {
      if (endDate < oneYearAgo) {
        errors.push('Expiration end date cannot be more than 1 year ago');
      }
      if (endDate > oneYearFromNow) {
        errors.push('Expiration end date cannot be more than 1 year in the future');
      }
    }

    return errors;
  };

  // Debounced filter change handler (Amazon-style performance optimization)
  const debouncedFilterRef = useRef<NodeJS.Timeout>();
  const handleFilterChange = useCallback(() => {
    // Clear any pending debounced calls
    if (debouncedFilterRef.current) {
      clearTimeout(debouncedFilterRef.current);
    }

    // Debounce filter changes by 300ms (Amazon UX pattern)
    debouncedFilterRef.current = setTimeout(() => {
      // Validate filters before proceeding
      const validationErrors = validateDateFilters(inactiveUsersFilters);
      if (validationErrors.length > 0) {
        toast({
          title: "Invalid Date Filters",
          description: validationErrors.join('. '),
          variant: "destructive"
        });
        return;
      }

      // Reset pagination state
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }));

      // Clear existing data
      setAllInactiveUsers([]);
      setInactiveUsers([]);

      // Fetch with validated filters
      fetchAllInactiveUsers();
    }, 300);
  }, [inactiveUsersFilters]);

  // Cleanup debounced calls on unmount
  useEffect(() => {
    return () => {
      if (debouncedFilterRef.current) {
        clearTimeout(debouncedFilterRef.current);
      }
    };
  }, []);


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
                      onClick={() => fetchAllInactiveUsers()}
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
                    <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters} className="hidden">
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
                        handleFilterChange();
                      }}
                      className="w-16 h-7 text-xs"
                      min="1"
                      max="365"
                    />
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>

                  <div className="flex items-center gap-2 hidden">
                    <span className="text-xs font-medium text-muted-foreground">Phone:</span>
                    <Switch
                      checked={inactiveUsersFilters.requirePhone}
                      onCheckedChange={(checked) => {
                        setInactiveUsersFilters(prev => ({
                          ...prev,
                          requirePhone: checked
                        }));
                        handleFilterChange();
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
                        handleFilterChange();
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
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Date Filters</h4>
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
                              {inactiveUsersFilters.startDate ? format(inactiveUsersFilters.startDate, "MMM dd") : "Registered From"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-card border border-border shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={inactiveUsersFilters.startDate}
                              onSelect={(date) => {
                                setInactiveUsersFilters(prev => ({ ...prev, startDate: date }));
                                handleFilterChange();
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
                              {inactiveUsersFilters.endDate ? format(inactiveUsersFilters.endDate, "MMM dd") : "Expires By"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-card border border-border shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={inactiveUsersFilters.endDate}
                              onSelect={(date) => {
                                setInactiveUsersFilters(prev => ({ ...prev, endDate: date }));
                                handleFilterChange();
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

              {/* Amazon-Style Pagination */}
              {(pagination.totalItems > 0) && (
                <div className="mt-6 pt-4 border-t">
                  {/* Results Summary - Amazon style */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const start = ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1;
                        const end = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems);
                        return `Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${pagination.totalItems.toLocaleString()} results`;
                      })()}
                    </div>

                    {/* Items per page selector - Amazon style */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Show:</span>
                      <Select
                        value={pagination.itemsPerPage.toString()}
                        onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
                        disabled={inactiveUsersLoading}
                      >
                        <SelectTrigger className="w-20 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                          <SelectItem value="96">96</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">per page</span>
                    </div>
                  </div>

                  {/* Pagination Controls - Amazon style */}
                  <div className="flex items-center justify-between">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || inactiveUsersLoading}
                      className="flex items-center gap-2 h-9 px-4"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages = [];
                        const totalPages = pagination.totalPages;
                        const currentPage = pagination.currentPage;

                        // Calculate page range to show (Amazon shows ~7 pages)
                        let startPage = Math.max(1, currentPage - 3);
                        let endPage = Math.min(totalPages, startPage + 6);

                        // Adjust start if we're near the end
                        if (endPage - startPage < 6) {
                          startPage = Math.max(1, endPage - 6);
                        }

                        // Add first page if not in range
                        if (startPage > 1) {
                          pages.push(
                            <Button
                              key={1}
                              variant={1 === currentPage ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePageChange(1)}
                              disabled={inactiveUsersLoading}
                              className="w-9 h-9 p-0"
                            >
                              1
                            </Button>
                          );
                          if (startPage > 2) {
                            pages.push(
                              <span key="ellipsis1" className="px-2 text-muted-foreground">...</span>
                            );
                          }
                        }

                        // Add page numbers
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <Button
                              key={i}
                              variant={i === currentPage ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePageChange(i)}
                              disabled={inactiveUsersLoading}
                              className="w-9 h-9 p-0"
                            >
                              {i}
                            </Button>
                          );
                        }

                        // Add last page if not in range
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="ellipsis2" className="px-2 text-muted-foreground">...</span>
                            );
                          }
                          pages.push(
                            <Button
                              key={totalPages}
                              variant={totalPages === currentPage ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePageChange(totalPages)}
                              disabled={inactiveUsersLoading}
                              className="w-9 h-9 p-0"
                            >
                              {totalPages}
                            </Button>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage || inactiveUsersLoading}
                      className="flex items-center gap-2 h-9 px-4"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Page Info */}
                  <div className="text-center mt-3">
                    <span className="text-xs text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </div>
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
