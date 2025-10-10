
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Lock, Bell, AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { UserPreference } from "@/types/userPreference";
import { validateEmail } from "@/utils/validation";

interface SettingsFormProps {
  initialData: any;
  refetchProfile: () => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData, refetchProfile }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  const [emailError, setEmailError] = useState("");
  
  // State for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false
  });
  
  const [timeZone, setTimeZone] = useState("UTC");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  
  // Query user preferences
  const { data: userPreferences, isLoading: loadingPrefs, refetch: refetchPreferences } = useQuery({
    queryKey: ["user_preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserPreference;
    },
    enabled: !!user?.id,
  });
  
  // Load user preferences
  useEffect(() => {
    if (userPreferences) {
      setTimeZone(userPreferences.time_zone);
      setTfaEnabled(userPreferences.tfa_enabled);
      if (userPreferences.notification_preferences) {
        setNotificationPrefs(userPreferences.notification_preferences);
      }
    } else if (!loadingPrefs && user?.id) {
      // If no preferences exist, create default
      createDefaultPreferences();
    }
  }, [userPreferences, loadingPrefs, user?.id]);
  
  // Create default user preferences if none exist
  const createDefaultPreferences = async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          time_zone: 'UTC',
          tfa_enabled: false,
          notification_preferences: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            whatsappNotifications: false
          }
        });
        
      if (error) throw error;
      refetchPreferences();
    } catch (error: any) {
      console.error("Error creating default preferences:", error);
    }
  };
  
  useEffect(() => {
    // Check if user can change username (once every 15 days)
    const checkUsernameChangeEligibility = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username_updated_at')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data?.username_updated_at) {
          const lastChange = new Date(data.username_updated_at);
          setLastUsernameChange(lastChange);
          
          const waitPeriod = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
          const nextAllowedDate = new Date(lastChange.getTime() + waitPeriod);
          setNextChangeDate(nextAllowedDate);
          
          const now = new Date();
          setCanChangeUsername(now >= nextAllowedDate);
        }
      } catch (error) {
        console.error("Error checking username change eligibility:", error);
      }
    };
    
    checkUsernameChangeEligibility();
  }, [user?.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };
  
  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canChangeUsername) {
      toast.error("You can only change your username once every 15 days.");
      return;
    }
    
    if (!formData.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: formData.username,
          username_updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      await refetchProfile();
      toast.success("Username updated successfully");
      
      // Update state to reflect the new restrictions
      setLastUsernameChange(new Date());
      setCanChangeUsername(false);
      
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 15);
      setNextChangeDate(nextDate);
      
    } catch (error: any) {
      console.error("Error updating username:", error);
      toast.error(error.message || "Failed to update username");
    }
  };
  
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      setEmailError("Please enter a valid email address");
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ email: formData.email });
      
      if (error) throw error;
      
      toast.success("Email update initiated. Please check your inbox for verification.");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    }
  };
  
  const handleToggleTfa = async (enabled: boolean) => {
    if (!user?.id) return;
    
    try {
      setTfaEnabled(enabled);
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ tfa_enabled: enabled })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
      
      if (enabled) {
        // In a real app, this would launch the 2FA setup flow
        toast.info("In a production app, this would launch the 2FA setup flow");
      }
    } catch (error: any) {
      console.error("Error updating 2FA settings:", error);
      toast.error(error.message || "Failed to update 2FA settings");
      setTfaEnabled(!enabled); // Revert the UI state
    }
  };
  
  const handleToggleNotification = async (type: string, enabled: boolean) => {
    if (!user?.id) return;
    
    try {
      const updatedPrefs = { 
        ...notificationPrefs,
        [type]: enabled 
      };
      
      setNotificationPrefs(updatedPrefs);
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ notification_preferences: updatedPrefs })
        .eq('user_id', user.id);
        
      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating notification settings:", error);
      toast.error(error.message || "Failed to update notification settings");
    }
  };
  
  const handleTimeZoneChange = async (value: string) => {
    if (!user?.id) return;
    
    try {
      setTimeZone(value);
      
      const { error } = await supabase
        .from('user_preferences')
        .update({ time_zone: value })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast.success("Time zone updated");
    } catch (error: any) {
      console.error("Error updating time zone:", error);
      toast.error(error.message || "Failed to update time zone");
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Array of common time zones
  const timeZones = [
    "UTC", "GMT", 
    "America/New_York", "America/Los_Angeles", "America/Chicago",
    "Europe/London", "Europe/Paris", "Europe/Berlin",
    "Asia/Tokyo", "Asia/Singapore", "Asia/Dubai",
    "Australia/Sydney", "Pacific/Auckland"
  ];
  
  // Function to format time zone for display
  const formatTimeZone = (tz: string) => {
    return tz.replace("_", " ").replace("/", "/");
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#333333]">Account Settings</h2>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" size={20} />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage how your profile appears to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!canChangeUsername}
                    />
                    <Button type="submit" disabled={!canChangeUsername}>
                      Update
                    </Button>
                  </div>
                  
                  {!canChangeUsername && nextChangeDate && (
                    <Alert className="mt-4 bg-yellow-50 border-yellow-100">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-600">Username change limited</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          You can change your username again after {formatDate(nextChangeDate)}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {lastUsernameChange && (
                    <p className="text-xs text-[#555555] mt-2">
                      Last changed: {formatDate(lastUsernameChange)}
                    </p>
                  )}
                </div>
              </form>
              
              <form onSubmit={handleEmailUpdate} className="space-y-4 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={emailError ? 'border-red-500' : ''}
                      />
                      {emailError && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle size={12} />
                          {emailError}
                        </p>
                      )}
                    </div>
                    <Button type="submit" disabled={!!emailError}>
                      Update
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2" size={20} />
                  Password Settings
                </CardTitle>
                <CardDescription>
                  Change your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button type="submit">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2" size={20} />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable 2FA</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Protect your account with two-factor authentication
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tfaEnabled ? 
                      <Badge className="bg-green-500">Enabled</Badge> : 
                      <Badge variant="outline">Disabled</Badge>
                    }
                    <Switch
                      checked={tfaEnabled}
                      onCheckedChange={handleToggleTfa}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2" size={20} />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive payment notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.emailNotifications}
                    onCheckedChange={(checked) => handleToggleNotification('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.pushNotifications}
                    onCheckedChange={(checked) => handleToggleNotification('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive payment notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.smsNotifications}
                    onCheckedChange={(checked) => handleToggleNotification('smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">WhatsApp Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive payment notifications via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.whatsappNotifications}
                    onCheckedChange={(checked) => handleToggleNotification('whatsappNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" size={20} />
                Time Zone
              </CardTitle>
              <CardDescription>
                Set your preferred time zone for dates and times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="timezone">Select Time Zone</Label>
                <Select 
                  value={timeZone} 
                  onValueChange={handleTimeZoneChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {formatTimeZone(tz)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  Current time in {timeZone}: {new Date().toLocaleTimeString('en-US', { timeZone })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
