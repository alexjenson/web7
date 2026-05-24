"use client";

import { useState, useMemo } from 'react';
import type { Subscription, Status } from '@/lib/subscriptionTypes';
import { loadSubscriptions, saveSubscriptions } from '@/lib/storage';
import { DEMO_SUBSCRIPTIONS, toMonthlyAmount } from '@/lib/subscriptionData';
import { generateSuggestions } from '@/lib/suggestions';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const stored = loadSubscriptions();
    if (stored.length === 0) {
      saveSubscriptions(DEMO_SUBSCRIPTIONS);
      return DEMO_SUBSCRIPTIONS;
    }
    return stored;
  });

  function persist(next: Subscription[]) {
    saveSubscriptions(next);
    setSubscriptions(next);
  }

  function addSubscription(data: Omit<Subscription, 'id' | 'createdAt'>): void {
    const sub: Subscription = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    persist([...subscriptions, sub]);
  }

  function updateSubscription(id: string, data: Partial<Subscription>): void {
    persist(subscriptions.map(s => (s.id === id ? { ...s, ...data } : s)));
  }

  function deleteSubscription(id: string): void {
    persist(subscriptions.filter(s => s.id !== id));
  }

  function setStatus(id: string, status: Status): void {
    updateSubscription(id, { status });
  }

  const activeSubscriptions = useMemo(
    () => subscriptions.filter(s => s.status === 'active'),
    [subscriptions]
  );

  const totalMonthlySpend = useMemo(
    () => activeSubscriptions.reduce((sum, s) => sum + toMonthlyAmount(s), 0),
    [activeSubscriptions]
  );

  const suggestions = useMemo(
    () => generateSuggestions(activeSubscriptions),
    [activeSubscriptions]
  );

  const upcomingRenewals = useMemo(() => {
    const cutoff = Date.now() + 30 * 24 * 60 * 60 * 1000;
    return subscriptions
      .filter(s => s.status !== 'cancelled' && new Date(s.nextBillingDate).getTime() <= cutoff)
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  }, [subscriptions]);

  const savingsPotential = useMemo(
    () => suggestions.reduce((sum, s) => sum + s.potentialSaving, 0),
    [suggestions]
  );

  return {
    subscriptions,
    activeSubscriptions,
    totalMonthlySpend,
    suggestions,
    upcomingRenewals,
    savingsPotential,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    setStatus,
  };
}
