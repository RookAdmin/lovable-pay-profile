import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";
import VerificationBadge from "./verification/VerificationBadge";
import { VerificationType } from "@/types/verification";
import SocialMediaIcons from "./SocialMediaIcons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  verificationCategory?: VerificationType;
  profile?: Profile; // Add full profile for social media icons
  onShare?: () => void;
  isOwner?: boolean;
  isMobile?: boolean;
  verticalVerification?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  displayName,
  avatarUrl,
  bio,
  isVerified,
  verificationCategory,
  profile,
  onShare,
  isOwner = false,
  isMobile = false,
  verticalVerification = false,
}) => {

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative">
        <Avatar
          className={`${
            isMobile ? "h-20 w-20" : "h-32 w-32"
          } border-4 border-white/50 shadow-xl`}
        >
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-medium text-3xl">
            {displayName ? displayName.substring(0, 2).toUpperCase() : ""}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        {displayName && (
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            {displayName}
          </h1>
        )}

        <div className="flex items-center justify-center gap-1">
          <div className="text-muted-foreground font-medium">@{username}</div>
          {isVerified && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                >
                  <VerificationBadge
                    isVerified={isVerified}
                    category={verificationCategory}
                    size="md"
                    showTooltip={false}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                    <img
                      src="/lovable-uploads/2c53d21a-5f90-41e2-9d99-3f8dbe8c424d.png"
                      alt="Verified"
                      className="h-10 w-10"
                    />
                  </div>
                  <div className="space-y-3 text-center">
                    <h3 className="font-bold text-lg">About Verified</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This profile is officially verified by Paym.me to ensure
                      the utmost authenticity. All payment QR codes and linked
                      bank details are directly validated with the account
                      holder. You can confidently make payments using the
                      provided details, knowing they are secure.
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Verification protects you from phishing and fraudulent
                      requests. Look for this badge to trust payments and
                      support genuine profiles.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {bio && <p className="text-muted-foreground max-w-md">{bio}</p>}

        {profile && <SocialMediaIcons profile={profile} size={18} />}

        {onShare && (
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onShare}
            >
              <ExternalLink size={14} />
              {isOwner ? "Share my profile" : "Share profile"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
