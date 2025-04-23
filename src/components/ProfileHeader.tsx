
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Instagram, Twitter, Globe, Linkedin, Youtube } from 'lucide-react';

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
      <Avatar className="h-24 w-24 mb-4">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-gradient-primary text-white text-lg">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        {isVerified && (
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1 py-1">
            <Check size={12} className="text-blue-600" />
            Verified
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground mb-3">@{username}</p>
      
      {bio && (
        <p className="text-sm max-w-md mb-4">{bio}</p>
      )}
      
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
