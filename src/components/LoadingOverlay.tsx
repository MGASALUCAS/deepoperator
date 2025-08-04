import { useEffect, useState } from "react";
import { Loader2, Sparkles, Database, Zap } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const phrases = [
    { text: "Running Pipelines", icon: Database },
    { text: "Focusing on Bottlenecks", icon: Zap },
    { text: "Cooking Something Beautiful", icon: Sparkles },
    { text: "Redirecting in a Few Moments", icon: Loader2 }
  ];

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      const interval = setInterval(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      }, 1200);
      return () => clearInterval(interval);
    } else {
      // Fade out delay
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, phrases.length]);

  if (!isVisible) return null;

  const CurrentIcon = phrases[currentPhrase].icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-md transition-opacity duration-500 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="relative mt-16 sm:mt-20 md:mt-24">
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-coral/20 via-mint/20 to-violet/20 blur-3xl animate-pulse" />
        
        {/* Main loading card */}
        <div className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Rotating icon container */}
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="w-20 h-20 rounded-full border-2 border-coral/20 border-t-coral animate-spin" />
              
              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral/10 to-mint/10 flex items-center justify-center">
                  <CurrentIcon className="w-6 h-6 text-coral animate-pulse" />
                </div>
              </div>
            </div>

            {/* Animated text */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground animate-fade-in">
                {phrases[currentPhrase].text}
              </h3>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-coral rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-coral to-mint rounded-full animate-pulse" 
                   style={{ width: `${((currentPhrase + 1) / phrases.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-coral/40 rounded-full animate-ping"
            style={{
              top: `${20 + (i * 10)}%`,
              left: `${15 + (i * 15)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay;