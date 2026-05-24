export type Category =
  | 'streaming'
  | 'music'
  | 'software'
  | 'gaming'
  | 'fitness'
  | 'news'
  | 'cloud'
  | 'productivity'
  | 'other';

export type BillingCycle = 'weekly' | 'monthly' | 'annual';
export type Status = 'active' | 'paused' | 'cancelled';
export type SuggestionType = 'unused' | 'duplicate' | 'cheaper' | 'price_hike' | 'annual_switch';

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  status: Status;
  lastUsed?: string;
  notes?: string;
  emoji: string;
  color: string;
  createdAt: string;
  originalAmount?: number;
}

export interface Suggestion {
  id: string;
  type: SuggestionType;
  subscriptionId: string;
  subscriptionName: string;
  title: string;
  description: string;
  potentialSaving: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
