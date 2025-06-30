
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { Eye, EyeOff, Check, X, AlertCircle, Copy } from 'lucide-react';

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
    firstName: '',
    lastName: '',
    username: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Email validation - only for signup
  const { isChecking, emailExists, hasChecked } = useEmailValidation(mode === 'signup' ? formData.email : '');
  
  // Password strength validation
  const passwordStrength = usePasswordStrength(formData.password);

  // Clear validation flags on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setFirstNameError('');
      setLastNameError('');
      setPasswordsMatch(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle name field changes with character limits
  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    // Remove numeric characters and limit to 20 characters
    const cleanValue = value.replace(/[0-9]/g, '').slice(0, 20);
    
    setFormData(prev => ({ ...prev, [field]: cleanValue }));
    
    // Show error if original value was longer or contained numbers
    if (value.length > 20 || /[0-9]/.test(value)) {
      if (field === 'firstName') {
        setFirstNameError('Character length is too long');
      } else {
        setLastNameError('Character length is too long');
      }
      
      // Clear error after 3 seconds
      setTimeout(() => {
        if (field === 'firstName') {
          setFirstNameError('');
        } else {
          setLastNameError('');
        }
      }, 3000);
    } else {
      if (field === 'firstName') {
        setFirstNameError('');
      } else {
        setLastNameError('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName') {
      handleNameChange(name, value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password match
    if ((name === 'password' || name === 'confirmPassword') && mode === 'signup') {
      const newFormData = { ...formData, [name]: value };
      setPasswordsMatch(newFormData.password === newFormData.confirmPassword || newFormData.confirmPassword === '');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const useSuggestedPassword = () => {
    if (passwordStrength.suggestion) {
      setFormData(prev => ({ 
        ...prev, 
        password: passwordStrength.suggestion!,
        confirmPassword: passwordStrength.suggestion!
      }));
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
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        // Validation for signup
        if (!formData.firstName || !formData.lastName) {
          toast.error('First name and last name are required');
          setIsSubmitting(false);
          return;
        }
        
        if (!formData.username) {
          toast.error('Username is required');
          setIsSubmitting(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setPasswordsMatch(false);
          setIsSubmitting(false);
          return;
        }
        
        if (!passwordStrength.isStrong) {
          toast.error('Password does not meet strength requirements');
          setIsSubmitting(false);
          return;
        }
        
        if (emailExists) {
          toast.error('Email already exists');
          setIsSubmitting(false);
          return;
        }
        
        // Validate username
        if (formData.username.length < 5 || /\s/.test(formData.username) || /[^a-zA-Z0-9_]/.test(formData.username)) {
          toast.error('Username must be at least 5 characters with no spaces or special characters');
          setIsSubmitting(false);
          return;
        }
        
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName, formData.username);
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
    <>
      <Helmet>
        <title>{mode === 'login' ? 'Login - Paym.me' : 'Sign Up - Paym.me'}</title>
        <meta name="description" content={mode === 'login' ? 'Log in to your Paym.me account to manage your payment profile and links.' : 'Create your Paym.me account and start building your professional payment profile.'} />
      </Helmet>
      
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
                  <div className="grid grid-cols-2 gap-4">
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
                        className={firstNameError ? 'border-red-500' : ''}
                      />
                      {firstNameError && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {firstNameError}
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
                        className={lastNameError ? 'border-red-500' : ''}
                      />
                      {lastNameError && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {lastNameError}
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
                    className={emailExists ? 'border-red-500' : ''}
                  />
                  {mode === 'signup' && hasChecked && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isChecking ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      ) : emailExists ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {mode === 'signup' && emailExists && (
                  <p className="text-xs text-red-500">Email already exists</p>
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
                {mode === 'signup' && (
                  <div className="space-y-2">
                    {formData.password && (
                      <div className="space-y-1">
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
                      </div>
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
                      required 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={!passwordsMatch ? 'border-red-500' : ''}
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
                  {!passwordsMatch && formData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full mb-4" 
                disabled={isSubmitting || (mode === 'signup' && (emailExists || !passwordStrength.isStrong || !passwordsMatch))}
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
    </>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup" />;
