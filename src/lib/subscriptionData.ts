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

// Scanned from Gmail receipts — reflects real billing history
export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'real-1',
    name: 'Claude Pro',
    category: 'productivity',
    amount: 18,
    billingCycle: 'monthly',
    nextBillingDate: '2026-06-14',
    status: 'active',
    emoji: '🤖',
    color: '#d97706',
    createdAt: '2026-03-11',
    notes: 'Anthropic — scanned from Stripe receipt #2510-8949',
  },
  {
    id: 'real-2',
    name: 'HeyGen',
    category: 'software',
    amount: 13,
    billingCycle: 'monthly',
    nextBillingDate: '2026-05-11',
    status: 'cancelled',
    emoji: '🎥',
    color: '#7c3aed',
    createdAt: '2026-03-11',
    notes: 'Cancelled May 1, 2026 — scanned from Stripe receipt #2798-4770',
  },
  {
    id: 'real-3',
    name: 'HighLevel Agency',
    category: 'software',
    amount: 297,
    billingCycle: 'monthly',
    nextBillingDate: '2026-01-17',
    status: 'cancelled',
    emoji: '📈',
    color: '#059669',
    createdAt: '2025-11-17',
    notes: 'Cancelled Dec 17, 2025 — scanned from account email',
  },
];

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
