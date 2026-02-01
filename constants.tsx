
import { SocialTask, Transaction } from './types';

export const MOCK_TASKS: SocialTask[] = [
  { id: '1', platform: 'Instagram', type: 'Follow', reward: 0.05, description: 'Follow @FitnessPro for daily workout tips', url: 'https://instagram.com/fitnesspro' },
  { id: '2', platform: 'Twitter', type: 'Retweet', reward: 0.03, description: 'Retweet the latest tech news from @TechDaily', url: 'https://twitter.com/techdaily' },
  { id: '3', platform: 'YouTube', type: 'Subscribe', reward: 0.10, description: 'Subscribe to "Code Master" Channel', url: 'https://youtube.com/codemaster' },
  { id: '4', platform: 'Facebook', type: 'Share', reward: 0.07, description: 'Share the Healthy Eats blog post', url: 'https://facebook.com/healthyeats' },
  { id: '5', platform: 'TikTok', type: 'Like', reward: 0.02, description: 'Like the trending dance video by @StarDancer', url: 'https://tiktok.com/@stardancer' },
  { id: '6', platform: 'LinkedIn', type: 'Follow', reward: 0.08, description: 'Follow "Innovate Corp" company page', url: 'https://linkedin.com/company/innovatecorp' },
];

// Added missing userId property to each mock transaction to satisfy interface requirements
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', userId: 'mock-user-1', type: 'Earning', amount: 0.10, status: 'Completed', date: '2023-10-25' },
  { id: 't2', userId: 'mock-user-1', type: 'Earning', amount: 0.05, status: 'Completed', date: '2023-10-24' },
  { id: 't3', userId: 'mock-user-1', type: 'Referral', amount: 1.00, status: 'Completed', date: '2023-10-20' },
  { id: 't4', userId: 'mock-user-1', type: 'Withdrawal', amount: 5.00, status: 'Pending', date: '2023-10-18' },
];
