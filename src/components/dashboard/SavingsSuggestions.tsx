"use client";

import Link from 'next/link';
import { ArrowRight, AlertCircle, Info, TrendingDown } from 'lucide-react';
import type { Suggestion } from '@/lib/subscriptionTypes';

interface Props {
  suggestions: Suggestion[];
}

const PRIORITY_COLORS = {
  high:   { dot: 'bg-red-500',    text: 'text-red-400',    icon: AlertCircle },
  medium: { dot: 'bg-amber-500',  text: 'text-amber-400',  icon: Info },
  low:    { dot: 'bg-gray-500',   text: 'text-gray-400',   icon: TrendingDown },
};

export function SavingsSuggestions({ suggestions }: Props) {
  const top3 = suggestions.slice(0, 3);

  if (top3.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Savings Opportunities</h3>
        <p className="text-sm text-gray-500 text-center py-4">
          No savings suggestions right now. Great job!
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Savings Opportunities</h3>
        <Link href="/savings" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
          View all <ArrowRight size={11} />
        </Link>
      </div>
      <div className="space-y-3">
        {top3.map(s => {
          const { dot, text } = PRIORITY_COLORS[s.priority];
          return (
            <div key={s.id} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-gray-200 leading-snug">{s.title}</div>
                <div className={`text-xs font-medium mt-0.5 ${text}`}>
                  Save ${s.potentialSaving.toFixed(0)}/mo
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
