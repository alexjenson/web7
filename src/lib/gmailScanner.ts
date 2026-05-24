import type { Category, Subscription } from './subscriptionTypes';

export interface ScannedSubscription {
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual' | 'weekly';
  lastChargeDate: string;
  nextBillingDate: string;
  status: 'active' | 'cancelled';
  category: Category;
  emoji: string;
  color: string;
  notes: string;
}

interface GmailMessage {
  id: string;
  snippet: string;
  payload?: {
    headers?: { name: string; value: string }[];
    body?: { data?: string };
    parts?: { mimeType: string; body: { data?: string } }[];
  };
}

// Known senders → display names + metadata
const SENDER_MAP: Record<string, { name: string; category: Category; emoji: string; color: string }> = {
  'stripe.com':           { name: '', category: 'software',     emoji: '💳', color: '#635bff' },
  'anthropic.com':        { name: 'Claude Pro',   category: 'productivity', emoji: '🤖', color: '#d97706' },
  'acct_1REyrSBNUnCSzfs9': { name: 'Claude Pro',  category: 'productivity', emoji: '🤖', color: '#d97706' },
  'heygen.com':           { name: 'HeyGen',        category: 'software',     emoji: '🎥', color: '#7c3aed' },
  'acct_1LNh3DDIvHNr5wfC': { name: 'HeyGen',      category: 'software',     emoji: '🎥', color: '#7c3aed' },
  'netflix.com':          { name: 'Netflix',        category: 'streaming',    emoji: '🎬', color: '#e50914' },
  'spotify.com':          { name: 'Spotify',        category: 'music',        emoji: '🎵', color: '#1db954' },
  'apple.com':            { name: 'Apple',          category: 'cloud',        emoji: '🍎', color: '#555555' },
  'adobe.com':            { name: 'Adobe CC',       category: 'software',     emoji: '🎨', color: '#ff0000' },
  'microsoft.com':        { name: 'Microsoft 365',  category: 'productivity', emoji: '📊', color: '#d83b01' },
  'google.com':           { name: 'Google',         category: 'cloud',        emoji: '🔵', color: '#4285f4' },
  'notion.so':            { name: 'Notion',         category: 'productivity', emoji: '📝', color: '#000000' },
  'figma.com':            { name: 'Figma',          category: 'software',     emoji: '🎨', color: '#f24e1e' },
  'openai.com':           { name: 'ChatGPT Plus',   category: 'productivity', emoji: '🤖', color: '#10a37f' },
  'github.com':           { name: 'GitHub',         category: 'software',     emoji: '🐙', color: '#333333' },
  'dropbox.com':          { name: 'Dropbox',        category: 'cloud',        emoji: '📦', color: '#0061ff' },
  'canva.com':            { name: 'Canva Pro',      category: 'software',     emoji: '🖼️', color: '#00c4cc' },
  'vercel.com':           { name: 'Vercel Pro',     category: 'software',     emoji: '▲',  color: '#000000' },
  'netlify.com':          { name: 'Netlify',        category: 'software',     emoji: '🌐', color: '#00c7b7' },
  'loom.com':             { name: 'Loom',           category: 'software',     emoji: '🎥', color: '#625df5' },
  'zoom.us':              { name: 'Zoom',           category: 'software',     emoji: '📹', color: '#2d8cff' },
  'slack.com':            { name: 'Slack',          category: 'productivity', emoji: '💬', color: '#4a154b' },
  'linear.app':           { name: 'Linear',         category: 'productivity', emoji: '📋', color: '#5e6ad2' },
  'superhuman.com':       { name: 'Superhuman',     category: 'productivity', emoji: '⚡', color: '#ff4e00' },
};

// Patterns to extract amounts from email text
const AMOUNT_PATTERNS = [
  /Amount paid[:\s]+([€$£¥₹])\s*([\d,]+\.?\d*)/i,
  /Total[:\s]+([€$£¥₹])\s*([\d,]+\.?\d*)/i,
  /Receipt.*?([€$£¥₹])\s*([\d,]+\.?\d*)/i,
  /charged.*?([€$£¥₹])\s*([\d,]+\.?\d*)/i,
  /([€$£¥₹])\s*([\d,]+\.?\d*)\s*(?:paid|charged|billed)/i,
  /Plan Amount:\s*\$?([\d,]+\.?\d*)/i,
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '₹': 'INR',
};

function decodeBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
  } catch {
    return '';
  }
}

