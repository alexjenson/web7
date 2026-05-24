import type { Subscription, Suggestion, SuggestionType } from './subscriptionTypes';
import { toMonthlyAmount } from './subscriptionData';

const KNOWN_PRICE_HIKERS = ['Netflix', 'Adobe', 'Disney+', 'Spotify', 'Peloton'];

const CHEAPER_ALTERNATIVES: Partial<Record<string, { suggestion: string; saving: number }>> = {
  'Adobe Creative Cloud': { suggestion: 'Affinity Suite (one-time $170 vs $660/yr)', saving: 43 },
  'Microsoft 365': { suggestion: 'Google Workspace free tier or LibreOffice', saving: 8 },
  'New York Times': { suggestion: 'NYT Games only plan ($5/mo) or free library access', saving: 12 },
  'Peloton App': { suggestion: 'Apple Fitness+ ($9.99/mo) or Nike Training Club (free)', saving: 3 },
};

function makeSuggestion(
  type: SuggestionType,
  sub: Subscription,
  title: string,
  description: string,
  potentialSaving: number,
  priority: 'high' | 'medium' | 'low'
): Suggestion {
  return {
    id: `${type}-${sub.id}`,
    type,
    subscriptionId: sub.id,
    subscriptionName: sub.name,
    title,
    description,
    potentialSaving,
    priority,
  };
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function generateSuggestions(subscriptions: Subscription[]): Suggestion[] {
  const active = subscriptions.filter(s => s.status === 'active');
  const results: Suggestion[] = [];

  // Rule 1: Unused services
  for (const sub of active) {
    if (!sub.lastUsed) continue;
    const days = daysSince(sub.lastUsed);
    const monthly = toMonthlyAmount(sub);
    if (days >= 45 || (days >= 30 && monthly >= 20)) {
      results.push(makeSuggestion(
        'unused', sub,
        `You haven't used ${sub.name} in ${days} days`,
        `You last used ${sub.name} on ${new Date(sub.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. You're paying $${monthly.toFixed(2)}/mo for a service you're not using.`,
        monthly,
        days >= 60 ? 'high' : 'medium'
      ));
    }
  }

  // Rule 2: Duplicate categories (streaming, music, fitness, news)
  const dupeCategories = ['streaming', 'music', 'fitness', 'news'] as const;
  for (const cat of dupeCategories) {
    const group = active.filter(s => s.category === cat);
    if (group.length >= 2) {
      const sorted = [...group].sort((a, b) => toMonthlyAmount(a) - toMonthlyAmount(b));
      const cheapest = sorted[0];
      const names = group.map(s => s.name).join(' and ');
      results.push(makeSuggestion(
        'duplicate', cheapest,
        `You have ${group.length} ${cat} subscriptions`,
        `You're paying for ${names}. Consider cancelling the one you use least — you could save $${toMonthlyAmount(cheapest).toFixed(2)}/mo.`,
        toMonthlyAmount(cheapest),
        'high'
      ));
    }
  }

  // Rule 3: Price hike alerts
  for (const sub of active) {
    if (sub.originalAmount && sub.amount > sub.originalAmount) {
      const hike = sub.amount - sub.originalAmount;
      results.push(makeSuggestion(
        'price_hike', sub,
        `${sub.name} raised its price by $${hike.toFixed(2)}/mo`,
        `${sub.name} increased from $${sub.originalAmount.toFixed(2)} to $${sub.amount.toFixed(2)}/mo. Consider downgrading or switching to a competitor.`,
        hike * 12,
        'high'
      ));
    } else if (KNOWN_PRICE_HIKERS.some(n => sub.name.includes(n)) && !sub.originalAmount) {
      results.push(makeSuggestion(
        'price_hike', sub,
        `${sub.name} has a history of price increases`,
        `${sub.name} has raised prices multiple times. Consider locking in an annual plan now to avoid future hikes.`,
        toMonthlyAmount(sub) * 0.17,
        'medium'
      ));
    }
  }

  // Rule 4: Switch to annual billing
  for (const sub of active) {
    if (sub.billingCycle === 'monthly' && toMonthlyAmount(sub) >= 10) {
      const annualSaving = sub.amount * 12 * 0.17;
      if (!results.some(r => r.subscriptionId === sub.id && r.type === 'price_hike')) {
        results.push(makeSuggestion(
          'annual_switch', sub,
          `Save 17% on ${sub.name} by switching to annual`,
          `Switching ${sub.name} from monthly ($${sub.amount}/mo) to an annual plan could save you ~$${annualSaving.toFixed(0)}/year.`,
          sub.amount * 0.17,
          'low'
        ));
      }
    }
  }

  // Rule 5: Cheaper alternatives
  for (const sub of active) {
    const alt = CHEAPER_ALTERNATIVES[sub.name];
    if (alt) {
      results.push(makeSuggestion(
        'cheaper', sub,
        `Cheaper alternative to ${sub.name}`,
        `Consider ${alt.suggestion}. You could save ~$${alt.saving}/mo.`,
        alt.saving,
        'medium'
      ));
    }
  }

  // Deduplicate by subscriptionId (keep highest priority per sub)
  const seen = new Map<string, Suggestion>();
  for (const s of results) {
    const existing = seen.get(s.subscriptionId);
    if (!existing || PRIORITY_ORDER[s.priority] < PRIORITY_ORDER[existing.priority]) {
      seen.set(s.subscriptionId, s);
    }
  }

  return Array.from(seen.values()).sort((a, b) =>
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
    b.potentialSaving - a.potentialSaving
  );
}
