import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CreditCard, Wallet, BarChart, Settings, LogOut, Share2, QrCode, LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfileEditForm from '@/components/ProfileEditForm';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import { SmartLink } from '@/types/profile';
import { BankDetails, CardDetails, UpiDetails } from '@/types/payment';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  const { data: profile, isLoading, refetch: refetchProfile } = useQuery({
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

  const { data: paymentMethods, refetch: refetchPaymentMethods } = useQuery({
    queryKey: ['payment_methods', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('profile_id', user?.id);
        
      if (error) throw error;
      
      console.log("Retrieved payment methods:", data);
      
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: smartLinks } = useQuery({
    queryKey: ['smart_links', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('smart_links')
        .select('*')
        .eq('profile_id', user?.id);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/${profile?.username}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Profile link copied to clipboard!');
  };

  const handleDataUpdate = async () => {
    console.log("Refreshing data...");
    await Promise.all([
      refetchProfile(),
      refetchPaymentMethods()
    ]);
    console.log("Data refreshed");
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  const upiMethod = paymentMethods?.find(m => m.type === 'upi');
  console.log("UPI method found:", upiMethod);
  
  const qrCodeUrl = upiMethod?.qr_code_url || 
    (typeof upiMethod?.details === 'object' && upiMethod?.details !== null ? 
      (upiMethod.details as UpiDetails).qrCodeUrl : 
      undefined);
  
  console.log("QR code URL:", qrCodeUrl);

  const upiDetails = upiMethod?.details && typeof upiMethod.details === 'object' ? 
    { upiId: (upiMethod.details as UpiDetails).upiId || '' } : 
    undefined;

  const bankMethod = paymentMethods?.find(m => m.type === 'bank');
  const bankDetails: BankDetails | undefined = bankMethod?.details ? {
    accountNumber: (bankMethod.details as { accountNumber?: string }).accountNumber || '',
    ifsc: (bankMethod.details as { ifsc?: string }).ifsc || '',
    accountName: (bankMethod.details as { accountName?: string }).accountName || '',
    bankName: (bankMethod.details as { bankName?: string }).bankName || ''
  } : undefined;

  const cardMethod = paymentMethods?.find(m => m.type === 'card');
  const cardDetails: CardDetails | undefined = cardMethod?.details ? {
    cardNumber: (cardMethod.details as { cardNumber?: string }).cardNumber || '',
    nameOnCard: (cardMethod.details as { nameOnCard?: string }).nameOnCard || '',
    expiryMonth: (cardMethod.details as { expiryMonth?: string }).expiryMonth || '',
    expiryYear: (cardMethod.details as { expiryYear?: string }).expiryYear || ''
  } : undefined;

  const typedSmartLinks: SmartLink[] = 
    smartLinks?.map(link => ({
      id: link.id,
      title: link.title,
      amount: Number(link.amount),
      currency: link.currency,
      icon: link.icon === 'heart' || link.icon === 'coffee' || link.icon === 'zap' || link.icon === 'card' 
        ? link.icon 
        : 'heart',
      gradient: !!link.gradient,
      profileId: link.profile_id,
      isActive: link.is_active,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    })) || [];

  return (
    <div className="container-fluid px-0 py-0 bg-lightblue min-h-screen w-full">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <div className="w-full md:w-64 shrink-0">
          <Card className="sticky top-8 bg-card border-cyan shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-6 pt-2">
                <Avatar className="h-20 w-20 mb-3 border-4 border-cyan">
                  <AvatarImage 
                    src={profile?.avatar_url} 
                    alt={profile?.display_name || user?.email}
                  />
                  <AvatarFallback>
                    {(profile?.display_name || user?.email || '').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-teal">{profile?.display_name || user?.email}</h2>
                <p className="text-sm text-secondary">@{profile?.username}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-cyan text-cyan"
                  onClick={handleShare}
                >
                  <Share2 size={16} className="mr-2" />
                  Share Profile
                </Button>
              </div>
              
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User size={18} className="mr-2" />
                  Overview
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
                  <QrCode size={18} className="mr-2" />
                  QR Codes
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <LinkIcon size={18} className="mr-2" />
                  Smart Links
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
        
        <div className="flex-1">
          <Card className="bg-card shadow-lg border-cyan">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                  <TabsTrigger value="smart-links">Smart Links</TabsTrigger>
                  <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Welcome, {profile?.display_name || user?.email}!</h3>
                      <p className="text-muted-foreground">
                        Your public profile is available at:{' '}
                        <Link 
                          to={`/${profile?.username}`} 
                          className="text-primary hover:underline"
                        >
                          {window.location.origin}/{profile?.username}
                        </Link>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Bio</h4>
                      <p>{profile?.bio || 'No bio added yet.'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Social Links</h4>
                      <div className="space-y-2">
                        {profile?.website_url && (
                          <p>Website: <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.website_url}</a></p>
                        )}
                        {profile?.twitter_url && (
                          <p>Twitter: <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.twitter_url}</a></p>
                        )}
                        {profile?.instagram_url && (
                          <p>Instagram: <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.instagram_url}</a></p>
                        )}
                        {profile?.linkedin_url && (
                          <p>LinkedIn: <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.linkedin_url}</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <PaymentSection
                    upiId={upiMethod?.details && typeof upiMethod.details === 'object' ? 
                      (upiMethod.details as { upiId?: string }).upiId || '' : ''}
                    bankDetails={bankDetails}
                    cardDetails={cardDetails}
                    qrCodeUrl={qrCodeUrl}
                    onPaymentMethodUpdate={handleDataUpdate}
                  />
                </TabsContent>

                <TabsContent value="smart-links">
                  <SmartLinkSection links={typedSmartLinks} />
                </TabsContent>
                
                <TabsContent value="edit">
                  <ProfileEditForm initialData={profile} onProfilePhotoUpdated={refetchProfile} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