function extractBody(message: GmailMessage): string {
  if (!message.payload) return message.snippet || '';
  const body = message.payload.body?.data;
  if (body) return decodeBase64(body);
  const parts = message.payload.parts || [];
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body.data) {
      return decodeBase64(part.body.data);
    }
  }
  return message.snippet || '';
}

function extractAmount(text: string): { amount: number; currency: string } | null {
  for (const pattern of AMOUNT_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      const symbol = m[1];
      const raw = (m[2] || m[1]).replace(/,/g, '');
      const amount = parseFloat(raw);
      if (!isNaN(amount) && amount > 0 && amount < 10000) {
        return { amount, currency: CURRENCY_SYMBOLS[symbol] || 'USD' };
      }
    }
  }
  return null;
}

function senderMeta(from: string) {
  for (const [key, meta] of Object.entries(SENDER_MAP)) {
    if (from.toLowerCase().includes(key.toLowerCase())) return meta;
  }
  return null;
}

function extractServiceName(subject: string, from: string): string {
  // "Your receipt from Anthropic Ireland, Limited #..."
  const fromMatch = subject.match(/receipt from ([^#\n]+?)(?:\s*#|\s*$)/i);
  if (fromMatch) return fromMatch[1].trim();
  // "Your Spotify Premium receipt"
  const premiumMatch = subject.match(/your\s+(.+?)\s+(?:receipt|invoice|subscription|billing)/i);
  if (premiumMatch) return premiumMatch[1].trim();
  // fallback: domain name
  const domainMatch = from.match(/@([^.]+)\./);
  if (domainMatch) return domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1);
  return 'Unknown';
}

function addMonths(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().split('T')[0];
}

function isCancellation(subject: string, body: string): boolean {
  const text = (subject + ' ' + body).toLowerCase();
  return /cancel|cancelled|cancellation|expired|deactivated|ended/.test(text);
}

export function parseMessages(messages: GmailMessage[]): ScannedSubscription[] {
  const byName = new Map<string, ScannedSubscription>();

  for (const msg of messages) {
    const headers = msg.payload?.headers || [];
    const from = headers.find(h => h.name === 'From')?.value || '';
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';
    const body = extractBody(msg);

    const meta = senderMeta(from) || senderMeta(subject);
    const amountData = extractAmount(body) || extractAmount(subject);
    if (!amountData) continue;

    const serviceName = meta?.name || extractServiceName(subject, from);
    if (!serviceName || serviceName === 'Unknown') continue;

    const chargeDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const cancelled = isCancellation(subject, body);

    const existing = byName.get(serviceName);
    if (!existing || chargeDate > existing.lastChargeDate) {
      byName.set(serviceName, {
        name: serviceName,
        amount: amountData.amount,
        currency: amountData.currency,
        billingCycle: 'monthly',
        lastChargeDate: chargeDate,
        nextBillingDate: cancelled ? chargeDate : addMonths(chargeDate, 1),
        status: cancelled ? 'cancelled' : 'active',
        category: meta?.category || 'software',
        emoji: meta?.emoji || '📦',
        color: meta?.color || '#6b7280',
        notes: `Scanned from: ${subject.slice(0, 80)}`,
      });
    } else if (cancelled) {
      existing.status = 'cancelled';
    }
  }

  return Array.from(byName.values());
}

export function toSubscriptions(scanned: ScannedSubscription[]): Omit<Subscription, 'id' | 'createdAt'>[] {
  return scanned.map(s => ({
    name: s.name,
    category: s.category,
    amount: s.amount,
    billingCycle: s.billingCycle,
    nextBillingDate: s.nextBillingDate,
    status: s.status,
    emoji: s.emoji,
    color: s.color,
    notes: s.notes,
  }));
}

// Gmail REST API helpers — runs in browser with OAuth token
export async function fetchGmailReceipts(accessToken: string): Promise<ScannedSubscription[]> {
  const query = encodeURIComponent(
    'subject:(receipt OR invoice OR subscription OR billing OR "amount paid") newer_than:12m'
  );
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!listRes.ok) throw new Error(`Gmail list failed: ${listRes.status}`);
  const listData = await listRes.json();
  const messageIds: string[] = (listData.messages || []).map((m: { id: string }) => m.id);

  const messages: GmailMessage[] = await Promise.all(
    messageIds.map(async id => {
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return r.ok ? r.json() : null;
    })
  );

  return parseMessages(messages.filter(Boolean));
}
