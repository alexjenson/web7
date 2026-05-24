"use client";

import { useMemo } from 'react';
import type { Subscription } from '@/lib/subscriptionTypes';
import { CATEGORY_META, toMonthlyAmount, CATEGORIES } from '@/lib/subscriptionData';

interface Props {
  subscriptions: Subscription[];
}

export function CategoryBreakdown({ subscriptions }: Props) {
  const active = subscriptions.filter(s => s.status === 'active');

  const totals = useMemo(() => {
    return CATEGORIES.map(cat => ({
      cat,
      meta: CATEGORY_META[cat],
      amount: active.filter(s => s.category === cat).reduce((sum, s) => sum + toMonthlyAmount(s), 0),
    })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [active]);

  const maxAmount = totals[0]?.amount ?? 1;
  const totalSpend = totals.reduce((s, c) => s + c.amount, 0);

  if (totals.length === 0) {
    return null;
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Spend by Category</h3>
      <div className="space-y-3">
        {totals.map(({ cat, meta, amount }) => (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{meta.emoji}</span>
                <span className="text-sm text-gray-300">{meta.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {Math.round((amount / totalSpend) * 100)}%
                </span>
                <span className="text-sm font-medium text-white">${amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${(amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
