
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

// Define a type for the raw profile data from the database
interface RawProfileData {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  is_verified: boolean;
  instagram_url?: string;
  twitter_url?: string;
  website_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
  username_updated_at?: string;
  views?: number; // Make this optional since it might not exist in older records
}

const getProfile = async (username: string) => {
  console.log("Fetching profile for:", username);
  
  try {
    // Get public profile data
    const { data: rawProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
    
    if (!rawProfile) {
      console.error("Profile not found for username:", username);
      throw new Error('Profile not found');
    }

    // Cast the raw profile to our defined type
    const rawProfileData = rawProfile as RawProfileData;
    
    console.log("Profile found:", rawProfileData);
    console.log("Profile ID -", rawProfileData.id);
    
    // Fetch payment methods - make sure this works for public access
    const { data: paymentMethods, error: paymentError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('profile_id', rawProfileData.id)
      .eq('is_active', true);
      
    if (paymentError) {
      console.error("Error fetching payment methods:", paymentError);
      // Continue despite error - we'll show the profile without payment methods
    }
      
    console.log("Payment methods fetched:", paymentMethods || []);

    // Fetch smart links - select all columns including image_url
    const { data: smartLinks, error: smartLinksError } = await supabase
      .from('smart_links')
      .select('*')
      .eq('profile_id', rawProfileData.id)
      .eq('is_active', true);
      
    if (smartLinksError) {
      console.error("Error fetching smart links:", smartLinksError);
      // Continue despite error - we'll show the profile without smart links
    }
    
    console.log("Smart links fetched:", smartLinks || []);

    const socialLinks: SocialLink[] = [
      rawProfileData.instagram_url && { platform: 'instagram', url: rawProfileData.instagram_url },
      rawProfileData.twitter_url && { platform: 'twitter', url: rawProfileData.twitter_url },
      rawProfileData.website_url && { platform: 'website', url: rawProfileData.website_url },
      rawProfileData.linkedin_url && { platform: 'linkedin', url: rawProfileData.linkedin_url }
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
    
    // Map database format to our frontend SmartLink interface format
    const typedSmartLinks: SmartLink[] = smartLinks?.map(link => ({
      id: link.id,
      profileId: link.profile_id,
      title: link.title,
      amount: Number(link.amount),
      currency: link.currency,
      icon: link.icon as SmartLink['icon'],
      imageUrl: link.image_url || undefined,
      isActive: !!link.is_active,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    })) || [];
    
    // Transform the raw profile data to match our Profile interface
    const profile: Profile = {
      id: rawProfileData.id,
      username: rawProfileData.username,
      displayName: rawProfileData.display_name,
      bio: rawProfileData.bio,
      avatarUrl: rawProfileData.avatar_url,
      isVerified: rawProfileData.is_verified,
      instagramUrl: rawProfileData.instagram_url,
      twitterUrl: rawProfileData.twitter_url,
      websiteUrl: rawProfileData.website_url,
      linkedinUrl: rawProfileData.linkedin_url,
      createdAt: rawProfileData.created_at,
      updatedAt: rawProfileData.updated_at,
      usernameUpdatedAt: rawProfileData.username_updated_at,
      views: typeof rawProfileData.views === 'number' ? rawProfileData.views : 0,
      // Social Media & External Profiles
      facebookUsername: (rawProfileData as any).facebook_username,
      youtubeUsername: (rawProfileData as any).youtube_username,
      pinterestUsername: (rawProfileData as any).pinterest_username,
      tiktokUsername: (rawProfileData as any).tiktok_username,
      rumbleUsername: (rawProfileData as any).rumble_username,
      whatsappNumber: (rawProfileData as any).whatsapp_number,
      wechatUsername: (rawProfileData as any).wechat_username,
      telegramUsername: (rawProfileData as any).telegram_username,
      snapchatUsername: (rawProfileData as any).snapchat_username,
      qqUsername: (rawProfileData as any).qq_username,
      tumblrUsername: (rawProfileData as any).tumblr_username,
      redditUsername: (rawProfileData as any).reddit_username,
      discordUsername: (rawProfileData as any).discord_username,
      twitchUsername: (rawProfileData as any).twitch_username,
      quoraUsername: (rawProfileData as any).quora_username,
      threadsUsername: (rawProfileData as any).threads_username,
      mastodonUsername: (rawProfileData as any).mastodon_username,
      githubUsername: (rawProfileData as any).github_username,
      dribbbleUsername: (rawProfileData as any).dribbble_username,
      behanceUsername: (rawProfileData as any).behance_username,
      mediumUsername: (rawProfileData as any).medium_username,
      soundcloudUsername: (rawProfileData as any).soundcloud_username,
      spotifyUsername: (rawProfileData as any).spotify_username,
      vimeoUsername: (rawProfileData as any).vimeo_username,
      letterboxdUsername: (rawProfileData as any).letterboxd_username,
      goodreadsUsername: (rawProfileData as any).goodreads_username,
      producthuntUsername: (rawProfileData as any).producthunt_username,
      amazonStoreUsername: (rawProfileData as any).amazon_store_username,
      etsyShopUsername: (rawProfileData as any).etsy_shop_username,
      paypalMeUsername: (rawProfileData as any).paypal_me_username,
      patreonUsername: (rawProfileData as any).patreon_username,
      appleMusicUsername: (rawProfileData as any).apple_music_username,
      blueskyHandle: (rawProfileData as any).bluesky_handle,
      linkedinCompanyUsername: (rawProfileData as any).linkedin_company_username,
      linkedinPersonUsername: (rawProfileData as any).linkedin_person_username
    };
    
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
