import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';
import { ProfilePinModal } from '@/components/ProfilePinModal';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, error, refetch } = useProfileData(username);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [validatedPaymentMethods, setValidatedPaymentMethods] = useState<any[]>([]);
  const [pinProtectionEnabled, setPinProtectionEnabled] = useState(true);
  
  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username, refetch]);

  useEffect(() => {
    const checkPinProtection = async () => {
      if (!data?.profile?.username) return;
      
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('profile_pin_enabled')
          .ilike('username', data.profile.username)
          .single();
        
        if (error) throw error;
        
        const pinEnabled = profileData?.profile_pin_enabled ?? true;
        setPinProtectionEnabled(pinEnabled);
        
        // Show PIN modal if protection is enabled
        if (pinEnabled) {
          setShowPinModal(true);
        }
      } catch (error) {
        console.error('Error checking PIN protection:', error);
        // Default to enabled for security
        setPinProtectionEnabled(true);
        setShowPinModal(true);
      }
    };
    
    checkPinProtection();
  }, [data?.profile?.username]);

  const handleValidPin = (paymentMethods: any[]) => {
    setPinVerified(true);
    setValidatedPaymentMethods(paymentMethods);
    setShowPinModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-gray-300 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <>
        <Helmet>
          <title>Profile Not Found - Paym.me</title>
          <meta name="description" content="The requested profile could not be found." />
        </Helmet>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 p-8 rounded-lg bg-white">
            <p className="text-2xl font-medium text-gray-800">Profile not found</p>
            <p className="text-sm text-gray-500">The requested profile could not be loaded</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{`${data.profile.displayName || data.profile.username} - Paym.me`}</title>
        <meta name="description" content={`${data.profile.bio || `Professional payment profile for ${data.profile.displayName || data.profile.username}`} - Send payments easily with smart links and UPI integration.`} />
      </Helmet>
      
      {/* PIN Modal */}
      {showPinModal && username && (
        <ProfilePinModal
          open={showPinModal}
          onValidPin={handleValidPin}
          username={username}
        />
      )}
      
      <div className="min-h-screen bg-gray-50">
        {/* Premium background texture */}
        <div className="fixed inset-0 bg-[url('https://uploads-ssl.webflow.com/5f5a53e153805db840dae2db/60d1a5a6d1a0b942f9e9f0e0_noise.png')] opacity-10 pointer-events-none"></div>
        
        {/* Subtle grid pattern */}
        <div className="fixed inset-0 bg-grid-gray-100/[0.04] pointer-events-none"></div>
        
        {/* Decorative accent elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-br from-blue-50/50 to-transparent -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tl from-gray-100/50 to-transparent -z-10"></div>
        
        <motion.div 
          className="container max-w-2xl px-4 py-16 mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            transition={{ duration: 0.3 }}
          >
            <ProfileHeader
              username={data.profile.username}
              displayName={data.profile.displayName}
              bio={data.profile.bio}
              avatarUrl={data.profile.avatarUrl}
              isVerified={data.profile.isVerified}
              profile={data.profile}
              verticalVerification={true}
            />
          </motion.div>
          
          <div className="space-y-6">
            {/* Payment Section - Only show if PIN is verified or protection is disabled */}
            {(!pinProtectionEnabled || pinVerified) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <PaymentSection
                  upiId={data.upiId}
                  bankDetails={data.bankDetails}
                  qrCodeUrl={data.qrCodeUrl}
                  isViewingMode={true}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                />
              </motion.div>
            )}
            
            {/* Smart Links Section - Now with connected UPI payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <SmartLinkSection 
                links={data.smartLinks} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                isViewingMode={true}
                profileOwnerUpiId={data.upiId}
                profileOwnerDisplayName={data.profile.displayName}
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Premium footer note */}
        <div className="pb-8 text-center">
          <p className="text-xs text-gray-400 tracking-wider">PREMIUM PROFILE</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
