
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import type { Profile, PaymentMethod, SmartLink, SocialLink } from '@/types/profile';
import { BankDetails, CardDetails, UpiDetails } from '@/types/payment';
import { safelyConvertToUpiDetails } from '@/types/payment';

interface PaymentDetails {
  upiId?: string;
  accountNumber?: string;
  ifsc?: string;
  accountName?: string;
  bankName?: string;
  cardNumber?: string;
  nameOnCard?: string;
  expiryMonth?: string;
  expiryYear?: string;
  qrCodeUrl?: string;
}

const getProfile = async (username: string) => {
  console.log("Fetching profile for:", username);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  if (!profile) throw new Error('Profile not found');

  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', profile.id);
    
  console.log("Payment methods fetched:", paymentMethods);

  const { data: smartLinks } = await supabase
    .from('smart_links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true);

  const socialLinks: SocialLink[] = [
    profile.instagram_url && { platform: 'instagram', url: profile.instagram_url },
    profile.twitter_url && { platform: 'twitter', url: profile.twitter_url },
    profile.website_url && { platform: 'website', url: profile.website_url },
    profile.linkedin_url && { platform: 'linkedin', url: profile.linkedin_url }
  ].filter(Boolean) as SocialLink[];

  const upiMethod = paymentMethods?.find(m => m.type === 'upi');
  const bankMethod = paymentMethods?.find(m => m.type === 'bank');
  const cardMethod = paymentMethods?.find(m => m.type === 'card');
  
  const upiDetails = upiMethod?.details ? 
    safelyConvertToUpiDetails(upiMethod.details) : 
    undefined;
  
  let qrCodeUrl: string | undefined = undefined;
  
  if (upiMethod) {
    qrCodeUrl = upiMethod.qr_code_url;
    
    if (!qrCodeUrl && upiDetails?.qrCodeUrl) {
      qrCodeUrl = upiDetails.qrCodeUrl;
    }
    
    console.log("QR code URL found:", qrCodeUrl);
  }

  const paymentDetails = bankMethod?.details as PaymentDetails | undefined;
  const cardPaymentDetails = cardMethod?.details as PaymentDetails | undefined;
  
  let bankDetails: BankDetails | undefined;
  let cardDetails: CardDetails | undefined;
  
  if (paymentDetails?.accountNumber && paymentDetails?.ifsc && 
      paymentDetails?.accountName && paymentDetails?.bankName) {
    bankDetails = {
      accountNumber: paymentDetails.accountNumber,
      ifsc: paymentDetails.ifsc,
      accountName: paymentDetails.accountName,
      bankName: paymentDetails.bankName
    };
  }

  if (cardPaymentDetails?.cardNumber && cardPaymentDetails?.nameOnCard && 
      cardPaymentDetails?.expiryMonth && cardPaymentDetails?.expiryYear) {
    cardDetails = {
      cardNumber: cardPaymentDetails.cardNumber,
      nameOnCard: cardPaymentDetails.nameOnCard,
      expiryMonth: cardPaymentDetails.expiryMonth,
      expiryYear: cardPaymentDetails.expiryYear
    };
  }
  
  const typedSmartLinks = smartLinks?.map(link => ({
    ...link,
    icon: link.icon as SmartLink['icon']
  })) || [];

  return {
    profile,
    socialLinks,
    paymentMethods: paymentMethods || [],
    smartLinks: typedSmartLinks,
    upiId: upiDetails?.upiId,
    bankDetails,
    cardDetails,
    qrCodeUrl
  };
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username || ''),
    enabled: !!username,
    staleTime: 60000,
  });
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground">Profile not found</p>
      </div>
    );
  }
  
  console.log("Profile data:", data);
  console.log("QR code URL in data:", data.qrCodeUrl);
  
  return (
    <div className="container max-w-md px-4 py-8">
      <ProfileHeader
        username={data.profile.username}
        displayName={data.profile.display_name}
        bio={data.profile.bio}
        avatarUrl={data.profile.avatar_url}
        isVerified={data.profile.is_verified}
        socialLinks={data.socialLinks}
      />
      
      <div className="mt-8 space-y-6">
        <PaymentSection
          upiId={data.upiId}
          bankDetails={data.bankDetails}
          cardDetails={data.cardDetails}
          qrCodeUrl={data.qrCodeUrl}
        />
        <SmartLinkSection links={data.smartLinks} />
      </div>
    </div>
  );
};

export default Profile;
