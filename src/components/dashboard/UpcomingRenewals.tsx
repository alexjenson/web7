"use client";

import { Calendar } from 'lucide-react';
import type { Subscription } from '@/lib/subscriptionTypes';
import { toMonthlyAmount } from '@/lib/subscriptionData';

interface Props {
  renewals: Subscription[];
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dayLabel(days: number): string {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days}d`;
}

export function UpcomingRenewals({ renewals }: Props) {
  const next7 = renewals.filter(s => daysUntil(s.nextBillingDate) <= 7);

  if (next7.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Upcoming Renewals</h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Calendar size={24} className="text-gray-600 mb-2" />
          <p className="text-sm text-gray-500">No renewals in the next 7 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">
        Upcoming Renewals
        <span className="ml-2 badge bg-purple-500/20 text-purple-300">{next7.length}</span>
      </h3>
      <div className="space-y-3">
        {next7.map(sub => {
          const days = daysUntil(sub.nextBillingDate);
          const urgent = days <= 1;
          return (
            <div key={sub.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg shrink-0">{sub.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{sub.name}</div>
                  <div className="text-xs text-gray-500">{formatDate(sub.nextBillingDate)}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-white">
                  ${toMonthlyAmount(sub).toFixed(2)}
                </div>
                <div className={`text-xs font-medium ${urgent ? 'text-red-400' : 'text-gray-500'}`}>
                  {dayLabel(days)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
