import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SessionIndicator: React.FC = () => {
  const { logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      try {
        const expiry = localStorage.getItem('kuza_auth_expiry');
        if (expiry) {
          const now = Date.now();
          const expiryTime = parseInt(expiry, 10);
          const remaining = expiryTime - now;

          if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
              setTimeLeft(`${hours}h ${minutes}m`);
            } else {
              setTimeLeft(`${minutes}m`);
            }

            // Show warning when less than 15 minutes left
            setIsVisible(remaining < 15 * 60 * 1000);
          } else {
            setTimeLeft('Expired');
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error calculating session time:', error);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

if (!timeLeft) return null;

  return (
    <div className="fixed top-2 right-2 z-[60] pointer-events-none">
      <div className="flex items-center gap-1 pointer-events-auto">
        {/* Time Badge - Compact version */}
        <Badge
          variant={isVisible ? "destructive" : "secondary"}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all duration-300 ${
            isVisible ? 'animate-pulse shadow-lg' : 'shadow-sm'
          }`}
        >
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="font-mono text-xs tracking-tight">
            {timeLeft}
          </span>
        </Badge>

        {/* Logout Button - Always visible but compact */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default SessionIndicator;
