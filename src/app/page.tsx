import Link from 'next/link';
import {
  BarChart3,
  Bell,
  MessageCircle,
  TrendingDown,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Lightbulb,
} from 'lucide-react';

const FEATURES = [
  {
    icon: CreditCard,
    title: 'Track Everything',
    desc: 'Add all your subscriptions — streaming, SaaS, fitness, news — and see your total spend at a glance.',
    color: 'text-purple-400',
  },
  {
    icon: Bell,
    title: 'Never Miss a Renewal',
    desc: 'Get alerts before charges hit. See every upcoming renewal in the next 30 days.',
    color: 'text-pink-400',
  },
  {
    icon: TrendingDown,
    title: 'Find Hidden Savings',
    desc: 'Our AI engine spots unused subscriptions, duplicate services, and price hikes automatically.',
    color: 'text-emerald-400',
  },
  {
    icon: MessageCircle,
    title: 'AI Negotiation Coach',
    desc: 'Get proven scripts for negotiating lower rates or cancelling without the runaround.',
    color: 'text-blue-400',
  },
  {
    icon: BarChart3,
    title: 'Spending Analytics',
    desc: 'See your spending by category, month-over-month trends, and projected annual costs.',
    color: 'text-amber-400',
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    desc: 'Get prioritized recommendations: what to cancel, what to switch to annual, and cheaper alternatives.',
    color: 'text-cyan-400',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Add Your Subscriptions',
    desc: 'Manually add your subscriptions in seconds. No bank linking required.',
  },
  {
    step: '02',
    title: 'Get Instant Insights',
    desc: 'See your total spend, upcoming renewals, and AI-powered savings opportunities immediately.',
  },
  {
    step: '03',
    title: 'Take Action & Save',
    desc: 'Use negotiation scripts, cancel unused services, and track your savings over time.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-purple-950">
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Topnav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">SubTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="px-6 md:px-12 pt-16 pb-24 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-6">
            <Shield size={12} />
            No credit card required · Free forever plan available
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Stop Wasting Money on
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Forgotten Subscriptions
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The average person wastes <strong className="text-white">$273/year</strong> on subscriptions they forgot about.
            SubTrack tracks every subscription, finds savings, and helps you cancel — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all duration-150"
            >
              Start Tracking Free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-150"
            >
              See Pricing
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>No bank access needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Tracks 10+ subscription types</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>AI-powered savings insights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Cancellation scripts included</span>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                take control
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              SubTrack gives you a complete picture of your subscription spending with actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 hover:border-white/20 transition-colors">
                <Icon size={22} className={`${color} mb-3`} />
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-gray-400">Set up in minutes. Start saving immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-purple-600/0 via-purple-600/40 to-purple-600/0" />
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-300 font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing preview */}
        <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Simple Pricing</h2>
            <p className="text-gray-400">Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-4xl font-extrabold text-white mb-1">$0<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {['Track up to 10 subscriptions', 'Basic savings suggestions', '30-day renewal alerts', 'Spending by category'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block text-center btn-ghost border border-white/10 rounded-xl py-2.5 font-semibold">
                Get Started
              </Link>
            </div>

            <div className="card p-8 border-purple-500/40 bg-purple-500/5 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="text-2xl font-bold text-white mb-1">Pro</div>
              <div className="text-4xl font-extrabold text-white mb-1">$8<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-6">For power users who want full control</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Unlimited subscriptions', 'AI Chat negotiation coach', 'Price hike detection', 'Advanced analytics', 'Export to CSV'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={15} className="text-purple-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center btn-primary py-2.5 text-center rounded-xl font-semibold">
                View Full Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600/20 via-purple-600/10 to-pink-600/20 border border-purple-500/20 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to stop overpaying?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of people who&apos;ve already cut their subscription costs with SubTrack.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-10 py-4 rounded-xl text-base transition-all duration-150"
            >
              Start for Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <footer className="px-6 md:px-12 py-8 border-t border-white/5 text-center text-gray-600 text-sm max-w-7xl mx-auto">
          <div className="flex justify-center gap-6 mb-3">
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
            <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
          </div>
          © 2025 SubTrack · Your data stays on your device
        </footer>
      </div>
    </div>
  );
}
