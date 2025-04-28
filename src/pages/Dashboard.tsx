import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Wallet, BarChart, Settings, LogOut, Share2, QrCode, LinkIcon, LayoutDashboard, Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfileEditForm from '@/components/ProfileEditForm';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import { SmartLink } from '@/types/profile';
import { BankDetails, CardDetails, UpiDetails, safelyConvertToUpiDetails } from '@/types/payment';
import UpiVerificationField from '@/components/UpiVerificationField';
import SettingsForm from '@/components/SettingsForm';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  
  const { data: profile, isLoading, refetch: refetchProfileQuery } = useQuery({
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

  const refetchProfile = async (): Promise<void> => {
    await refetchProfileQuery();
  };

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
      <div className="container-fluid px-0 py-0 bg-gradient-to-br from-background via-muted to-background min-h-screen w-full">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const upiMethod = paymentMethods?.find(m => m.type === 'upi');
  console.log("UPI method found:", upiMethod);
  
  const qrCodeUrl = upiMethod?.qr_code_url || 
    (typeof upiMethod?.details === 'object' && upiMethod?.details !== null ? 
      (safelyConvertToUpiDetails(upiMethod.details)).qrCodeUrl : 
      undefined);
  
  console.log("QR code URL:", qrCodeUrl);

  const upiDetails = upiMethod?.details ? 
    safelyConvertToUpiDetails(upiMethod.details) : 
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
    <div className="container-fluid px-0 py-0 bg-gradient-to-br from-background via-muted to-background min-h-screen w-full">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <div className="w-full md:w-64 shrink-0 p-4">
          <Card className="sticky top-8 glass border-none shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-8 pt-2 relative">
                <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <AvatarImage 
                    src={profile?.avatar_url} 
                    alt={profile?.display_name || user?.email}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {(profile?.display_name || user?.email || '').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={() => setEditingProfile(true)}
                  className="absolute top-0 right-0 bg-white/80 p-2 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <h2 className="text-2xl font-bold text-[#333333] mb-1">{profile?.display_name || user?.email}</h2>
                <p className="text-sm text-[#555555] mb-4">@{profile?.username}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full glass border-none shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={handleShare}
                >
                  <Share2 size={16} className="mr-2" />
                  Share Profile
                </Button>
              </div>
              
              <nav className="space-y-1.5">
                {[
                  { icon: LayoutDashboard, label: "Overview", to: "#overview" },
                  { icon: QrCode, label: "Payment Methods", to: "#payment" },
                  { icon: LinkIcon, label: "Smart Links", to: "#smart-links" },
                  { icon: Settings, label: "Settings", to: "#settings" },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start hover:glass hover:border-none transition-all duration-300"
                    size="sm"
                    onClick={() => {
                      const element = document.querySelector(`[data-value="${item.to.replace('#', '')}"]`);
                      if (element) {
                        (element as HTMLElement).click();
                      }
                    }}
                  >
                    <item.icon size={18} className="mr-2" />
                    {item.label}
                  </Button>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:glass hover:border-none transition-all duration-300" 
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
        
        <div className="flex-1 p-4">
          <Card className="glass border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#333333]">Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-4 mb-8 glass border-none">
                  <TabsTrigger value="overview" data-value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="payment" data-value="payment">Payment Methods</TabsTrigger>
                  <TabsTrigger value="smart-links" data-value="smart-links">Smart Links</TabsTrigger>
                  <TabsTrigger value="settings" data-value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#333333]">Welcome, {profile?.display_name || user?.email}!</h3>
                      <p className="text-[#555555]">
                        Your public profile is available at:{' '}
                        <Link 
                          to={`/${profile?.username}`} 
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          {window.location.origin}/{profile?.username}
                        </Link>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-[#333333]">Bio</h4>
                      <p className="text-[#555555]">{profile?.bio || 'No bio added yet.'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-[#333333]">Social Links</h4>
                      <div className="space-y-2">
                        {profile?.website_url && (
                          <p className="text-[#555555]">Website: <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.website_url}</a></p>
                        )}
                        {profile?.twitter_url && (
                          <p className="text-[#555555]">Twitter: <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.twitter_url}</a></p>
                        )}
                        {profile?.instagram_url && (
                          <p className="text-[#555555]">Instagram: <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.instagram_url}</a></p>
                        )}
                        {profile?.linkedin_url && (
                          <p className="text-[#555555]">LinkedIn: <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.linkedin_url}</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <div className="space-y-8">
                    <UpiVerificationField
                      upiId={upiMethod?.details && typeof upiMethod.details === 'object' ? 
                        (upiMethod.details as { upiId?: string }).upiId || '' : ''}
                      onChange={(value) => console.log("UPI ID changed:", value)}
                      onValidate={(valid) => setIsUpiValid(valid)}
                      className="max-w-md"
                    />
                    
                    <PaymentSection
                      upiId={upiMethod?.details && typeof upiMethod.details === 'object' ? 
                        (upiMethod.details as { upiId?: string }).upiId || '' : ''}
                      bankDetails={bankDetails}
                      cardDetails={cardDetails}
                      qrCodeUrl={qrCodeUrl}
                      onPaymentMethodUpdate={handleDataUpdate}
                      upiMethodId={upiMethod?.id}
                      bankMethodId={bankMethod?.id}
                      cardMethodId={cardMethod?.id}
                    />
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-[#333333]">Transaction Payment Integration</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-8 h-8 mr-2" />
                                <h4 className="text-[#333333] font-medium">Razorpay</h4>
                              </div>
                              <div>
                                <Button variant="outline" size="sm">Configure</Button>
                              </div>
                            </div>
                            <p className="text-sm text-[#555555] mb-4">
                              Connect your Razorpay account to accept direct payments from your profile page.
                            </p>
                            <div className="text-xs text-[#666666]">
                              Status: <span className="text-yellow-600 font-medium">Not Configured</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img src="https://stripe.com/favicon.ico" alt="Stripe" className="w-8 h-8 mr-2" />
                                <h4 className="text-[#333333] font-medium">Stripe</h4>
                              </div>
                              <div>
                                <Button variant="outline" size="sm">Configure</Button>
                              </div>
                            </div>
                            <p className="text-sm text-[#555555] mb-4">
                              Connect your Stripe account to accept international payments from your profile.
                            </p>
                            <div className="text-xs text-[#666666]">
                              Status: <span className="text-yellow-600 font-medium">Not Configured</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="smart-links">
                  <SmartLinkSection links={typedSmartLinks} />
                </TabsContent>
                
                <TabsContent value="settings">
                  <SettingsForm initialData={profile} refetchProfile={refetchProfile} />
                </TabsContent>
              </Tabs>
              
              {editingProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <CardTitle className="text-[#333333]">Edit Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProfileEditForm 
                        initialData={profile} 
                        onProfilePhotoUpdated={refetchProfile}
                        onClose={() => setEditingProfile(false)}
                      />
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingProfile(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
