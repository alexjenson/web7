"use client";

import { DollarSign, CreditCard, TrendingDown, Calendar } from 'lucide-react';

interface Props {
  totalMonthly: number;
  totalAnnual: number;
  activeCount: number;
  savingsPotential: number;
  nextRenewalName?: string;
  nextRenewalDate?: string;
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatRenewalDate(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function MetricsRow({ totalMonthly, totalAnnual, activeCount, savingsPotential, nextRenewalName, nextRenewalDate }: Props) {
  const cards = [
    {
      label: 'Monthly Spend',
      value: `$${totalMonthly.toFixed(2)}`,
      sub: `$${totalAnnual.toFixed(0)}/year`,
      icon: DollarSign,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Active Subscriptions',
      value: String(activeCount),
      sub: 'services tracked',
      icon: CreditCard,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Savings Potential',
      value: `$${savingsPotential.toFixed(0)}`,
      sub: 'identified per month',
      icon: TrendingDown,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Next Renewal',
      value: nextRenewalName ?? '—',
      sub: nextRenewalDate ? formatRenewalDate(nextRenewalDate) : 'No upcoming',
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={15} className={color} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white truncate">{value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
        </div>
      ))}
    </div>
  );
}
