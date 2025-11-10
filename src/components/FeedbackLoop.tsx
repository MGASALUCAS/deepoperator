
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { MessageCircle, TrendingUp, Heart, Frown, Meh } from "lucide-react";

const FeedbackLoop = () => {
  const sentMessages = [
    {
      id: 1,
      message: "Welcome to our platform! 🎉",
      timestamp: "2 hours ago",
      responses: [
        { type: "emoji", content: "😊", user: "John D." },
        { type: "reply", content: "Thank you! Excited to get started.", user: "Jane S." },
        { type: "click", content: "Clicked welcome link", user: "Mike R." }
      ],
      sentiment: "positive"
    },
    {
      id: 2,
      message: "Payment reminder - Due in 3 days",
      timestamp: "1 day ago",
      responses: [
        { type: "reply", content: "Will pay today", user: "Sarah L." },
        { type: "emoji", content: "😟", user: "Tom W." }
      ],
      sentiment: "mixed"
    },
    {
      id: 3,
      message: "We miss you! Come back for exclusive offers",
      timestamp: "3 days ago",
      responses: [
        { type: "click", content: "Opened app", user: "Lisa M." },
        { type: "emoji", content: "❤️", user: "David K." }
      ],
      sentiment: "positive"
    }
  ];

  const metrics = {
    openRate: 87,
    clickRate: 34,
    responseRate: 23,
    conversionRate: 12
  };

  const sentimentData = [
    { emotion: "Very Positive", count: 45, color: "bg-green-500" },
    { emotion: "Positive", count: 78, color: "bg-green-300" },
    { emotion: "Neutral", count: 32, color: "bg-gray-300" },
    { emotion: "Negative", count: 15, color: "bg-red-300" },
    { emotion: "Very Negative", count: 8, color: "bg-red-500" }
  ];

  const feedbackSummary = [
    {
      title: "Most Appreciated Message",
      content: "Welcome to our platform! 🎉",
      metric: "92% positive sentiment"
    },
    {
      title: "Top Complaint Theme",
      content: "Payment reminders too frequent",
      metric: "23 mentions this week"
    },
    {
      title: "Re-engaged Users",
      content: "Successful re-activation campaign",
      metric: "156 users returned"
    }
  ];

  return (
    <div className="space-y-5 sm:space-y-6 pb-24 sm:pb-12 lg:pb-16">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 sm:gap-3.5">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Feedback Loop</h1>
          <p className="text-xs sm:text-sm lg:text-sm text-muted-foreground">
            Customer sentiment analysis and emotional intelligence insights
          </p>
        </div>
        <Button className="w-full sm:w-auto text-sm sm:text-base lg:text-sm px-4 py-2 sm:py-2.5">
          <MessageCircle className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Export Report</span>
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Open Rate</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{metrics.openRate}%</p>
              </div>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500 flex-shrink-0" />
            </div>
            <Progress value={metrics.openRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Click Rate</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{metrics.clickRate}%</p>
              </div>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-500 flex-shrink-0" />
            </div>
            <Progress value={metrics.clickRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Response Rate</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{metrics.responseRate}%</p>
              </div>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500 flex-shrink-0" />
            </div>
            <Progress value={metrics.responseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Conversion Rate</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-500 flex-shrink-0" />
            </div>
            <Progress value={metrics.conversionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
        {/* Message Timeline */}
        <div className="lg:col-span-2 space-y-3.5 sm:space-y-5">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Message Timeline & Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3.5 sm:p-5">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="border-l-4 border-primary pl-3 sm:pl-4 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-medium text-xs sm:text-sm break-words flex-1 min-w-0">{msg.message}</h3>
                    <Badge variant={msg.sentiment === "positive" ? "default" : msg.sentiment === "mixed" ? "secondary" : "destructive"} className="text-xs flex-shrink-0">
                      {msg.sentiment}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{msg.timestamp}</p>

                  <div className="space-y-2">
                    {msg.responses.map((response, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {response.type === "emoji" && <span className="text-sm sm:text-base">{response.content}</span>}
                          {response.type === "reply" && <MessageCircle className="w-4 h-4 text-blue-500" />}
                          {response.type === "click" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] sm:text-xs break-words">{response.content}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">{response.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sentiment & Summary */}
        <div className="space-y-3.5 sm:space-y-5">
          {/* Sentiment Heatmap */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Sentiment Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3 sm:p-4">
              {sentimentData.map((sentiment, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0 ${sentiment.color}`} />
                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <span className="text-xs sm:text-sm truncate">{sentiment.emotion}</span>
                    <span className="text-xs sm:text-sm font-medium flex-shrink-0">{sentiment.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feedback Summary */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3.5 sm:p-4">
              {feedbackSummary.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-xs sm:text-sm mb-1">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">{item.content}</p>
                  <Badge variant="outline" className="text-xs">{item.metric}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Manual Notes */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Operator Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3.5 sm:p-4">
              <Textarea placeholder="Add your observations and follow-up actions..." rows={4} className="resize-none text-xs sm:text-sm" />
              <Button className="w-full text-sm sm:text-base py-2 sm:py-2.5">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoop;
