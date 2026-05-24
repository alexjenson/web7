"use client";

import { useState } from 'react';
import type { ChatMessage, Subscription } from '@/lib/subscriptionTypes';
import { loadChatHistory, saveChatHistory } from '@/lib/storage';
import { toMonthlyAmount } from '@/lib/subscriptionData';
import { generateSuggestions } from '@/lib/suggestions';

const CANCELLATION_SCRIPTS: Record<string, string> = {
  netflix: `**Netflix Cancellation**\n\n1. Go to **netflix.com** → Account → Cancel Membership\n2. If they offer a "pause" — consider it if you'll come back within 3 months\n3. If calling retention, say: *"I'd like to cancel. I'm consolidating my streaming services and the cost isn't justifiable right now."*\n4. They may offer 1-3 months at 50% off — decide if that's worth it before agreeing`,
  spotify: `**Spotify Cancellation**\n\n1. Go to **spotify.com** → Account → Subscription → Cancel Premium\n2. You keep Premium until the period ends\n3. Consider Spotify Free as a fallback — it has ads but costs nothing\n4. Family or Student plans are significantly cheaper if you qualify`,
  'adobe creative cloud': `**Adobe Creative Cloud Cancellation**\n\n1. Go to **account.adobe.com** → Plans → Cancel plan\n2. **Warning:** Mid-year cancellations incur a 50% early termination fee\n3. Best to cancel near your renewal date\n4. Alternatives: **Affinity Suite** (one-time purchase ~$170) or **Canva Pro** for design needs`,
  'disney+': `**Disney+ Cancellation**\n\n1. Go to **disneyplus.com** → Account → Cancel subscription\n2. Alternatively call 1-888-905-7888\n3. Consider the annual plan — it's ~16% cheaper than monthly\n4. Note: Disney+, Hulu, and ESPN+ bundle offers are often better value`,
  'amazon prime': `**Amazon Prime Cancellation**\n\n1. Go to **amazon.com** → Account → Prime Membership → End Membership\n2. You can get a prorated refund if you haven't used benefits\n3. Prime Video is also available separately for less than full Prime\n4. Check if your library offers free Kanopy or Hoopla streaming`,
};

