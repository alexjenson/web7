"use client";

import { useRef, useEffect, useState } from 'react';
import { Send, Trash2, Bot } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useChat } from '@/hooks/useChat';

const QUICK_ACTIONS = [
  "How much am I spending?",
  "What should I cancel?",
  "Help me negotiate my bill",
  "Find cheaper alternatives",
];

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
    );
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatPage() {
  const { subscriptions } = useSubscriptions();
  const { messages, isTyping, sendMessage, clearHistory } = useChat(subscriptions);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;
    setInput('');
    sendMessage(content);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Chat</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ask about cancellations, negotiations, and savings</p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={15} className="text-purple-400" />
              </div>
            )}
            <div
              className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
              }`}
            >
              {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
            </div>

            {/* Quick actions shown below the first assistant message only */}
            {msg.role === 'assistant' && idx === 0 && messages.length <= 2 && (
              <div className="hidden" />
            )}
          </div>
        ))}

        {/* Quick action chips — only show when only welcome message exists */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pl-11">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Bot size={15} className="text-purple-400" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-white/10 mt-4 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about cancellations, savings, or negotiation..."
            disabled={isTyping}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          AI responses are rule-based suggestions — always verify before cancelling services
        </p>
      </div>
    </div>
  );
}
