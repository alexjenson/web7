"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import type { Subscription, Category, BillingCycle, Status } from '@/lib/subscriptionTypes';
import { CATEGORIES, CATEGORY_META } from '@/lib/subscriptionData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subscription, 'id' | 'createdAt'>) => void;
  initialData?: Subscription;
}

function todayPlusDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const BLANK: Omit<Subscription, 'id' | 'createdAt'> = {
  name: '',
  category: 'streaming',
  amount: 0,
  billingCycle: 'monthly',
  nextBillingDate: todayPlusDays(30),
  status: 'active',
  emoji: '',
  color: '',
  notes: '',
  lastUsed: '',
};

export function AddSubscriptionModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData
        ? {
            name: initialData.name,
            category: initialData.category,
            amount: initialData.amount,
            billingCycle: initialData.billingCycle,
            nextBillingDate: initialData.nextBillingDate,
            status: initialData.status,
            emoji: initialData.emoji ?? '',
            color: initialData.color ?? '',
            notes: initialData.notes ?? '',
            lastUsed: initialData.lastUsed ?? '',
            originalAmount: initialData.originalAmount,
          }
        : { ...BLANK, nextBillingDate: todayPlusDays(30) }
      );
    }
  }, [isOpen, initialData]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const catEmoji = CATEGORY_META[form.category].emoji;
    onSave({
      ...form,
      emoji: form.emoji || catEmoji,
      color: form.color || CATEGORY_META[form.category].color,
      lastUsed: form.lastUsed || undefined,
      notes: form.notes || undefined,
    });
    onClose();
  }

  if (!isOpen) return null;

  const cycleLabel = form.billingCycle === 'monthly' ? 'Monthly' : form.billingCycle === 'annual' ? 'Annual' : 'Weekly';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-gray-950 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white text-lg">
            {initialData ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Service Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix, Spotify..."
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category *</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value as Category)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount + Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">{cycleLabel} Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount || ''}
                  onChange={e => set('amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Billing Cycle *</label>
              <select
                value={form.billingCycle}
                onChange={e => set('billingCycle', e.target.value as BillingCycle)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          {/* Next billing date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Next Billing Date *</label>
            <input
              type="date"
              required
              value={form.nextBillingDate}
              onChange={e => set('nextBillingDate', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Status</label>
            <div className="flex gap-2">
              {(['active', 'paused', 'cancelled'] as Status[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm capitalize border transition-colors ${
                    form.status === s
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji + Last used */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Emoji (optional)</label>
              <input
                type="text"
                maxLength={2}
                placeholder={CATEGORY_META[form.category].emoji}
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Last Used (optional)</label>
              <input
                type="date"
                value={form.lastUsed ?? ''}
                onChange={e => set('lastUsed', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Family plan, student discount, work expense..."
              value={form.notes ?? ''}
              onChange={e => set('notes', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-white/10 rounded-xl py-2.5 font-semibold">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5">
              <Save size={14} />
              {initialData ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
