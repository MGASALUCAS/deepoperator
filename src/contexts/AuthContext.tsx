import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid passwords
const VALID_PASSWORDS = ['2030', 'data'];

// Token storage key
const TOKEN_KEY = 'kuza_auth_token';
const TOKEN_EXPIRY_KEY = 'kuza_auth_expiry';

// 2 hours in milliseconds
const TOKEN_DURATION = 2 * 60 * 60 * 1000;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is valid on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        
        if (token && expiry) {
          const now = Date.now();
          const expiryTime = parseInt(expiry, 10);
          
          if (now < expiryTime) {
            setIsAuthenticated(true);
          } else {
            // Token expired, clear it
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (password: string): boolean => {
    if (VALID_PASSWORDS.includes(password)) {
      const now = Date.now();
      const expiryTime = now + TOKEN_DURATION;
      
      localStorage.setItem(TOKEN_KEY, 'authenticated');
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setIsAuthenticated(false);
  };

  // Check token expiry every minute
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (expiry) {
        const now = Date.now();
        const expiryTime = parseInt(expiry, 10);
        
        if (now >= expiryTime) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
