import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Profile } from '@/types/profile';
import { socialPlatforms, generateSocialUrl } from '@/utils/socialMedia';

interface SocialMediaIconsProps {
  profile: Profile;
  size?: number;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ profile, size = 20 }) => {
  const activeSocialLinks = socialPlatforms
    .filter(platform => {
      const username = profile[platform.fieldName as keyof Profile] as string;
      return username && username.trim() !== '';
    })
    .map(platform => {
      const username = profile[platform.fieldName as keyof Profile] as string;
      return {
        ...platform,
        url: generateSocialUrl(platform.id, username),
        username
      };
    });

  if (activeSocialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 pt-4">
      {activeSocialLinks.map((link) => {
        const IconComponent = (LucideIcons as any)[link.icon] || LucideIcons.LinkIcon;
        
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2.5 rounded-full bg-muted/50 hover:bg-muted transition-colors text-foreground/80 hover:text-foreground hover:scale-110 transform duration-200"
            title={`${link.name}: ${link.username}`}
          >
            <IconComponent size={size} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaIcons;
