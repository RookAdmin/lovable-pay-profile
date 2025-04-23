
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
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    console.error("Error in Profile component:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground">Profile not found</p>
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
          isViewingMode={true} /* Force view mode regardless of authentication status */
        />
        <SmartLinkSection links={data.smartLinks} />
      </div>
    </div>
  );
};

export default Profile;
