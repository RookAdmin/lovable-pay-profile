
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import { motion } from 'framer-motion';

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
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-primary animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-t-transparent border-primary/70 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    console.error("Error in Profile component:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 p-8 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20">
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
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-cyan/5 rounded-full filter blur-3xl -z-10" />
      
      <motion.div 
        className="container max-w-2xl px-4 py-12 mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="glass p-8 rounded-2xl backdrop-blur-lg border border-white/20 shadow-lg"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 151, 167, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <ProfileHeader
            username={data.profile.username}
            displayName={data.profile.display_name}
            bio={data.profile.bio}
            avatarUrl={data.profile.avatar_url}
            isVerified={data.profile.is_verified}
            socialLinks={data.socialLinks}
          />
        </motion.div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <PaymentSection
              upiId={data.upiId}
              bankDetails={data.bankDetails}
              cardDetails={data.cardDetails}
              qrCodeUrl={data.qrCodeUrl}
              isViewingMode={true}
              className="glass p-6 rounded-2xl backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SmartLinkSection 
              links={data.smartLinks} 
              upiId={data.upiId}
              className="glass p-6 rounded-2xl backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
