import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChartBar, Maximize, Settings } from "lucide-react";

interface PowerBICardProps {
  title?: string;
  embedUrl?: string;
  className?: string;
}

const PowerBICard = ({ 
  title = "Core Analytics Dashboard",
  embedUrl = "https://app.powerbi.com/reportEmbed?reportId=sample-id&autoAuth=true&ctid=sample-tenant",
  className = ""
}: PowerBICardProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <Card className={`border-lavender/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5 text-coral" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-coral/20 text-coral hover:bg-coral/5 transition-all hover:scale-105"
                >
                  <Maximize className="w-4 h-4 mr-1" />
                  Full Screen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none">
                <DialogHeader className="absolute top-4 left-4 z-50 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                  <DialogTitle className="text-coral">{title} - Full Screen</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                    title={`${title} Full Screen`}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="border-mint/20 text-mint hover:bg-mint/5">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 rounded-lg overflow-hidden bg-gradient-to-br from-coral/5 to-mint/5 border border-border/20">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full rounded-lg"
            title={title}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerBICard;