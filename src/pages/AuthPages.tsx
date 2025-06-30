
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useNameValidation } from '@/hooks/useNameValidation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation hooks
  const { emailExists, validationMessage: emailValidationMessage, isChecking } = useEmailValidation(formData.email);
  const { isValid: isPasswordValid } = usePasswordValidation(formData.password);
  const { isValid: isFirstNameValid, message: firstNameMessage } = useNameValidation(formData.firstName, 'First name');
  const { isValid: isLastNameValid, message: lastNameMessage } = useNameValidation(formData.lastName, 'Last name');

  // Set page title
  useEffect(() => {
    document.title = mode === 'login' ? 'Login - Rook Payment Platform' : 'Sign Up - Rook Payment Platform';
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        toast.error('First name is required');
        return false;
      }
      if (!formData.lastName.trim()) {
        toast.error('Last name is required');
        return false;
      }
      if (!isFirstNameValid) {
        toast.error('Please fix first name errors');
        return false;
      }
      if (!isLastNameValid) {
        toast.error('Please fix last name errors');
        return false;
      }
      if (!formData.username) {
        toast.error('Username is required');
        return false;
      }
      if (formData.username.length < 5 || /\s/.test(formData.username) || /[^a-zA-Z0-9_]/.test(formData.username)) {
        toast.error('Username must be at least 5 characters with no spaces or special characters');
        return false;
      }
      if (emailExists) {
        toast.error('Email already exists. Please use a different email.');
        return false;
      }
      if (!isPasswordValid) {
        toast.error('Please create a stronger password');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.username, formData.firstName, formData.lastName);
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

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
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="John" 
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      maxLength={20}
                      className={!isFirstNameValid && formData.firstName ? 'border-red-500' : ''}
                    />
                    {formData.firstName && (
                      <p className={`text-xs ${isFirstNameValid ? 'text-green-600' : 'text-red-500'}`}>
                        {firstNameMessage}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Doe" 
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      maxLength={20}
                      className={!isLastNameValid && formData.lastName ? 'border-red-500' : ''}
                    />
                    {formData.lastName && (
                      <p className={`text-xs ${isLastNameValid ? 'text-green-600' : 'text-red-500'}`}>
                        {lastNameMessage}
                      </p>
                    )}
                  </div>
                </div>

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
              </>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className={mode === 'signup' && emailExists ? 'border-red-500' : ''}
                />
                {isChecking && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              {mode === 'signup' && formData.email && emailValidationMessage && (
                <p className={`text-xs ${emailExists ? 'text-red-500' : 'text-green-600'}`}>
                  {emailValidationMessage}
                </p>
              )}
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
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mode === 'signup' && <PasswordStrengthIndicator password={formData.password} />}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={passwordsDontMatch ? 'border-red-500' : passwordsMatch ? 'border-green-500' : ''}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full mb-4" 
              disabled={isSubmitting || (mode === 'signup' && (emailExists || !isPasswordValid || !isFirstNameValid || !isLastNameValid))}
            >
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
