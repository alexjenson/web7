"use client";

import { useState } from 'react';
import { AlertCircle, Info, TrendingDown, X, CheckCircle2 } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { loadDismissed, saveDismissed } from '@/lib/storage';
import type { SuggestionType } from '@/lib/subscriptionTypes';

const TYPE_LABELS: Record<SuggestionType, string> = {
  unused:        'Unused Service',
  duplicate:     'Duplicate Category',
  cheaper:       'Cheaper Alternative',
  price_hike:    'Price Hike',
  annual_switch: 'Annual Savings',
};

const PRIORITY_STYLES = {
  high:   { dot: 'bg-red-500', badge: 'bg-red-500/20 text-red-400 border border-red-500/30', Icon: AlertCircle },
  medium: { dot: 'bg-amber-500', badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', Icon: Info },
  low:    { dot: 'bg-gray-400', badge: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', Icon: TrendingDown },
};

type FilterTab = 'all' | SuggestionType;

export default function SavingsPage() {
  const { suggestions, savingsPotential, setStatus } = useSubscriptions();
  const [dismissed, setDismissed] = useState<string[]>(() => loadDismissed());
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  function dismiss(id: string) {
    const next = [...dismissed, id];
    setDismissed(next);
    saveDismissed(next);
  }

  const visible = suggestions.filter(s => !dismissed.includes(s.id));
  const filtered = activeTab === 'all' ? visible : visible.filter(s => s.type === activeTab);

  const ALL_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all',           label: `All (${visible.length})` },
    { key: 'unused',        label: 'Unused' },
    { key: 'duplicate',     label: 'Duplicates' },
    { key: 'price_hike',    label: 'Price Hikes' },
    { key: 'annual_switch', label: 'Annual Savings' },
    { key: 'cheaper',       label: 'Alternatives' },
  ];
  const TABS = ALL_TABS.filter(t => t.key === 'all' || visible.some(s => s.type === t.key));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Savings Opportunities</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI-powered suggestions to reduce your subscription spend</p>
      </div>

      {/* Potential savings banner */}
      {savingsPotential > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 via-purple-600/10 to-pink-600/20 border border-purple-500/20 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-gray-400 mb-0.5">Total savings potential identified</div>
              <div className="text-3xl font-extrabold text-white">
                ${savingsPotential.toFixed(2)}<span className="text-lg font-normal text-gray-400">/mo</span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">${(savingsPotential * 12).toFixed(0)}/year if you act on all suggestions</div>
            </div>
            <div className="text-right">
              <div className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm px-3 py-1">
                {visible.length} suggestion{visible.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
          <div className="font-semibold text-white mb-1">
            {dismissed.length > 0 && visible.length === 0
              ? 'All suggestions dismissed'
              : 'No suggestions in this category'}
          </div>
          <p className="text-sm text-gray-500">
            {dismissed.length > 0 && visible.length === 0
              ? 'Great job managing your subscriptions!'
              : 'Your subscriptions look well-optimized in this area.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => {
            const { dot, badge, Icon } = PRIORITY_STYLES[s.priority];
            return (
              <div key={s.id} className="card p-5 relative">
                <button
                  onClick={() => dismiss(s.id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors"
                  title="Dismiss suggestion"
                >
                  <X size={15} />
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <div className={`w-2 h-2 rounded-full ${dot} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge ${badge} text-xs`}>
                        <Icon size={11} className="mr-1" />
                        {TYPE_LABELS[s.type]}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{s.priority} priority</span>
                    </div>

                    <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{s.description}</p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-emerald-400 text-sm font-semibold">
                        Save ${s.potentialSaving.toFixed(2)}/mo
                      </div>

                      <div className="flex gap-2">
                        {(s.type === 'unused' || s.type === 'duplicate') && (
                          <button
                            onClick={() => { setStatus(s.subscriptionId, 'cancelled'); dismiss(s.id); }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-medium transition-colors"
                          >
                            Cancel it
                          </button>
                        )}
                        {s.type === 'unused' && (
                          <button
                            onClick={() => { setStatus(s.subscriptionId, 'paused'); dismiss(s.id); }}
                            className="px-3 py-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400 text-xs font-medium transition-colors"
                          >
                            Pause it
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(s.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-medium transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
