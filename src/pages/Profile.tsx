import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, error, refetch } = useProfileData(username);
  
  useEffect(() => {
    console.log("Profile component mounted, username:", username);
    if (username) {
      refetch();
    }
  }, [username, refetch]);

  useEffect(() => {
    if (data) {
      console.log("Profile data loaded successfully", {
        username: data.profile.username,
        displayName: data.profile.display_name,
        hasUpiId: !!data.upiId,
        hasBankDetails: !!data.bankDetails,
        hasCardDetails: !!data.cardDetails,
        hasQrCode: !!data.qrCodeUrl,
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    console.error("Error in Profile component:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-muted-foreground">Profile not found</p>
          <p className="text-sm text-muted-foreground/80">The requested profile could not be loaded</p>
        </div>
      </div>
    );
  }
  
  console.log("Rendering profile data:", {
    username: data.profile.username,
    displayName: data.profile.display_name,
    upiId: data.upiId,
    hasQrCode: !!data.qrCodeUrl,
    hasBankDetails: !!data.bankDetails,
    hasCardDetails: !!data.cardDetails,
    smartLinksCount: data.smartLinks.length
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-2xl px-4 py-12 mx-auto space-y-8">
        <div className="glass p-8 rounded-2xl backdrop-blur-lg border border-white/10">
          <ProfileHeader
            username={data.profile.username}
            displayName={data.profile.display_name}
            bio={data.profile.bio}
            avatarUrl={data.profile.avatar_url}
            isVerified={data.profile.is_verified}
            socialLinks={data.socialLinks}
          />
        </div>
        
        <div className="space-y-6">
          <PaymentSection
            upiId={data.upiId}
            bankDetails={data.bankDetails}
            cardDetails={data.cardDetails}
            qrCodeUrl={data.qrCodeUrl}
            isViewingMode={true}
            className="glass"
          />
          <SmartLinkSection 
            links={data.smartLinks} 
            upiId={data.upiId}
            className="glass"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
