import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { Eye, EyeOff, X, Copy } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const passwordStrength = usePasswordStrength(password);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordsMatch(value === confirmPassword || confirmPassword === '');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(password === value || value === '');
  };

  const useSuggestedPassword = () => {
    if (passwordStrength.suggestion) {
      setPassword(passwordStrength.suggestion);
      setConfirmPassword(passwordStrength.suggestion);
      setPasswordsMatch(true);
    }
  };

  const copyPasswordSuggestion = () => {
    if (passwordStrength.suggestion) {
      navigator.clipboard.writeText(passwordStrength.suggestion);
      toast.success('Password copied to clipboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setPasswordsMatch(false);
      return;
    }
    
    if (!passwordStrength.isStrong) {
      toast.error('Password does not meet strength requirements');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully! Please log in with your new password.');
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Paym.me</title>
        <meta name="description" content="Create a new password for your Paym.me account." />
      </Helmet>
      
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold">
              Reset your password
            </CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required 
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 flex-1 rounded ${
                        passwordStrength.score === 0 ? 'bg-gray-200' :
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {passwordStrength.score <= 2 ? 'Weak' :
                         passwordStrength.score <= 3 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <X size={10} className="text-red-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {passwordStrength.suggestion && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-blue-800">
                          Suggested strong password:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-white px-2 py-1 rounded border flex-1 font-mono">
                            {passwordStrength.suggestion}
                          </code>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copyPasswordSuggestion}
                            className="h-8 px-2"
                          >
                            <Copy size={14} />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={useSuggestedPassword}
                            className="h-8 px-3 text-xs"
                          >
                            Use
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required 
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={!passwordsMatch ? 'border-red-500' : ''}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!passwordsMatch && confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !passwordStrength.isStrong || !passwordsMatch}
              >
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
