import Link from 'next/link';
import { CheckCircle2, Zap } from 'lucide-react';

const FREE_FEATURES = [
  'Track up to 10 subscriptions',
  'Basic savings suggestions',
  '30-day renewal alerts',
  'Spending by category',
  'Manual entry',
  'Data stays on your device',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited subscriptions',
  'AI Chat negotiation coach',
  'Price hike detection',
  'Duplicate service alerts',
  'Advanced analytics',
  'Annual savings calculator',
  'Export to CSV (coming soon)',
];

const FAQ = [
  {
    q: 'Is my financial data safe?',
    a: 'Yes. SubTrack stores all data locally in your browser. We never send your subscription data to any server.',
  },
  {
    q: 'Do I need to connect my bank account?',
    a: 'No. SubTrack uses manual entry — you add subscriptions yourself. No bank linking, no plaid, no account credentials.',
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Your subscriptions are stored in localStorage. Clearing browser storage will remove them. Export to CSV (Pro) lets you back up your data.',
  },
  {
    q: 'Is the Pro plan available now?',
    a: 'Pro features are available in this demo for free. Payment processing is coming soon.',
  },
  {
    q: 'Can I use SubTrack on mobile?',
    a: 'Yes — the dashboard is fully responsive and works on all screen sizes.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-purple-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Nav */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">SubTrack</span>
          </Link>
          <Link href="/dashboard" className="btn-primary text-sm">
            Go to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no surprise charges.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <CheckCircle2 size={12} />
            Pro features available free in this demo
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
          {/* Free */}
          <div className="card p-8">
            <div className="mb-6">
              <div className="text-gray-400 text-sm font-medium mb-1">Free</div>
              <div className="text-5xl font-extrabold text-white mb-1">$0</div>
              <div className="text-gray-500 text-sm">Forever free, no credit card</div>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="block text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="card p-8 border-purple-500/40 bg-purple-500/5 relative">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <div className="text-purple-300 text-sm font-medium mb-1">Pro</div>
              <div className="flex items-end gap-1 mb-1">
                <div className="text-5xl font-extrabold text-white">$8</div>
                <div className="text-gray-400 text-sm mb-2">/month</div>
              </div>
              <div className="text-gray-500 text-sm">$80/year (save 17%)</div>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="block text-center py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all"
            >
              Try Pro Free (Demo)
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="card group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-white font-medium text-sm hover:text-purple-300 transition-colors">
                  {q}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform duration-200 text-lg leading-none shrink-0 ml-2">
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Questions?{' '}
            <Link href="/chat" className="text-purple-400 hover:text-purple-300">
              Ask our AI assistant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
