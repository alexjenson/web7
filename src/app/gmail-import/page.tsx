"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { fetchGmailReceipts, toSubscriptions } from '@/lib/gmailScanner';
import { loadSubscriptions, saveSubscriptions } from '@/lib/storage';

type Step = 'idle' | 'authorizing' | 'scanning' | 'review' | 'done' | 'error';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(s);
  });
}

export default function GmailImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');
  const [found, setFound] = useState<ReturnType<typeof toSubscriptions>>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const startScan = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured. Add it to your Netlify environment variables.');
      setStep('error');
      return;
    }
    setStep('authorizing');
    try {
      await loadGisScript();
      const tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          if (resp.error || !resp.access_token) {
            setError(resp.error || 'Authorization cancelled');
            setStep('error');
            return;
          }
          setStep('scanning');
          try {
            const scanned = await fetchGmailReceipts(resp.access_token);
            const subs = toSubscriptions(scanned);
            setFound(subs);
            setSelected(new Set(subs.map((_, i) => i)));
            setStep('review');
          } catch (e) {
            setError(String(e));
            setStep('error');
          }
        },
      });
      tokenClient.requestAccessToken();
    } catch (e) {
      setError(String(e));
      setStep('error');
    }
  }, []);

  function importSelected() {
    const existing = loadSubscriptions();
    const toAdd = found
      .filter((_, i) => selected.has(i))
      .map(s => ({
        ...s,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().split('T')[0],
      }));
    const merged = [
      ...existing.filter(e => !toAdd.some(a => a.name === e.name)),
      ...toAdd,
    ];
    saveSubscriptions(merged);
    setStep('done');
  }

  function toggleAll() {
    setSelected(s => s.size === found.length ? new Set() : new Set(found.map((_, i) => i)));
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Import from Gmail</h1>
          <p className="text-gray-400 text-sm">
            Scan your inbox for receipts and billing emails — no password needed, read-only access.
          </p>
        </div>

        {step === 'idle' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-white font-medium">How it works</p>
                <ul className="text-gray-400 text-sm mt-1 space-y-1 list-disc list-inside">
                  <li>Click below and sign in with Google</li>
                  <li>SubTrack requests <strong>read-only</strong> Gmail access</li>
                  <li>It scans the last 12 months of receipts and invoices</li>
                  <li>You review and choose which subscriptions to import</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-white font-medium">Privacy</p>
                <p className="text-gray-400 text-sm">
                  Emails are parsed locally in your browser. Nothing is sent to any server.
                </p>
              </div>
            </div>
            <button
              onClick={startScan}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connect Gmail & Scan
            </button>
          </div>
        )}

        {step === 'authorizing' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔐</div>
            <p>Waiting for Google authorization…</p>
            <p className="text-sm mt-1">A popup should appear. If not, check your browser&apos;s popup blocker.</p>
          </div>
        )}

        {step === 'scanning' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3 animate-spin">📭</div>
            <p>Scanning your inbox for receipts…</p>
            <p className="text-sm mt-1">This usually takes 5–15 seconds.</p>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">
                Found {found.length} subscription{found.length !== 1 ? 's' : ''}
              </p>
              <button onClick={toggleAll} className="text-sm text-blue-400 hover:text-blue-300">
                {selected.size === found.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            {found.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center text-gray-400">
                <p>No subscription receipts found in the last 12 months.</p>
                <p className="text-sm mt-1">Try adding subscriptions manually from the Subscriptions page.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {found.map((sub, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selected.has(i)
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-gray-800/30 border-gray-700 opacity-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => setSelected(s => {
                          const n = new Set(s);
                          n.has(i) ? n.delete(i) : n.add(i);
                          return n;
                        })}
                        className="accent-blue-500 w-4 h-4"
                      />
                      <span className="text-xl">{sub.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{sub.name}</p>
                        <p className="text-gray-400 text-xs truncate">{sub.notes}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-semibold ${sub.status === 'cancelled' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {sub.status === 'cancelled' ? 'Cancelled' : `€${sub.amount}/mo`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={importSelected}
                  disabled={selected.size === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  Import {selected.size} subscription{selected.size !== 1 ? 's' : ''}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white text-xl font-semibold">Imported!</p>
            <p className="text-gray-400 mt-2">Your subscriptions are now tracked in SubTrack.</p>
            <button
              onClick={() => router.push('/subscriptions')}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              View Subscriptions
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
            <p className="text-red-400 font-medium mb-1">Something went wrong</p>
            <p className="text-gray-400 text-sm">{error}</p>
            {error.includes('NEXT_PUBLIC_GOOGLE_CLIENT_ID') && (
              <div className="mt-3 bg-gray-800/50 rounded-lg p-3 text-xs text-gray-300 space-y-1">
                <p className="font-semibold text-white">Setup steps:</p>
                <p>1. Go to <a href="https://console.cloud.google.com/apis/credentials" className="text-blue-400 underline" target="_blank" rel="noreferrer">Google Cloud Console → Credentials</a></p>
                <p>2. Create an OAuth 2.0 Client ID (Web application)</p>
                <p>3. Add <code className="bg-gray-700 px-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'your-site.netlify.app'}</code> as an authorized JavaScript origin</p>
                <p>4. Add <code className="bg-gray-700 px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id</code> to Netlify environment variables</p>
                <p>5. Redeploy</p>
              </div>
            )}
            <button
              onClick={() => setStep('idle')}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
