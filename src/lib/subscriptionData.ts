import type { Category, Subscription } from './subscriptionTypes';

export const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string; bgColor: string }> = {
  streaming:    { label: 'Streaming',    emoji: '🎬', color: '#a855f7', bgColor: 'bg-purple-500/20' },
  music:        { label: 'Music',        emoji: '🎵', color: '#ec4899', bgColor: 'bg-pink-500/20' },
  software:     { label: 'Software',     emoji: '💻', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  gaming:       { label: 'Gaming',       emoji: '🎮', color: '#10b981', bgColor: 'bg-emerald-500/20' },
  fitness:      { label: 'Fitness',      emoji: '🏋️', color: '#f59e0b', bgColor: 'bg-amber-500/20' },
  news:         { label: 'News',         emoji: '📰', color: '#6b7280', bgColor: 'bg-gray-500/20' },
  cloud:        { label: 'Cloud',        emoji: '☁️', color: '#06b6d4', bgColor: 'bg-cyan-500/20' },
  productivity: { label: 'Productivity', emoji: '📊', color: '#8b5cf6', bgColor: 'bg-violet-500/20' },
  other:        { label: 'Other',        emoji: '📦', color: '#78716c', bgColor: 'bg-stone-500/20' },
};

export function toMonthlyAmount(sub: { amount: number; billingCycle: string }): number {
  if (sub.billingCycle === 'annual') return sub.amount / 12;
  if (sub.billingCycle === 'weekly') return (sub.amount * 52) / 12;
  return sub.amount;
}

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'demo-1',
    name: 'Netflix',
    category: 'streaming',
    amount: 15.49,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(3),
    status: 'active',
    emoji: '🎬',
    color: '#e50914',
    createdAt: pastDate(365),
    originalAmount: 13.99,
    lastUsed: pastDate(2),
  },
  {
    id: 'demo-2',
    name: 'Spotify',
    category: 'music',
    amount: 10.99,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(8),
    status: 'active',
    emoji: '🎵',
    color: '#1db954',
    createdAt: pastDate(400),
    lastUsed: pastDate(1),
  },
  {
    id: 'demo-3',
    name: 'Adobe Creative Cloud',
    category: 'software',
    amount: 54.99,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(15),
    status: 'active',
    emoji: '🎨',
    color: '#ff0000',
    createdAt: pastDate(200),
    originalAmount: 49.99,
    lastUsed: pastDate(52),
  },
  {
    id: 'demo-4',
    name: 'iCloud+',
    category: 'cloud',
    amount: 2.99,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(20),
    status: 'active',
    emoji: '☁️',
    color: '#147aff',
    createdAt: pastDate(600),
    lastUsed: pastDate(0),
  },
  {
    id: 'demo-5',
    name: 'Microsoft 365',
    category: 'productivity',
    amount: 99.99,
    billingCycle: 'annual',
    nextBillingDate: futureDate(220),
    status: 'active',
    emoji: '📊',
    color: '#d83b01',
    createdAt: pastDate(145),
    lastUsed: pastDate(3),
  },
  {
    id: 'demo-6',
    name: 'Disney+',
    category: 'streaming',
    amount: 13.99,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(25),
    status: 'active',
    emoji: '🏰',
    color: '#113ccf',
    createdAt: pastDate(180),
    lastUsed: pastDate(48),
  },
  {
    id: 'demo-7',
    name: 'Peloton App',
    category: 'fitness',
    amount: 12.99,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(12),
    status: 'active',
    emoji: '🚴',
    color: '#ff0000',
    createdAt: pastDate(90),
    lastUsed: pastDate(38),
  },
  {
    id: 'demo-8',
    name: 'New York Times',
    category: 'news',
    amount: 17.00,
    billingCycle: 'monthly',
    nextBillingDate: futureDate(6),
    status: 'active',
    emoji: '📰',
    color: '#000000',
    createdAt: pastDate(300),
    lastUsed: pastDate(5),
  },
  {
    id: 'demo-9',
    name: 'PlayStation Plus',
    category: 'gaming',
    amount: 79.99,
    billingCycle: 'annual',
    nextBillingDate: futureDate(310),
    status: 'active',
    emoji: '🎮',
    color: '#003791',
    createdAt: pastDate(55),
    lastUsed: pastDate(10),
  },
];

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
