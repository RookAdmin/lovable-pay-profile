
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CreditCard, Wallet, BarChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfileEditForm from '@/components/ProfileEditForm';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="sticky top-8">
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-6 pt-2">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.display_name || user?.email} />
                  <AvatarFallback>
                    {(profile?.display_name || user?.email || '').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{profile?.display_name || user?.email}</h2>
                <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              </div>
              
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User size={18} className="mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <CreditCard size={18} className="mr-2" />
                  Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Wallet size={18} className="mr-2" />
                  Transactions
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BarChart size={18} className="mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings size={18} className="mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditForm initialData={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
