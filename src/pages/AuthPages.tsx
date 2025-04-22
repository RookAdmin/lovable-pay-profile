
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we'd handle authentication here
    if (mode === 'login') {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Log in to your account' : 'Create an account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Enter your email and password to log in to your account'
              : 'Enter your details to create a new account'
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="flex">
                  <div className="bg-muted rounded-l-lg py-2 px-3">
                    <span className="text-sm text-muted-foreground">paym.me/</span>
                  </div>
                  <Input 
                    id="username" 
                    name="username"
                    placeholder="yourusername" 
                    required 
                    value={formData.username}
                    onChange={handleChange}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Min 5 characters, no spaces or special characters
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="name@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                {mode === 'login' && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4">
              {mode === 'login' ? 'Log in' : 'Sign up'}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              {mode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <Link 
                to={mode === 'login' ? '/signup' : '/login'} 
                className="text-primary hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup" />;
