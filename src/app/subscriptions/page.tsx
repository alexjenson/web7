"use client";

import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { AddSubscriptionModal } from '@/components/subscription/AddSubscriptionModal';
import type { Subscription, Category, Status } from '@/lib/subscriptionTypes';
import { CATEGORIES, CATEGORY_META, toMonthlyAmount } from '@/lib/subscriptionData';

type SortKey = 'name' | 'amount' | 'nextBilling';

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, setStatus, totalMonthlySpend } = useSubscriptions();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('nextBilling');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | undefined>();

  const filtered = useMemo(() => {
    return subscriptions
      .filter(s => filterStatus === 'all' || s.status === filterStatus)
      .filter(s => filterCat === 'all' || s.category === filterCat)
      .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'amount') return toMonthlyAmount(b) - toMonthlyAmount(a);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      });
  }, [subscriptions, filterStatus, filterCat, search, sortBy]);

  function openAdd() {
    setEditing(undefined);
    setIsModalOpen(true);
  }

  function openEdit(sub: Subscription) {
    setEditing(sub);
    setIsModalOpen(true);
  }

  function handleSave(data: Omit<Subscription, 'id' | 'createdAt'>) {
    if (editing) {
      updateSubscription(editing.id, data);
    } else {
      addSubscription(data);
    }
  }

  const hasFilters = search || filterCat !== 'all' || filterStatus !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {subscriptions.length} total · $<span className="text-white">{totalMonthlySpend.toFixed(2)}</span>/mo
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={15} />
          Add New
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 appearance-none pr-8 cursor-pointer"
            >
              <option value="nextBilling">By Date</option>
              <option value="amount">By Amount</option>
              <option value="name">By Name</option>
            </select>
            <SlidersHorizontal size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCat('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCat === 'all' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.filter(cat => subscriptions.some(s => s.category === cat)).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat === filterCat ? 'all' : cat)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCat === cat ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {(['all', 'active', 'paused', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          {hasFilters ? (
            <>
              <p className="text-gray-400 mb-3">No subscriptions match your filters</p>
              <button
                onClick={() => { setSearch(''); setFilterCat('all'); setFilterStatus('all'); }}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-4">No subscriptions yet. Add your first one!</p>
              <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
                <Plus size={15} />
                Add Subscription
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(sub => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={openEdit}
              onDelete={deleteSubscription}
              onSetStatus={setStatus}
            />
          ))}
        </div>
      )}

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editing}
      />
    </div>
  );
}
