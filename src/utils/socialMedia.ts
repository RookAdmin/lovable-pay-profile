// Social media platform configurations and utilities

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  urlPattern: (username: string) => string;
  placeholder: string;
  fieldName: keyof import('@/types/profile').Profile;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    urlPattern: (u) => `https://instagram.com/${u}`,
    placeholder: 'username',
    fieldName: 'instagramUrl'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    urlPattern: (u) => `https://facebook.com/${u}`,
    placeholder: 'username',
    fieldName: 'facebookUsername'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'Twitter',
    urlPattern: (u) => `https://x.com/${u}`,
    placeholder: 'username',
    fieldName: 'twitterUrl'
  },
  {
    id: 'linkedin-person',
    name: 'LinkedIn (Personal)',
    icon: 'Linkedin',
    urlPattern: (u) => `https://www.linkedin.com/in/${u}`,
    placeholder: 'username',
    fieldName: 'linkedinPersonUsername'
  },
  {
    id: 'linkedin-company',
    name: 'LinkedIn (Company)',
    icon: 'Building2',
    urlPattern: (u) => `https://www.linkedin.com/company/${u}`,
    placeholder: 'company-name',
    fieldName: 'linkedinCompanyUsername'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    urlPattern: (u) => `https://youtube.com/@${u}`,
    placeholder: 'username',
    fieldName: 'youtubeUsername'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music',
    urlPattern: (u) => `https://tiktok.com/@${u}`,
    placeholder: 'username',
    fieldName: 'tiktokUsername'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'Github',
    urlPattern: (u) => `https://github.com/${u}`,
    placeholder: 'username',
    fieldName: 'githubUsername'
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'Globe',
    urlPattern: (u) => u.startsWith('http') ? u : `https://${u}`,
    placeholder: 'yourdomain.com',
    fieldName: 'websiteUrl'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'Send',
    urlPattern: (u) => `https://t.me/${u}`,
    placeholder: 'username',
    fieldName: 'telegramUsername'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'MessageCircle',
    urlPattern: (u) => `https://wa.me/${u}`,
    placeholder: '919876543210',
    fieldName: 'whatsappNumber'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'MessageSquare',
    urlPattern: (u) => `https://discord.com/users/${u}`,
    placeholder: 'userid',
    fieldName: 'discordUsername'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: 'Tv',
    urlPattern: (u) => `https://www.twitch.tv/${u}`,
    placeholder: 'username',
    fieldName: 'twitchUsername'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: 'MessageCircle',
    urlPattern: (u) => `https://www.reddit.com/user/${u}`,
    placeholder: 'username',
    fieldName: 'redditUsername'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'Image',
    urlPattern: (u) => `https://www.pinterest.com/${u}`,
    placeholder: 'username',
    fieldName: 'pinterestUsername'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: 'Camera',
    urlPattern: (u) => `https://www.snapchat.com/add/${u}`,
    placeholder: 'username',
    fieldName: 'snapchatUsername'
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: 'AtSign',
    urlPattern: (u) => `https://www.threads.net/@${u}`,
    placeholder: 'username',
    fieldName: 'threadsUsername'
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    icon: 'Cloud',
    urlPattern: (u) => `https://bsky.app/profile/${u.includes('.') ? u : u + '.bsky.social'}`,
    placeholder: 'handle.bsky.social',
    fieldName: 'blueskyHandle'
  },
  {
    id: 'mastodon',
    name: 'Mastodon',
    icon: 'AtSign',
    urlPattern: (u) => `https://mastodon.social/@${u}`,
    placeholder: 'username',
    fieldName: 'mastodonUsername'
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: 'BookOpen',
    urlPattern: (u) => `https://medium.com/@${u}`,
    placeholder: 'username',
    fieldName: 'mediumUsername'
  },
  {
    id: 'tumblr',
    name: 'Tumblr',
    icon: 'BookOpen',
    urlPattern: (u) => `https://${u}.tumblr.com`,
    placeholder: 'username',
    fieldName: 'tumblrUsername'
  },
  {
    id: 'quora',
    name: 'Quora',
    icon: 'HelpCircle',
    urlPattern: (u) => `https://www.quora.com/profile/${u}`,
    placeholder: 'username',
    fieldName: 'quoraUsername'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: 'Music',
    urlPattern: (u) => `https://open.spotify.com/user/${u}`,
    placeholder: 'username',
    fieldName: 'spotifyUsername'
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: 'Music',
    urlPattern: (u) => `https://soundcloud.com/${u}`,
    placeholder: 'username',
    fieldName: 'soundcloudUsername'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    icon: 'Music',
    urlPattern: (u) => `https://music.apple.com/profile/${u}`,
    placeholder: 'username',
    fieldName: 'appleMusicUsername'
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: 'Video',
    urlPattern: (u) => `https://vimeo.com/${u}`,
    placeholder: 'username',
    fieldName: 'vimeoUsername'
  },
  {
    id: 'rumble',
    name: 'Rumble',
    icon: 'Video',
    urlPattern: (u) => `https://rumble.com/c/${u}`,
    placeholder: 'username',
    fieldName: 'rumbleUsername'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    icon: 'Palette',
    urlPattern: (u) => `https://dribbble.com/${u}`,
    placeholder: 'username',
    fieldName: 'dribbbleUsername'
  },
  {
    id: 'behance',
    name: 'Behance',
    icon: 'Palette',
    urlPattern: (u) => `https://www.behance.net/${u}`,
    placeholder: 'username',
    fieldName: 'behanceUsername'
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    icon: 'Rocket',
    urlPattern: (u) => `https://www.producthunt.com/@${u}`,
    placeholder: 'username',
    fieldName: 'producthuntUsername'
  },
  {
    id: 'letterboxd',
    name: 'Letterboxd',
    icon: 'Film',
    urlPattern: (u) => `https://letterboxd.com/${u}`,
    placeholder: 'username',
    fieldName: 'letterboxdUsername'
  },
  {
    id: 'goodreads',
    name: 'Goodreads',
    icon: 'BookOpen',
    urlPattern: (u) => `https://www.goodreads.com/user/show/${u}`,
    placeholder: 'userid',
    fieldName: 'goodreadsUsername'
  },
  {
    id: 'patreon',
    name: 'Patreon',
    icon: 'DollarSign',
    urlPattern: (u) => `https://patreon.com/${u}`,
    placeholder: 'username',
    fieldName: 'patreonUsername'
  },
  {
    id: 'paypal-me',
    name: 'PayPal.me',
    icon: 'DollarSign',
    urlPattern: (u) => `https://paypal.me/${u}`,
    placeholder: 'username',
    fieldName: 'paypalMeUsername'
  },
  {
    id: 'amazon-store',
    name: 'Amazon Store',
    icon: 'ShoppingBag',
    urlPattern: (u) => `https://amazon.com/shop/${u}`,
    placeholder: 'username',
    fieldName: 'amazonStoreUsername'
  },
  {
    id: 'etsy-shop',
    name: 'Etsy Shop',
    icon: 'ShoppingBag',
    urlPattern: (u) => `https://etsy.com/shop/${u}`,
    placeholder: 'shopname',
    fieldName: 'etsyShopUsername'
  },
  {
    id: 'wechat',
    name: 'WeChat',
    icon: 'MessageCircle',
    urlPattern: (u) => `https://weixin.qq.com/r/${u}`,
    placeholder: 'username',
    fieldName: 'wechatUsername'
  },
  {
    id: 'qq',
    name: 'QQ',
    icon: 'MessageCircle',
    urlPattern: (u) => `https://user.qzone.qq.com/${u}`,
    placeholder: 'userid',
    fieldName: 'qqUsername'
  }
];

export const generateSocialUrl = (platform: string, username: string): string => {
  const platformConfig = socialPlatforms.find(p => p.id === platform);
  if (!platformConfig || !username) return '';
  return platformConfig.urlPattern(username);
};

export const extractUsernameFromUrl = (url: string): string => {
  if (!url) return '';
  // If it doesn't start with http, assume it's already a username
  if (!url.startsWith('http')) return url;
  
  // Extract username from URL
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {
    return url;
  }
};
