export interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

export interface User {
  notificationPreferences: NotificationPreferences;
  _id: string;
  name: string;
  email: string;
  experience: number;
  skills: string[];
  emailUnsubscribed?: boolean;
  pushSubscriptions?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}
