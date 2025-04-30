import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditForm from "@/components/ProfileEditForm";
import PaymentMethodsForm from "@/components/PaymentMethodsForm";
import SmartLinksForm from "@/components/SmartLinksForm";
import SettingsForm from "@/components/SettingsForm";
import { VerificationSection } from "@/components/verification/VerificationSection";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Fetch profile data
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      
      // Add views property with default value if it doesn't exist
      return {
        ...data,
        views: data.views || 0
      };
    },
    enabled: !!user?.id
  });
  
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error loading profile</div>;
  if (!profileData) return <div className="flex justify-center items-center h-screen">No profile found</div>;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="smart-links">Smart Links</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditForm profileData={profileData} onSave={() => refetch()} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodsForm profileData={profileData} onSave={() => refetch()} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="smart-links">
          <Card>
            <CardHeader>
              <CardTitle>Smart Links</CardTitle>
            </CardHeader>
            <CardContent>
              <SmartLinksForm profileData={profileData} onSave={() => refetch()} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsForm profileData={profileData} onSave={() => refetch()} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <VerificationSection profileData={profileData} />
    </div>
  );
};

export default Dashboard;
