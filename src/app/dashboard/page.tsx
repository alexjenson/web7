"use client";

import Link from 'next/link';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { MetricsRow } from '@/components/dashboard/MetricsRow';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { SavingsSuggestions } from '@/components/dashboard/SavingsSuggestions';
import { toMonthlyAmount } from '@/lib/subscriptionData';
import { ArrowRight, Plus } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active:    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    paused:    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return (
    <span className={`badge ${colors[status] ?? ''} capitalize`}>{status}</span>
  );
}

export default function DashboardPage() {
  const {
    subscriptions,
    activeSubscriptions,
    totalMonthlySpend,
    suggestions,
    upcomingRenewals,
    savingsPotential,
  } = useSubscriptions();

  const nextRenewal = upcomingRenewals[0];
  const previewSubs = activeSubscriptions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Overview of your {subscriptions.length} tracked subscriptions
        </p>
      </div>

      <MetricsRow
        totalMonthly={totalMonthlySpend}
        totalAnnual={totalMonthlySpend * 12}
        activeCount={activeSubscriptions.length}
        savingsPotential={savingsPotential}
        nextRenewalName={nextRenewal?.name}
        nextRenewalDate={nextRenewal?.nextBillingDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription preview list */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Active Subscriptions</h3>
            <Link href="/subscriptions" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {previewSubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-gray-500 mb-3">No subscriptions yet</p>
              <Link href="/subscriptions" className="btn-primary text-xs flex items-center gap-1.5">
                <Plus size={13} />
                Add your first
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {previewSubs.map(sub => (
                <div key={sub.id} className="flex items-center justify-between gap-2 py-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{sub.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{sub.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{sub.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={sub.status} />
                    <span className="text-sm font-semibold text-white">
                      ${toMonthlyAmount(sub).toFixed(2)}<span className="text-gray-500 font-normal">/mo</span>
                    </span>
                  </div>
                </div>
              ))}

              {activeSubscriptions.length > 5 && (
                <Link
                  href="/subscriptions"
                  className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 py-2 border-t border-white/5 mt-2"
                >
                  +{activeSubscriptions.length - 5} more subscriptions <ArrowRight size={11} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <UpcomingRenewals renewals={upcomingRenewals} />
          <SavingsSuggestions suggestions={suggestions} />
        </div>
      </div>

      <CategoryBreakdown subscriptions={subscriptions} />
    </div>
  );
}
