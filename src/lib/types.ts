export type Platform = 'instagram' | 'linkedin' | 'facebook';

export interface SocialAccount {
  id: string;
  platform: Platform;
  name: string;
  connected: boolean;
  accessToken?: string;
  profileInfo?: {
    username?: string;
    profilePicture?: string;
    followerCount?: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ScheduledPost {
  id: string;
  platform: Platform;
  content: string;
  scheduledAt: Date;
  status: 'scheduled' | 'posted' | 'failed';
}

