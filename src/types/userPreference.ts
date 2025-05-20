
export interface UserPreference {
  id: string;
  user_id: string;
  time_zone: string;
  tfa_enabled: boolean;
  notification_preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
  };
  created_at: string;
  updated_at: string;
}
