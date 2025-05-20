
export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  time_zone: string;
  tfa_enabled: boolean;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}
