
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback Loop</h1>
          <p className="text-muted-foreground">
            Customer sentiment analysis and emotional intelligence insights
          </p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{metrics.openRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={metrics.openRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">{metrics.clickRate}%</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
            <Progress value={metrics.clickRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{metrics.responseRate}%</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <Progress value={metrics.responseRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <Progress value={metrics.conversionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Timeline & Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="border-l-4 border-primary pl-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{msg.message}</h3>
                    <Badge variant={msg.sentiment === "positive" ? "default" : msg.sentiment === "mixed" ? "secondary" : "destructive"}>
                      {msg.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.timestamp}</p>
                  
                  <div className="space-y-2">
                    {msg.responses.map((response, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {response.type === "emoji" && <span className="text-lg">{response.content}</span>}
                          {response.type === "reply" && <MessageCircle className="w-4 h-4 text-blue-500" />}
                          {response.type === "click" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{response.content}</p>
                          <p className="text-xs text-muted-foreground">{response.user}</p>
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
        <div className="space-y-6">
          {/* Sentiment Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentimentData.map((sentiment, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${sentiment.color}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">{sentiment.emotion}</span>
                    <span className="text-sm font-medium">{sentiment.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feedback Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackSummary.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                  <Badge variant="outline" className="text-xs">{item.metric}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Manual Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Operator Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Add your observations and follow-up actions..." rows={4} />
              <Button className="w-full">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoop;
