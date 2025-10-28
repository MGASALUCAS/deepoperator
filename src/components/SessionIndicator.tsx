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
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center space-x-2">
        <Badge 
          variant={isVisible ? "destructive" : "secondary"}
          className={`flex items-center space-x-1 transition-all duration-300 ${
            isVisible ? 'animate-pulse' : ''
          }`}
        >
          <Clock className="w-3 h-3" />
          <span className="text-xs font-mono">
            {timeLeft}
          </span>
        </Badge>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-6 px-2 text-xs hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default SessionIndicator;
