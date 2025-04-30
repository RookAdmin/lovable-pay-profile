
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkIcon, ExternalLink, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SocialLink } from '@/types/profile';
import VerificationBadge from './verification/VerificationBadge';
import { verification_category } from '@/integrations/supabase/types';

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  verificationCategory?: verification_category;
  socialLinks?: SocialLink[];
  onShare?: () => void;
  isOwner?: boolean;
  isMobile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  displayName,
  avatarUrl,
  bio,
  isVerified,
  verificationCategory,
  socialLinks = [],
  onShare,
  isOwner = false,
  isMobile = false
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        );
      case 'website':
        return <LinkIcon size={16} />;
      case 'linkedin':
        return (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return <LinkIcon size={16} />;
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative">
        <Avatar className={`${isMobile ? 'h-20 w-20' : 'h-32 w-32'} border-4 border-white/50 shadow-xl`}>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-medium text-3xl">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-center">{displayName}</h1>
          {isVerified && (
            <VerificationBadge 
              isVerified={isVerified} 
              category={verificationCategory} 
              size="md"
            />
          )}
        </div>

        <div className="text-muted-foreground font-medium">@{username}</div>

        {bio && <p className="text-muted-foreground max-w-md">{bio}</p>}

        {socialLinks && socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 pt-2">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}

        {onShare && (
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onShare}
            >
              <ExternalLink size={14} />
              {isOwner ? 'Share my profile' : 'Share profile'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
