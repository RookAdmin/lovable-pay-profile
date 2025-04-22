
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import type { Profile, PaymentMethod, SmartLink, SocialLink } from '@/types/profile';

interface PaymentDetails {
  upiId?: string;
  accountNumber?: string;
  ifsc?: string;
  accountName?: string;
  bankName?: string;
}

// Create an interface that matches the expected BankDetails in PaymentSection
interface BankDetails {
  accountNumber: string;
  ifsc: string;
  accountName: string;
  bankName: string;
}

const getProfile = async (username: string) => {
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

  const { data: smartLinks } = await supabase
    .from('smart_links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true);

  // Transform data to match our frontend types
  const socialLinks: SocialLink[] = [
    profile.instagram_url && { platform: 'instagram', url: profile.instagram_url },
    profile.twitter_url && { platform: 'twitter', url: profile.twitter_url },
    profile.website_url && { platform: 'website', url: profile.website_url },
    profile.linkedin_url && { platform: 'linkedin', url: profile.linkedin_url }
  ].filter(Boolean) as SocialLink[];

  const upiMethod = paymentMethods?.find(m => m.type === 'upi');
  const bankMethod = paymentMethods?.find(m => m.type === 'bank');
  
  // Safely type cast the payment details
  const upiDetails = upiMethod?.details as PaymentDetails | undefined;
  const paymentDetails = bankMethod?.details as PaymentDetails | undefined;
  
  // Create a properly typed bankDetails object that meets the BankDetails interface requirements
  let bankDetails: BankDetails | undefined;
  
  if (paymentDetails?.accountNumber && paymentDetails?.ifsc && 
      paymentDetails?.accountName && paymentDetails?.bankName) {
    bankDetails = {
      accountNumber: paymentDetails.accountNumber,
      ifsc: paymentDetails.ifsc,
      accountName: paymentDetails.accountName,
      bankName: paymentDetails.bankName
    };
  }
  
  // Transform smart links to match the required type
  const typedSmartLinks = smartLinks?.map(link => ({
    ...link,
    icon: link.icon as SmartLink['icon'] // Type assertion for the icon
  })) || [];

  return {
    profile,
    socialLinks,
    paymentMethods: paymentMethods || [],
    smartLinks: typedSmartLinks,
    upiId: upiDetails?.upiId,
    bankDetails
  };
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username || ''),
    enabled: !!username
  });
  
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
        />
        
        <SmartLinkSection links={data.smartLinks} />
      </div>
    </div>
  );
};

export default Profile;
