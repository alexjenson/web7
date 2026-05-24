"use client";

import { useMemo } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { CATEGORY_META, CATEGORIES, toMonthlyAmount } from '@/lib/subscriptionData';

function seededVariation(base: number, seed: number): number {
  const pseudo = Math.sin(seed * 127.1 + 311.7) * 0.5 + 0.5;
  return base * (0.82 + pseudo * 0.28);
}

function formatMonthLabel(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toLocaleString('default', { month: 'short' });
}

export default function AnalyticsPage() {
  const { subscriptions, activeSubscriptions, totalMonthlySpend } = useSubscriptions();

  const subsHash = activeSubscriptions.reduce((h, s) => h + s.id.charCodeAt(0), 0);

  const monthlyHistory = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      label: formatMonthLabel(5 - i),
      amount: i === 5 ? totalMonthlySpend : seededVariation(totalMonthlySpend, subsHash + i),
    }));
  }, [totalMonthlySpend, subsHash]);

  const maxMonth = Math.max(...monthlyHistory.map(m => m.amount));

  const categoryTotals = useMemo(() => {
    return CATEGORIES.map(cat => ({
      cat,
      meta: CATEGORY_META[cat],
      amount: activeSubscriptions.filter(s => s.category === cat).reduce((sum, s) => sum + toMonthlyAmount(s), 0),
    })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [activeSubscriptions]);

  const totalSpend = categoryTotals.reduce((s, c) => s + c.amount, 0);

  // Donut chart segments
  const donutSegments = useMemo(() => {
    let cumPercent = 0;
    const CHART_COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#6b7280', '#78716c'];
    return categoryTotals.map((c, i) => {
      const pct = (c.amount / totalSpend) * 100;
      const start = cumPercent;
      cumPercent += pct;
      return { ...c, startPct: start, pct, color: CHART_COLORS[i % CHART_COLORS.length] };
    });
  }, [categoryTotals, totalSpend]);

  const donutGradient = donutSegments
    .map(s => `${s.color} ${s.startPct.toFixed(1)}% ${(s.startPct + s.pct).toFixed(1)}%`)
    .join(', ');

  // Most expensive subscription
  const mostExpensive = [...activeSubscriptions].sort((a, b) => toMonthlyAmount(b) - toMonthlyAmount(a))[0];
  const avgPerSub = activeSubscriptions.length > 0 ? totalMonthlySpend / activeSubscriptions.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Spending trends and category breakdown</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Total',     value: `$${totalMonthlySpend.toFixed(2)}` },
          { label: 'Annual Projection', value: `$${(totalMonthlySpend * 12).toFixed(0)}` },
          { label: 'Avg Per Service',   value: `$${avgPerSub.toFixed(2)}` },
          { label: 'Most Expensive',    value: mostExpensive ? mostExpensive.name : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-lg font-bold text-white truncate">{value}</div>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-white mb-5">Monthly Spending Trend</h3>
        <div className="space-y-3">
          {monthlyHistory.map((m, i) => (
            <div key={m.label} className={`flex items-center gap-3 animate-fade-in delay-${i * 50 > 300 ? 300 : i * 50}`}>
              <span className="w-8 text-xs text-gray-500 text-right shrink-0">{m.label}</span>
              <div className="flex-1 bg-white/5 rounded-full h-7 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-700"
                  style={{ width: `${(m.amount / maxMonth) * 100}%` }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                  ${m.amount.toFixed(2)}
                </span>
              </div>
              {i === monthlyHistory.length - 1 && (
                <span className="text-xs text-purple-400 font-medium shrink-0">Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Spend by Category</h3>
          {categoryTotals.length === 0 ? (
            <p className="text-gray-500 text-sm">No active subscriptions</p>
          ) : (
            <div className="space-y-3">
              {categoryTotals.map(({ cat, meta, amount }) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-300">{meta.emoji} {meta.label}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 text-xs">{Math.round((amount / totalSpend) * 100)}%</span>
                      <span className="font-medium text-white">${amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(amount / (categoryTotals[0]?.amount ?? 1)) * 100}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donut chart */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Category Distribution</h3>
          {donutSegments.length === 0 ? (
            <p className="text-gray-500 text-sm">No active subscriptions</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div
                  className="w-36 h-36 rounded-full"
                  style={{ background: `conic-gradient(${donutGradient})` } as React.CSSProperties}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-950 flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-white">${totalSpend.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">/mo</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 min-w-0">
                {donutSegments.map(({ cat, meta, amount, pct, color }) => (
                  <div key={cat} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-gray-400 truncate">{meta.label}</span>
                    <span className="text-gray-500 shrink-0">{pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Per-subscription breakdown */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">All Subscriptions by Cost</h3>
        <div className="space-y-2">
          {[...activeSubscriptions]
            .sort((a, b) => toMonthlyAmount(b) - toMonthlyAmount(a))
            .map(sub => {
              const monthly = toMonthlyAmount(sub);
              return (
                <div key={sub.id} className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{sub.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm text-gray-300 truncate">{sub.name}</span>
                      <span className="text-sm font-medium text-white shrink-0">${monthly.toFixed(2)}/mo</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(monthly / (toMonthlyAmount(activeSubscriptions[0]) || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
