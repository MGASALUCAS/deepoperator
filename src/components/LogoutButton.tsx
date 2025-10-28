import React from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'ghost', 
  size = 'sm', 
  className = '' 
}) => {
  const { logout } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={logout}
      className={`hover:bg-red-50 hover:text-red-600 transition-colors ${className}`}
      title="Logout (Session expires in 2 hours)"
    >
      <LogOut className="w-4 h-4" />
      {size !== 'icon' && <span className="ml-2">Logout</span>}
    </Button>
  );
};

export default LogoutButton;
