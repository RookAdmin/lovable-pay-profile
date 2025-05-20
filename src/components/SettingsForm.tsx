
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, User, Lock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
    
    if (!formData.email || !formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
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
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
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
                <User className="mr-2" size={20} />
                Email Settings
              </CardTitle>
              <CardDescription>
                Update your email address (requires verification)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <Button type="submit">
                      Update
                    </Button>
                  </div>
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
      </Tabs>
    </div>
  );
};

export default SettingsForm;
