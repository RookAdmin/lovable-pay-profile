import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, AlertCircle, Calendar, AlertTriangle, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { validateEmail } from "@/utils/validation";
import { socialPlatforms } from '@/utils/socialMedia';
import AvatarPicker, { Avatar as DefaultAvatar } from "@/components/ui/avatar-picker";

interface ComprehensiveSettingsFormProps {
  initialData: any;
  refetchProfile: () => Promise<void>;
}

const ComprehensiveSettingsForm: React.FC<ComprehensiveSettingsFormProps> = ({ 
  initialData, 
  refetchProfile 
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedDefaultAvatar, setSelectedDefaultAvatar] = useState<DefaultAvatar | null>(null);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);
  
  // Track changes
  const [hasChanges, setHasChanges] = useState(false);

  // Profile data
  const [formData, setFormData] = useState({
    displayName: initialData?.displayName || "",
    bio: initialData?.bio || "",
    avatarUrl: initialData?.avatarUrl || "",
    username: initialData?.username || "",
    email: user?.email || "",
    websiteUrl: initialData?.websiteUrl || "",
    // Social media fields - extract usernames from existing URLs
    ...Object.fromEntries(
      socialPlatforms.map(platform => [
        platform.fieldName,
        initialData?.[platform.fieldName] || ""
      ])
    )
  });

  // Security fields
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State for username restrictions
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  const [emailError, setEmailError] = useState("");

  // Notification and preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false
  });
  const [timeZone, setTimeZone] = useState("UTC");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  
  // Profile PIN state
  const [profilePinEnabled, setProfilePinEnabled] = useState(true);
  const [profilePin, setProfilePin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Query user preferences
  const { data: userPreferences, refetch: refetchPreferences } = useQuery({
    queryKey: ["user_preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Load preferences
  useEffect(() => {
    if (userPreferences) {
      setTimeZone(userPreferences.time_zone);
      setTfaEnabled(userPreferences.tfa_enabled);
      if (userPreferences.notification_preferences && typeof userPreferences.notification_preferences === 'object') {
        const prefs = userPreferences.notification_preferences as any;
        setNotificationPrefs({
          emailNotifications: prefs.emailNotifications ?? true,
          pushNotifications: prefs.pushNotifications ?? true,
          smsNotifications: prefs.smsNotifications ?? false,
          whatsappNotifications: prefs.whatsappNotifications ?? false
        });
      }
    }
  }, [userPreferences]);

  // Load profile PIN enabled state
  useEffect(() => {
    if (initialData) {
      setProfilePinEnabled(initialData.profile_pin_enabled ?? true);
    }
  }, [initialData]);

  // Check username change eligibility
  useEffect(() => {
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
          const waitPeriod = 15 * 24 * 60 * 60 * 1000;
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
    setHasChanges(true);
    
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handleAvatarChange = async (file: File) => {
    setUploading(true);
    try {
      if (!user?.id) {
        toast.error("User not found");
        return;
      }
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (!data?.publicUrl) throw new Error("Could not get public URL");

      setFormData({ ...formData, avatarUrl: data.publicUrl });
      setSelectedDefaultAvatar(null);
      setHasChanges(true);
      toast.success("Avatar updated! Click 'Save Changes' to confirm.");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleDefaultAvatarSelect = (avatar: DefaultAvatar) => {
    setSelectedDefaultAvatar(avatar);
    setFormData({ ...formData, avatarUrl: avatar.dataUrl });
    setHasChanges(true);
    toast.success("Default avatar selected! Click 'Save Changes' to confirm.");
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      // Validate username change if attempted
      if (formData.username !== initialData?.username && !canChangeUsername) {
        toast.error("You can only change your username once every 15 days");
        return;
      }

      // Prepare update object with snake_case for database
      const updateData: any = {
        display_name: formData.displayName,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        website_url: formData.websiteUrl
      };

      // Add social media fields (convert camelCase to snake_case)
      socialPlatforms.forEach(platform => {
        const value = formData[platform.fieldName as keyof typeof formData];
        if (value !== undefined) {
          const dbFieldName = platform.fieldName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
          updateData[dbFieldName] = value;
        }
      });

      // Update username if changed
      if (formData.username !== initialData?.username && canChangeUsername) {
        updateData.username = formData.username;
        updateData.username_updated_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id);

      if (error) throw error;

      // Update email if changed
      if (formData.email !== user?.email) {
        if (!validateEmail(formData.email)) {
          throw new Error("Invalid email address");
        }
        const { error: emailError } = await supabase.auth.updateUser({ 
          email: formData.email 
        });
        if (emailError) throw emailError;
        toast.info("Email verification sent to your new address");
      }

      // Update user preferences
      if (userPreferences) {
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .update({
            time_zone: timeZone,
            tfa_enabled: tfaEnabled,
            notification_preferences: notificationPrefs
          })
          .eq('user_id', user?.id);
        if (prefsError) throw prefsError;
      }

      await refetchProfile();
      setHasChanges(false);
      
      // Show minimalistic success toast
      toast.success("Changes saved successfully", {
        duration: 2000,
        style: {
          background: 'hsl(var(--primary))',
          color: 'white',
          border: 'none',
        }
      });
    } catch (error: any) {
      console.error("Error saving changes:", error);
      toast.error(error.message || "Failed to save changes");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (securityData.newPassword.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: securityData.newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setProfilePin(value);
  };

  const handleSavePin = async () => {
    if (profilePin.length !== 6) {
      toast.error('PIN must be exactly 6 characters');
      return;
    }

    try {
      if (!user?.id) return;

      // Hash the PIN (simple SHA-256)
      const encoder = new TextEncoder();
      const data = encoder.encode(profilePin + 'paym_salt_2024');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const { error } = await supabase
        .from('profiles')
        .update({ profile_pin_hash: hashHex })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile PIN saved successfully');
      setProfilePin('');
      setShowPin(false);
      await refetchProfile();
    } catch (error) {
      console.error('Error saving PIN:', error);
      toast.error('Failed to save PIN');
    }
  };

  const handleTogglePinProtection = async (checked: boolean) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({ profile_pin_enabled: checked })
        .eq('id', user.id);

      if (error) throw error;

      setProfilePinEnabled(checked);
      toast.success(checked ? 'PIN protection enabled' : 'PIN protection disabled');
      await refetchProfile();
    } catch (error) {
      console.error('Error toggling PIN protection:', error);
      toast.error('Failed to update PIN protection');
    }
  };

  const timeZones = [
    "UTC", "GMT", "America/New_York", "America/Los_Angeles", "America/Chicago",
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", 
    "Asia/Singapore", "Asia/Dubai", "Australia/Sydney", "Pacific/Auckland"
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Fixed Save Button at Top */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Button 
            onClick={handleSaveChanges} 
            disabled={!hasChanges}
            size="lg"
          >
            Save Changes
          </Button>
        </div>
        {hasChanges && (
          <p className="text-sm text-muted-foreground mt-2">You have unsaved changes</p>
        )}
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              {formData.avatarUrl ? (
                <AvatarImage src={formData.avatarUrl} alt="Profile photo" />
              ) : (
                <AvatarFallback><Camera size={28} /></AvatarFallback>
              )}
            </Avatar>
            <Tabs defaultValue="upload" className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                <TabsTrigger value="default">Default Avatar</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={uploading}
                  onClick={() => inputFileRef.current?.click()}
                >
                  {uploading ? "Uploading..." : "Choose Photo"}
                </Button>
              </TabsContent>
              <TabsContent value="default">
                <AvatarPicker
                  selectedAvatar={selectedDefaultAvatar}
                  onAvatarSelect={handleDefaultAvatarSelect}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!canChangeUsername}
              />
              {!canChangeUsername && nextChangeDate && (
                <Alert className="mt-2 bg-yellow-50 border-yellow-100">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-xs text-yellow-700">
                    <Calendar size={12} className="inline mr-1" />
                    Can change after {formatDate(nextChangeDate)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (max 100 characters)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{formData.bio.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />{emailError}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media & External Profiles</CardTitle>
          <CardDescription>
            Enter only your username (not the full URL). Icons will appear on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map(platform => (
              <div key={platform.id} className="space-y-2">
                <Label htmlFor={platform.fieldName as string}>
                  {platform.name}
                </Label>
                <Input
                  id={platform.fieldName as string}
                  name={platform.fieldName as string}
                  value={(formData[platform.fieldName as keyof typeof formData] as string) || ""}
                  onChange={handleInputChange}
                  placeholder={platform.placeholder}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
            />
          </div>
          <Button onClick={handlePasswordUpdate} variant="secondary">
            Update Password
          </Button>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add extra security to your account
                </p>
              </div>
              <Switch
                checked={tfaEnabled}
                onCheckedChange={(checked) => {
                  setTfaEnabled(checked);
                  setHasChanges(true);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Profile PIN & Payment Privacy
          </CardTitle>
          <CardDescription>
            Secure your payment details with a 6-character PIN. When enabled, visitors must enter your PIN to view payment information on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/40">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <label htmlFor="pin-protection" className="text-sm font-medium">
                  Require Profile PIN to view payment details
                </label>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your Profile PIN secures all payment methods. Without the correct PIN, no one (including bots, crawlers, and AI) can view your payment info—even on public pages.
              </p>
            </div>
            <Switch
              id="pin-protection"
              checked={profilePinEnabled}
              onCheckedChange={handleTogglePinProtection}
            />
          </div>

          {profilePinEnabled && (
            <div className="space-y-3 p-4 border border-border/40 rounded-lg">
              <div className="space-y-2">
                <label htmlFor="profile-pin" className="text-sm font-medium">
                  Profile PIN
                </label>
                <p className="text-xs text-muted-foreground">
                  Enter exactly 6 uppercase letters (A-Z) and numbers (0-9). This PIN will be required to view your payment details.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="profile-pin"
                    type={showPin ? "text" : "password"}
                    value={profilePin}
                    onChange={handlePinChange}
                    placeholder="Enter 6-character PIN"
                    maxLength={6}
                    className="font-mono tracking-wider uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {profilePin.length > 0 && profilePin.length < 6 && (
                  <p className="text-xs text-muted-foreground">
                    {6 - profilePin.length} more character{6 - profilePin.length !== 1 ? 's' : ''} required
                  </p>
                )}
              </div>
              <Button
                onClick={handleSavePin}
                disabled={profilePin.length !== 6}
                className="w-full"
              >
                Save Profile PIN
              </Button>
            </div>
          )}

          {!profilePinEnabled && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <strong>Warning:</strong> Your payment details will be visible to anyone who visits your public profile. Only disable PIN protection if you're using this for public fundraising or creator profiles.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notificationPrefs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) => {
                  setNotificationPrefs({...notificationPrefs, [key]: checked});
                  setHasChanges(true);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select 
              value={timeZone} 
              onValueChange={(value) => {
                setTimeZone(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasChanges}
          size="lg"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ComprehensiveSettingsForm;
