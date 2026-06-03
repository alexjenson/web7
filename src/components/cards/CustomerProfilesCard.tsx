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
