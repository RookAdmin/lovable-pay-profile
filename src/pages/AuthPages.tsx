
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        if (!formData.username) {
          toast.error('Username is required');
          setIsSubmitting(false);
          return;
        }
        
        // Validate username
        if (formData.username.length < 5 || /\s/.test(formData.username) || /[^a-zA-Z0-9_]/.test(formData.username)) {
          toast.error('Username must be at least 5 characters with no spaces or special characters');
          setIsSubmitting(false);
          return;
        }
        
        await signUp(formData.email, formData.password, formData.username);
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
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
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required 
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1} // Don't include in tab order
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
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
