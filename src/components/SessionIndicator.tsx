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
    <div className="fixed top-3 inset-x-0 z-[60] px-4 sm:px-0 pointer-events-none">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-end sm:items-center sm:gap-2 sm:mr-4 pointer-events-auto">
      <Badge
        variant={isVisible ? "destructive" : "secondary"}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 ${
          isVisible ? 'animate-pulse' : ''
        }`}
      >
        <Clock className="w-3 h-3" />
        <span className="font-mono tracking-wide">
          {timeLeft}
        </span>
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="hidden sm:inline-flex h-8 w-8 text-xs hover:bg-red-50 hover:text-red-600"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
};

export default SessionIndicator;
