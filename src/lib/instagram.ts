import { InstagramProfile, InstagramPost } from "./types";

export class InstagramAPIError extends Error {
  code: string;
  statusCode: number;
  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = "InstagramAPIError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Attempt 1: Instagram internal API ──────────────────────────────────────

async function tryInternalAPI(username: string) {
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.instagram.com/",
        Origin: "https://www.instagram.com",
        "x-ig-app-id": "936619743392459",
        "x-requested-with": "XMLHttpRequest",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    }
  );

  if (res.status === 404) throw new InstagramAPIError("USER_NOT_FOUND", "User not found", 404);
  if (res.status === 401 || res.status === 403 || res.status === 429) return null; // signal to try fallback
  if (!res.ok) return null;

  const data = await res.json();
  return (data as { data?: { user?: Record<string, unknown> } })?.data?.user ?? null;
}

// ── Attempt 2: Scrape public profile HTML ──────────────────────────────────

async function tryProfileScrape(username: string) {
  const res = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const html = await res.text();

  // Extract JSON-LD schema data (always present for public profiles)
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const schema = JSON.parse(jsonLdMatch[1]);
      const entity = schema?.mainEntity ?? schema;
      if (entity?.alternateName || entity?.identifier) {
        // Extract follower count from interactionStatistic
        let followers = 0;
        if (Array.isArray(entity.interactionStatistic)) {
          const followerStat = entity.interactionStatistic.find(
            (s: { interactionType?: string }) => s?.interactionType?.includes("FollowAction")
          );
          followers = followerStat?.userInteractionCount ?? 0;
        }

        const handle = (entity.alternateName ?? "").replace("@", "");
        return {
          username: handle || username,
          full_name: entity.name ?? "",
          biography: entity.description ?? "",
          profile_pic_url_hd: entity.image ?? "",
          edge_followed_by: { count: followers },
          edge_follow: { count: 0 },
          media_count: 0,
          is_private: false,
          is_verified: false,
          category_name: null,
          external_url: entity.url ?? null,
          // No posts from this method
          edge_owner_to_timeline_media: { edges: [] },
        };
      }
    } catch { /* continue */ }
  }

  // Fallback: extract from og:tags
  const nameMatch = html.match(/<meta property="og:title" content="([^"]*?)"/);
  const descMatch = html.match(/<meta property="og:description" content="([^"]*?)"/);
  const imgMatch = html.match(/<meta property="og:image" content="([^"]*?)"/);

  if (nameMatch) {
    // og:title is usually "Full Name (@username) • Instagram"
    const titleParts = nameMatch[1].split("(");
    const fullName = titleParts[0]?.trim() ?? "";
    const handleMatch = nameMatch[1].match(/@([\w.]+)/);
    const handle = handleMatch?.[1] ?? username;

    // og:description has "X Followers, Y Following, Z Posts"
    let followers = 0;
    if (descMatch) {
      const followerMatch = descMatch[1].match(/([\d,.]+)\s*Followers/i);
      if (followerMatch) followers = parseInt(followerMatch[1].replace(/[,.]/g, "")) || 0;
    }

    return {
      username: handle,
      full_name: fullName,
      biography: descMatch?.[1] ?? "",
      profile_pic_url_hd: imgMatch?.[1] ?? "",
      edge_followed_by: { count: followers },
      edge_follow: { count: 0 },
      media_count: 0,
      is_private: false,
      is_verified: false,
      category_name: null,
      external_url: null,
      edge_owner_to_timeline_media: { edges: [] },
    };
  }

  return null;
}

// ── Map raw user object to typed profile ──────────────────────────────────

function mapProfile(user: Record<string, unknown>, username: string): InstagramProfile {
  return {
    username: (user.username as string) ?? username,
    full_name: (user.full_name as string) ?? "",
    biography: (user.biography as string) ?? "",
    profile_pic_url: (user.profile_pic_url_hd as string) ?? (user.profile_pic_url as string) ?? "",
    follower_count: (user.edge_followed_by as { count: number })?.count ?? 0,
    following_count: (user.edge_follow as { count: number })?.count ?? 0,
    media_count: (user.media_count as number) ?? 0,
    is_private: (user.is_private as boolean) ?? false,
    is_verified: (user.is_verified as boolean) ?? false,
    category_name: (user.category_name as string) ?? null,
    external_url: (user.external_url as string) ?? null,
  };
}

function mapPosts(user: Record<string, unknown>): InstagramPost[] {
  const edges = (
    user.edge_owner_to_timeline_media as { edges: { node: Record<string, unknown> }[] }
  )?.edges ?? [];

  return edges.slice(0, 12).map((edge) => {
    const node = edge.node;
    const caption =
      (node.edge_media_to_caption as { edges: { node: { text: string } }[] })
        ?.edges?.[0]?.node?.text ?? "";
    const isVideo = node.__typename === "GraphVideo" || node.is_video;
    const isSidecar = node.__typename === "GraphSidecar";

    return {
      type: isVideo ? "VIDEO" : isSidecar ? "SIDECAR" : "IMAGE",
      caption: caption.slice(0, 500),
      likes: (node.edge_liked_by as { count: number })?.count ?? 0,
      comments: (node.edge_media_to_comment as { count: number })?.count ?? 0,
      views: (node.video_view_count as number) ?? null,
      visual_description: (node.accessibility_caption as string) ?? null,
      timestamp: (node.taken_at_timestamp as number) ?? 0,
    };
  });
}

// ── Public export ──────────────────────────────────────────────────────────

export async function fetchInstagramData(
  username: string
): Promise<{ profile: InstagramProfile; posts: InstagramPost[] }> {
  // Try internal API up to 3 times with backoff
  let user: Record<string, unknown> | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(attempt * 1500);
    try {
      user = await tryInternalAPI(username);
      if (user) break;
    } catch (e) {
      if (e instanceof InstagramAPIError) throw e;
    }
  }

  // Fallback: scrape profile HTML
  if (!user) {
    await sleep(500);
    user = await tryProfileScrape(username);
  }

  if (!user) {
    throw new InstagramAPIError(
      "INSTAGRAM_BLOCKED",
      "Instagram is temporarily blocking analysis requests — please try again in 1 minute",
      429
    );
  }

  if (user.is_private) {
    return { profile: mapProfile(user, username), posts: [] };
  }

  return {
    profile: mapProfile(user, username),
    posts: mapPosts(user),
  };
}
