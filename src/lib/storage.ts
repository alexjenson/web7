import type { Subscription, ChatMessage } from './subscriptionTypes';

const SUBS_KEY = 'subtrack_subscriptions';
const CHAT_KEY = 'subtrack_chat';
const DISMISSED_KEY = 'subtrack_dismissed';

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(SUBS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Subscription[];
  } catch {
    return [];
  }
}

export function saveSubscriptions(subs: Subscription[]): void {
  try {
    localStorage.setItem(SUBS_KEY, JSON.stringify(subs));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChatHistory(msgs: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
  } catch {}
}

export function loadDismissed(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveDismissed(ids: string[]): void {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  } catch {}
}
