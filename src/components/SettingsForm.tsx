
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar, 
  User, 
  Lock, 
  AlertTriangle, 
  Mail, 
  Bell, 
  Globe, 
  Clock, 
  Shield 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    newEmail: user?.email || "",
  });
  
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false
  });
  const [timeZone, setTimeZone] = useState("UTC");
  
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  
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
    
    // Load user's time zone preference if available
    const loadUserPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          setTimeZone(data.time_zone || "UTC");
          setTfaEnabled(data.tfa_enabled || false);
          
          if (data.notification_preferences) {
            setNotificationPreferences({
              ...notificationPreferences,
              ...data.notification_preferences
            });
          }
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };
    
    checkUsernameChangeEligibility();
    loadUserPreferences();
  }, [user?.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    
    if (!formData.newEmail || !formData.newEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ email: formData.newEmail });
      
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
  
  const handleToggleTFA = async () => {
    try {
      // In a real implementation, this would initiate the 2FA setup process
      // For now, we'll just toggle the state and save the preference
      const newTfaState = !tfaEnabled;
      setTfaEnabled(newTfaState);
      
      // Save preference to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user?.id,
          tfa_enabled: newTfaState,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) throw error;
      
      toast.success(`Two-factor authentication ${newTfaState ? 'enabled' : 'disabled'}`);
      
      if (newTfaState) {
        // In a real app, this would show QR code setup, etc.
        toast.info("In a real app, a QR code for setting up 2FA would appear here");
      }
    } catch (error: any) {
      console.error("Error toggling 2FA:", error);
      toast.error(error.message || "Failed to update 2FA settings");
      // Reset state to previous value
      setTfaEnabled(!tfaEnabled);
    }
  };
  
  const handleNotificationToggle = async (key: string) => {
    try {
      const updatedPreferences = { 
        ...notificationPreferences, 
        [key]: !notificationPreferences[key as keyof typeof notificationPreferences]
      };
      
      setNotificationPreferences(updatedPreferences);
      
      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user?.id,
          notification_preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Error updating notification preferences:", error);
      toast.error("Failed to update notification preferences");
      // Reset state to previous value
      setNotificationPreferences({...notificationPreferences});
    }
  };
  
  const handleTimeZoneChange = async (value: string) => {
    try {
      setTimeZone(value);
      
      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user?.id,
          time_zone: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) throw error;
      
      toast.success("Time zone updated");
      
    } catch (error: any) {
      console.error("Error updating time zone:", error);
      toast.error("Failed to update time zone");
      // Reset state to previous value
      setTimeZone(timeZone);
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#333333]">Account Settings</h2>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2" size={20} />
                Email Settings
              </CardTitle>
              <CardDescription>
                Update your email address (requires verification)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEmail">Current Email</Label>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newEmail">New Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newEmail"
                      type="email"
                      name="newEmail"
                      value={formData.newEmail}
                      onChange={handleInputChange}
                    />
                    <Button type="submit">
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-[#555555] mt-2">
                    You'll need to verify your new email address by clicking the link sent to your inbox.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
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
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2" size={20} />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure additional security measures for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an additional layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={tfaEnabled}
                    onCheckedChange={handleToggleTFA}
                  />
                </div>
                {tfaEnabled && (
                  <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm">
                      In a real application, a QR code would be shown here for setting up 2FA with an authenticator app.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Recent Login Activity</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2" size={20} />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.smsNotifications}
                    onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">WhatsApp Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={notificationPreferences.whatsappNotifications}
                    onCheckedChange={() => handleNotificationToggle('whatsappNotifications')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" size={20} />
                Regional Settings
              </CardTitle>
              <CardDescription>
                Customize regional preferences for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={timeZone} onValueChange={handleTimeZoneChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Asia/Kolkata">India</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
