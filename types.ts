
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  referrals: number;
  totalEarned: number;
  role: 'user' | 'advertiser' | 'admin';
}

export interface SocialTask {
  id: string;
  advertiserId?: string; // ID of the person who created the task
  platform: string;
  type: string;
  reward: number; // Price per person
  description: string; // Task Guide
  url: string; // Task Link
  proofTitle?: string;
  quantity?: number;
  remaining?: number;
  totalCost?: number;
  status?: 'pending' | 'Active' | 'Rejected' | 'Completed';
  completed?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'Earning' | 'Withdrawal' | 'Referral' | 'Deposit' | 'Ad Spend';
  amount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  date: string;
  description?: string;
  userName?: string; // For admin view
}

export enum ViewState {
  HOME = 'home',
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
  DASHBOARD = 'dashboard',
  ADMIN_DASHBOARD = 'admin_dashboard',
  TASKS = 'tasks',
  WALLET = 'wallet',
  REFERRALS = 'referrals',
  AI_ASSISTANT = 'ai_assistant',
  LEADERBOARD = 'leaderboard',
  SUPPORT = 'support',
  PROFILE = 'profile',
  ABOUT = 'about',
  TERMS = 'terms',
  PRIVACY = 'privacy'
}
