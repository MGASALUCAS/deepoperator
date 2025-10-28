import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, Eye, EyeOff, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal: React.FC = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Clear error when password changes
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const isValid = login(password);
    
    if (isValid) {
      setPassword('');
      setAttempts(0);
    } else {
      setError('Invalid password. Please try again.');
      setAttempts(prev => prev + 1);
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-coral/20 to-coral-glow/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-coral" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Access Dashboard
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your credentials to continue
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter password"
                    className="pl-10 pr-10 h-12 text-center font-mono tracking-wider"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 pr-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-coral to-coral-glow hover:from-coral/90 hover:to-coral-glow/90 text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-muted/20">
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Session expires in 2 hours</span>
              </div>
            </div>

            {attempts > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Attempts: {attempts}/3
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthModal;