function generateResponse(input: string, subs: Subscription[]): string {
  const lower = input.toLowerCase();
  const active = subs.filter(s => s.status === 'active');
  const totalMonthly = active.reduce((sum, s) => sum + toMonthlyAmount(s), 0);

  // Cost overview
  if (/how much|spending|total cost|my bill/.test(lower)) {
    const mostExpensive = [...active].sort((a, b) => toMonthlyAmount(b) - toMonthlyAmount(a))[0];
    return `You're currently spending **$${totalMonthly.toFixed(2)}/month** across ${active.length} active subscriptions — that's **$${(totalMonthly * 12).toFixed(0)}/year**.\n\nYour biggest expense is **${mostExpensive?.name ?? 'N/A'}** at $${toMonthlyAmount(mostExpensive ?? active[0] ?? { amount: 0, billingCycle: 'monthly' }).toFixed(2)}/mo.`;
  }

  // Savings overview
  if (/sav|suggest|tip|recommend|waste|cut|reduc/.test(lower)) {
    const suggestions = generateSuggestions(active);
    if (suggestions.length === 0) {
      return `Your subscriptions look well-optimized! No major savings opportunities detected right now. Keep an eye on unused services — that's usually where the most waste creeps in.`;
    }
    const top = suggestions[0];
    return `Your biggest savings opportunity right now:\n\n**${top.title}** — ${top.description}\n\nThat could save you **$${top.potentialSaving.toFixed(2)}/month** ($${(top.potentialSaving * 12).toFixed(0)}/year). Check the Savings page for all ${suggestions.length} suggestions.`;
  }

  // Negotiation
  if (/negot|lower|reduce|discount|deal|less|cheaper.*bill|cheaper.*plan/.test(lower)) {
    const serviceName = findServiceInInput(lower, active);
    const base = `Here's a proven negotiation script:\n\n**Step 1 — Leverage**\n*"I've been a customer for [X years] and I'm considering cancelling due to the cost."*\n\n**Step 2 — Anchor**\n*"I've seen promotions for new customers at a lower rate. Can you match that for a loyal customer?"*\n\n**Step 3 — Close**\n*"If you can offer me [discount/free months/plan downgrade], I'm happy to stay."*\n\n**Pro tips:**\n• Call, don't chat — phone agents have more authority to offer discounts\n• End of the billing period is the best time to call\n• The word "cancel" unlocks retention offers most agents can't give otherwise`;
    if (serviceName) {
      return `For **${serviceName}** specifically:\n\n${base}`;
    }
    return base;
  }

  // Cancel specific service
  if (/cancel/.test(lower)) {
    const serviceName = findServiceInInput(lower, active);
    if (serviceName) {
      const script = Object.entries(CANCELLATION_SCRIPTS).find(([k]) =>
        serviceName.toLowerCase().includes(k)
      );
      if (script) return script[1];
      return `To cancel **${serviceName}**, go to their website/app → Account Settings → Subscription → Cancel. If you can't find it, search "${serviceName} cancel subscription" — they're required to make this reasonably accessible.\n\nYou can also mark it as cancelled in your SubTrack dashboard to stop tracking it.`;
    }
    return `To cancel a subscription:\n\n1. Go to the service's website or app\n2. Find Account → Subscription or Billing settings\n3. Look for "Cancel subscription" or "Manage plan"\n\nWhich service are you looking to cancel? I can give you specific steps.`;
  }

  // Pause services
  if (/pause|freez|suspend/.test(lower)) {
    return `Services that support **pausing** (no charge while paused):\n\n• **Netflix** — pause for 1-3 months\n• **Hulu** — pause for up to 12 weeks\n• **Peloton** — pause up to 3 months\n• **Amazon Prime** — pause for up to 3 months (limited)\n\nMost SaaS tools do **not** offer a pause — you'd need to cancel and re-subscribe. Annual plan holders usually can't pause mid-term without an early termination fee.`;
  }

  // Cheaper alternatives
  if (/cheap|alternative|switch|replac|less expensive/.test(lower)) {
    const serviceName = findServiceInInput(lower, active);
    const ALTERNATIVES: Record<string, string> = {
      'adobe creative cloud': `• **Affinity Suite** — one-time purchase ~$170 (vs $660/yr for Adobe)\n• **Canva Pro** — $13/mo, great for most design tasks\n• **GIMP + Inkscape** — free, open-source alternatives`,
      'spotify': `• **YouTube Music** — free with YouTube Premium, or $11/mo standalone\n• **Apple Music** — $11/mo, similar catalog\n• **Amazon Music** — included with Prime membership\n• **Deezer** — $11/mo with a free tier available`,
      'netflix': `• **Max** — often runs promotions\n• **Peacock** — free tier available, Premium at $6/mo\n• **Pluto TV** — completely free, ad-supported`,
      'microsoft 365': `• **Google Workspace free tier** — Docs, Sheets, Slides at no cost\n• **LibreOffice** — free desktop alternative\n• **Notion** — free tier covers most productivity needs`,
    };
    if (serviceName) {
      const alt = Object.entries(ALTERNATIVES).find(([k]) => serviceName.toLowerCase().includes(k));
      if (alt) return `**Cheaper alternatives to ${serviceName}:**\n\n${alt[1]}`;
    }
    return `Here are some popular cheaper alternatives by category:\n\n**Streaming:** Peacock (free tier), Pluto TV (free), Tubi (free)\n**Music:** YouTube Music, Amazon Music (with Prime)\n**Design:** Canva (free tier), Affinity Suite (one-time)\n**Productivity:** Google Workspace free, Notion free tier\n\nWhich service are you looking to replace?`;
  }

  // List subscriptions
  if (/list|what.*subscri|show.*subscri|my subscri/.test(lower)) {
    if (active.length === 0) return `You don't have any active subscriptions tracked yet. Head to the Subscriptions page to add some!`;
    const list = active.map(s => `• **${s.name}** — $${toMonthlyAmount(s).toFixed(2)}/mo`).join('\n');
    return `Your ${active.length} active subscriptions:\n\n${list}\n\n**Total: $${totalMonthly.toFixed(2)}/mo**`;
  }

  // Help/default
  return `I can help you with:\n\n• **"How much am I spending?"** — see your total and breakdown\n• **"Help me cancel [service]"** — step-by-step cancellation guide\n• **"Help me negotiate my bill"** — proven scripts for getting discounts\n• **"What can I pause?"** — services that support pausing\n• **"Cheaper alternatives to [service]"** — find better deals\n• **"What should I cancel?"** — AI savings recommendations\n\nWhat would you like to know?`;
}

function findServiceInInput(lower: string, subs: Subscription[]): string | undefined {
  // First check tracked subscriptions
  const tracked = subs.find(s => lower.includes(s.name.toLowerCase()));
  if (tracked) return tracked.name;
  // Then check known services
  const known = ['netflix', 'spotify', 'adobe creative cloud', 'disney+', 'amazon prime', 'hulu', 'microsoft 365', 'apple tv', 'youtube premium', 'peloton'];
  const found = known.find(k => lower.includes(k));
  return found;
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm your subscription management assistant. I can help you:\n\n• Find savings and unused subscriptions\n• Get cancellation scripts for specific services\n• Negotiate lower rates with proven scripts\n• Find cheaper alternatives\n\nWhat would you like help with today?`,
  timestamp: Date.now(),
};

export function useChat(subscriptions: Subscription[]) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const history = loadChatHistory();
    return history.length > 0 ? history : [WELCOME];
  });
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(content: string) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    saveChatHistory(next);
    setIsTyping(true);

    const responseText = generateResponse(content, subscriptions);
    const delay = 600 + Math.min(responseText.length * 2, 1200);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };
      const final = [...next, assistantMsg];
      setMessages(final);
      saveChatHistory(final);
      setIsTyping(false);
    }, delay);
  }

  function clearHistory() {
    setMessages([WELCOME]);
    saveChatHistory([]);
  }

  return { messages, isTyping, sendMessage, clearHistory };
}
