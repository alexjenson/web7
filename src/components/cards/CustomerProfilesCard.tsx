"use client";

import { useState } from "react";
import { CustomerProfile } from "@/lib/types";

const scoreBadge: Record<string, string> = {
  High:   "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Low:    "bg-red-500/20 text-red-300 border-red-500/30",
};

function ProfileCard({ profile }: { profile: CustomerProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left p-5 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {profile.avatar}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white text-sm">{profile.name}</h4>
              <span className="text-xs text-gray-500">{profile.age}</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-400">{profile.occupation}</span>
            </div>
            <p className="text-xs text-purple-300/70 mt-0.5">{profile.location}</p>

            {/* Score badges */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${scoreBadge[profile.engagementScore]}`}>
                {profile.engagementScore} engagement
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${scoreBadge[profile.purchasePotential]}`}>
                {profile.purchasePotential} purchase intent
              </span>
            </div>
          </div>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-gray-500 shrink-0 mt-1 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* Goals */}
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Goals</p>
              <ul className="space-y-1.5">
                {profile.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pain Points */}
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Pain Points</p>
              <ul className="space-y-1.5">
                {profile.painPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-red-400 mt-0.5 shrink-0">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What they want */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">What they want to see</p>
            <p className="text-xs text-gray-300 leading-relaxed">{profile.contentWants}</p>
          </div>

          {/* Why they'd follow */}
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-3">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">Why they'd follow you</p>
            <p className="text-xs text-gray-300 leading-relaxed">{profile.followReason}</p>
          </div>

          {/* Find on Instagram */}
          <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 px-4 py-3">
            <p className="text-xs font-semibold text-pink-300 uppercase tracking-wider mb-2">Find them on Instagram</p>
            <div className="flex flex-wrap gap-2">
              {profile.hashtags.map(tag => (
                <a
                  key={tag}
                  href={`https://www.instagram.com/explore/tags/${tag}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerProfilesCard({ profiles }: { profiles: CustomerProfile[] }) {
  if (!profiles.length) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🎯</span>
        <div>
          <h3 className="text-lg font-semibold text-white">Your Potential Customers</h3>
          <p className="text-xs text-gray-500 mt-0.5">Audience personas most likely to follow, engage, and buy from you</p>
        </div>
      </div>

      <div className="space-y-3">
        {profiles.map((profile, i) => (
          <ProfileCard key={i} profile={profile} />
        ))}
      </div>
    </div>
  );
}
