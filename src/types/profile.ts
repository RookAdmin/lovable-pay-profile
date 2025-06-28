export interface Profile {
  id: string;
  username: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
  usernameUpdatedAt?: string;
  views: number;
}

export interface PaymentMethod {
  id: string;
  profileId: string;
  type: 'upi' | 'bank' | 'razorpay' | 'stripe';
  isActive: boolean;
  isPrimary: boolean;
  details: {
    upiId?: string;
    accountNumber?: string;
    ifsc?: string;
    accountName?: string;
    bankName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SmartLink {
  id: string;
  profileId: string;
  title: string;
  amount: number;
  currency: string;
  icon?: 'heart' | 'coffee' | 'zap' | 'card'; // Make icon optional
  imageUrl?: string; // Add support for custom image URLs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SocialLink = {
  platform: 'instagram' | 'twitter' | 'website' | 'linkedin' | 'youtube';
  url: string;
};
