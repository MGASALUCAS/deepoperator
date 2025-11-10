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
    <Card
      className={`border-lavender/20 overflow-hidden flex flex-col min-h-[24rem] sm:min-h-[30rem] lg:min-h-[28rem] xl:min-h-[30rem] ${className}`}
    >
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 min-w-0 flex-1 text-sm sm:text-base">
            <ChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-coral flex-none" />
            <span className="truncate">{title}</span>
          </CardTitle>
          <div className="flex gap-2 flex-none">
            <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-coral/20 text-coral hover:bg-coral/5 transition-all hover:scale-105 flex-none"
                >
                  <Maximize className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Full Screen</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 rounded-none border-none overflow-hidden">
                <DialogHeader className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 bg-background/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 border shadow-lg">
                  <DialogTitle className="text-coral text-sm sm:text-base">{title} - Full Screen</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full overflow-hidden">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full border-0"
                    title={`${title} Full Screen`}
                    style={{
                      minHeight: '100vh',
                      minWidth: '100vw',
                      overflow: 'hidden'
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="border-mint/20 text-mint hover:bg-mint/5 flex-none"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-[20rem] sm:min-h-[26rem] lg:min-h-[26rem] xl:min-h-[30rem]">
        <div className="relative w-full h-full min-h-[20rem] sm:min-h-[26rem] lg:min-h-[28rem] xl:min-h-[32rem] rounded-lg overflow-hidden bg-gradient-to-br from-coral/5 to-mint/5 border border-border/20">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-lg border-0"
            title={title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              minHeight: '340px'
            }}
          />
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-mint/10 backdrop-blur-sm opacity-0 transition-opacity duration-300 pointer-events-none" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerBICard;
