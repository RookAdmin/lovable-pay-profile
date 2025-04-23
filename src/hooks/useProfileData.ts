
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
  cardNumber?: string;
  nameOnCard?: string;
  expiryMonth?: string;
  expiryYear?: string;
  qrCodeUrl?: string;
}

const getProfile = async (username: string) => {
  console.log("Fetching profile for:", username);
  
  try {
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
    
    const { data: paymentMethods, error: paymentError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('profile_id', profile.id);
      
    if (paymentError) {
      console.error("Error fetching payment methods:", paymentError);
    }
      
    console.log("Payment methods fetched:", paymentMethods || []);

    const { data: smartLinks, error: smartLinksError } = await supabase
      .from('smart_links')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true);
      
    if (smartLinksError) {
      console.error("Error fetching smart links:", smartLinksError);
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
    const cardMethod = paymentMethods?.find(m => m.type === 'card');
    
    console.log("Found payment methods:", { upiMethod, bankMethod, cardMethod });
    
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
      qrCodeUrl,
      upiMethodId: upiMethod?.id,
      bankMethodId: bankMethod?.id,
      cardMethodId: cardMethod?.id
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
    retry: 3,
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

