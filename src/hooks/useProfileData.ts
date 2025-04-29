
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, PaymentMethod, SmartLink, SocialLink } from '@/types/profile';
import { BankDetails, CardDetails, UpiDetails, safelyConvertToUpiDetails } from '@/types/payment';
import { toast } from 'sonner';

interface PaymentDetails {
  upiId?: string;
  accountNumber?: string;
  ifsc?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
}

const getProfile = async (username: string) => {
  console.log("Fetching profile for:", username);
  
  try {
    // Get public profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
    
    if (!profile) {
      console.error("Profile not found for username:", username);
      throw new Error('Profile not found');
    }

    console.log("Profile found:", profile);
    console.log("Profile ID - ",profile.id)
    // Fetch payment methods - make sure this isn't restricted by RLS
    const { data: paymentMethods, error: paymentError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true);
      
    if (paymentError) {
      console.error("Error fetching payment methods:", paymentError);
      // Continue despite error - we'll show the profile without payment methods
    }
      
    console.log("Payment methods fetched:", paymentMethods || []);

    // Fetch smart links
    const { data: smartLinks, error: smartLinksError } = await supabase
      .from('smart_links')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true);
      
    if (smartLinksError) {
      console.error("Error fetching smart links:", smartLinksError);
      // Continue despite error - we'll show the profile without smart links
    }
    
    console.log("Smart links fetched:", smartLinks || []);

    const socialLinks: SocialLink[] = [
      profile.instagram_url && { platform: 'instagram', url: profile.instagram_url },
      profile.twitter_url && { platform: 'twitter', url: profile.twitter_url },
      profile.website_url && { platform: 'website', url: profile.website_url },
      profile.linkedin_url && { platform: 'linkedin', url: profile.linkedin_url }
    ].filter(Boolean) as SocialLink[];

    const upiMethod = paymentMethods?.find(m => m.type === 'upi');
    const bankMethod = paymentMethods?.find(m => m.type === 'bank');
    
    console.log("Found payment methods:", { upiMethod, bankMethod });
    
    let upiDetails: UpiDetails | undefined;
    if (upiMethod?.details) {
      if (typeof upiMethod.details === 'object') {
        const details = upiMethod.details as any;
        upiDetails = {
          upiId: details.upiId || '',
          qrCodeUrl: details.qrCodeUrl
        };
      } else {
        upiDetails = safelyConvertToUpiDetails(upiMethod.details);
      }
    }
    
    let qrCodeUrl: string | undefined = undefined;
    
    if (upiMethod) {
      qrCodeUrl = upiMethod.qr_code_url || (upiDetails?.qrCodeUrl || undefined);
      console.log("QR code URL found:", qrCodeUrl);
    }

    const paymentDetails = bankMethod?.details as PaymentDetails | undefined;
    
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

    // Card details no longer needed as per user request
    
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
      cardDetails: undefined, // No longer returning card details as per user request
      qrCodeUrl,
      upiMethodId: upiMethod?.id,
      bankMethodId: bankMethod?.id,
      cardMethodId: undefined // No longer returning card method id as per user request
    };
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
};

export const useProfileData = (username: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username || ''),
    enabled: !!username,
    staleTime: 60000, 
    retry: 5, // Increased retry attempts for better reliability in public access
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // Exponential backoff
    meta: {
      onError: (err: Error) => {
        console.error("Error in profile query:", err);
        toast.error("Failed to load profile");
      }
    }
  });

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
