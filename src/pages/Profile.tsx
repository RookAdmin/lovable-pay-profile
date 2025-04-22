
import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '@/components/ProfileHeader';
import PaymentSection from '@/components/PaymentSection';
import SmartLinkSection from '@/components/SmartLinkSection';

// Mock data for development
const mockUserData = {
  username: 'arav',
  displayName: 'Arav Singh',
  bio: 'Freelance Web Developer & UI Designer. Making the web beautiful one pixel at a time. ✨',
  avatarUrl: 'https://i.pravatar.cc/300?img=10',
  isVerified: true,
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'website', url: 'https://example.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' }
  ],
  upiId: 'arav@bankupi',
  bankDetails: {
    accountNumber: '1234567890',
    ifsc: 'HDFC0001234',
    accountName: 'Arav Singh',
    bankName: 'HDFC Bank'
  },
  smartLinks: [
    { id: '1', title: 'Support My Work', amount: 100, currency: '₹', icon: 'heart', gradient: true },
    { id: '2', title: 'Buy Me a Coffee', amount: 50, currency: '₹', icon: 'coffee' },
    { id: '3', title: 'Quick Tip', amount: 20, currency: '₹', icon: 'zap' },
    { id: '4', title: 'Book a Session', amount: 500, currency: '₹', icon: 'card' }
  ]
};

// In a real app, we'd fetch this data from the API based on the username
const getUserByUsername = (username: string) => {
  console.log(`Fetching user data for ${username}`);
  return mockUserData;
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  
  // In a real app, we'd use React Query or similar to fetch user data
  const userData = getUserByUsername(username || '');
  
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-muted-foreground">User not found</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md px-4 py-8">
      <ProfileHeader
        username={userData.username}
        displayName={userData.displayName}
        bio={userData.bio}
        avatarUrl={userData.avatarUrl}
        isVerified={userData.isVerified}
        socialLinks={userData.socialLinks}
      />
      
      <div className="mt-8 space-y-6">
        <PaymentSection
          upiId={userData.upiId}
          bankDetails={userData.bankDetails}
        />
        
        <SmartLinkSection links={userData.smartLinks} />
      </div>
    </div>
  );
};

export default Profile;
