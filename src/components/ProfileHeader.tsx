import Image from "next/image";
import { InstagramProfile } from "@/lib/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function ProfileHeader({ profile }: { profile: InstagramProfile }) {
  return (
    <div className="card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="relative shrink-0">
        {profile.profile_pic_url ? (
          <Image
            src={profile.profile_pic_url}
            alt={profile.username}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-purple-500/50"
            unoptimized
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl text-white font-bold ring-2 ring-purple-500/50">
            {profile.username[0].toUpperCase()}
          </div>
        )}
        {profile.is_verified && (
          <span className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
            ✓
          </span>
        )}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <h2 className="text-xl font-bold text-white">@{profile.username}</h2>
          {profile.category_name && (
            <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
              {profile.category_name}
            </span>
          )}
        </div>
        {profile.full_name && (
          <p className="text-gray-400 text-sm mt-0.5">{profile.full_name}</p>
        )}
        {profile.biography && (
          <p className="text-gray-300 text-sm mt-2 line-clamp-3 leading-relaxed">
            {profile.biography}
          </p>
        )}
        <div className="flex justify-center sm:justify-start gap-6 mt-4 pt-4 border-t border-white/10">
          <Stat label="Followers" value={formatCount(profile.follower_count)} />
          <Stat label="Following" value={formatCount(profile.following_count)} />
          <Stat label="Posts" value={formatCount(profile.media_count)} />
        </div>
      </div>
    </div>
  );
}
