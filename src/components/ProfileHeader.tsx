
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Instagram, Twitter, Globe, Linkedin, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialLink {
  platform: 'instagram' | 'twitter' | 'website' | 'linkedin' | 'youtube';
  url: string;
}

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  socialLinks?: SocialLink[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  displayName,
  bio,
  avatarUrl,
  isVerified = false,
  socialLinks = []
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'website': return <Globe size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'youtube': return <Youtube size={16} />;
      default: return <Globe size={16} />;
    }
  };
  
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Avatar className="h-28 w-28 border-4 border-white shadow-md">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-white text-2xl">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-2 mb-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[#003D40]">{displayName}</h1>
        {isVerified && (
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1 py-1">
            <Check size={12} className="text-blue-600" />
            Verified
          </Badge>
        )}
      </motion.div>
      
      <motion.p 
        className="text-lg text-primary/80 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        @{username}
      </motion.p>
      
      {bio && (
        <motion.p 
          className="text-base max-w-md mb-6 text-[#005F6A]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {bio}
        </motion.p>
      )}
      
      {socialLinks.length > 0 && (
        <motion.div 
          className="flex items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm hover:shadow-md"
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
            >
              {getSocialIcon(link.platform)}
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProfileHeader;
