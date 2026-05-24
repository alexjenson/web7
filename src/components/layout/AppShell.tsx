"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/subscriptions',  label: 'Subscriptions',  icon: CreditCard },
  { href: '/analytics',      label: 'Analytics',      icon: BarChart3 },
  { href: '/savings',        label: 'Savings',        icon: Lightbulb },
  { href: '/chat',           label: 'AI Chat',        icon: MessageCircle },
];

const APP_ROUTES = NAV_ITEMS.map(n => n.href);

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-64 bg-gray-950/95 border-r border-white/10 px-3 py-5">
      <div className="flex items-center justify-between px-1 mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">SubTrack</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
            >
              <Icon size={17} className={active ? 'text-purple-400' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Link href="/pricing" onClick={onClose} className="sidebar-nav-item">
          <Sparkles size={17} />
          Upgrade to Pro
        </Link>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAppRoute = APP_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

  if (!isAppRoute) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-950/95 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">SubTrack</span>
          </div>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
