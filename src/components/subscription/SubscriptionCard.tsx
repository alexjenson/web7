"use client";

import { useState } from 'react';
import { Pencil, Pause, Play, Trash2, MoreVertical, X } from 'lucide-react';
import type { Subscription, Status } from '@/lib/subscriptionTypes';
import { CATEGORY_META, toMonthlyAmount } from '@/lib/subscriptionData';

interface Props {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const STATUS_COLORS: Record<string, string> = {
  active:    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  paused:    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export function SubscriptionCard({ subscription: sub, onEdit, onDelete, onSetStatus }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const monthly = toMonthlyAmount(sub);
  const meta = CATEGORY_META[sub.category];
  const days = daysUntil(sub.nextBillingDate);
  const soonClass = days <= 3 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-gray-500';

  return (
    <div className="card p-5 hover:border-white/20 transition-colors group relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{sub.emoji}</span>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{sub.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`badge ${meta.bgColor} text-xs`} style={{ color: meta.color }}>
                {meta.emoji} {meta.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`badge ${STATUS_COLORS[sub.status]} capitalize`}>{sub.status}</span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => { onEdit(sub); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  {sub.status === 'active' ? (
                    <button
                      onClick={() => { onSetStatus(sub.id, 'paused'); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Pause size={13} /> Pause
                    </button>
                  ) : sub.status === 'paused' ? (
                    <button
                      onClick={() => { onSetStatus(sub.id, 'active'); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Play size={13} /> Resume
                    </button>
                  ) : null}
                  <button
                    onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <div className="text-2xl font-bold text-white">${monthly.toFixed(2)}</div>
          <div className="text-xs text-gray-500">
            {sub.billingCycle === 'monthly' ? '/month' : sub.billingCycle === 'annual' ? `/year (${sub.billingCycle})` : '/week'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Next billing</div>
          <div className={`text-sm font-medium ${soonClass}`}>{formatDate(sub.nextBillingDate)}</div>
        </div>
      </div>

      {sub.notes && (
        <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-white/5 truncate">{sub.notes}</p>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="absolute inset-0 z-20 bg-gray-950/95 rounded-2xl flex flex-col items-center justify-center p-5 gap-4">
          <Trash2 size={24} className="text-red-400" />
          <div className="text-center">
            <div className="font-semibold text-white mb-1">Delete {sub.name}?</div>
            <div className="text-xs text-gray-500">This action cannot be undone.</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onDelete(sub.id); setConfirmDelete(false); }}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-sm text-red-400 font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
          <button onClick={() => setConfirmDelete(false)} className="absolute top-3 right-3 text-gray-600 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
