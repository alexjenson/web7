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

const BASE_URL = "https://instagram-scraper-api2.p.rapidapi.com/v1";

function getHeaders() {
  return {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
    "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
  };
}

export async function fetchProfile(username: string): Promise<InstagramProfile> {
  const res = await fetch(
    `${BASE_URL}/info?username_or_id_or_url=${encodeURIComponent(username)}`,
    { headers: getHeaders(), cache: "no-store" }
  );

  if (res.status === 404) {
    throw new InstagramAPIError("USER_NOT_FOUND", "User not found", 404);
  }
  if (res.status === 429) {
    throw new InstagramAPIError("RATE_LIMITED", "Rate limited", 429);
  }
  if (!res.ok) {
    throw new InstagramAPIError("INSTAGRAM_API_ERROR", "Instagram API error", res.status);
  }

  const data = await res.json();
  const user = data?.data?.user ?? data?.user ?? data;

  if (!user || !user.username) {
    throw new InstagramAPIError("USER_NOT_FOUND", "User not found", 404);
  }

  return {
    username: user.username ?? username,
    full_name: user.full_name ?? "",
    biography: user.biography ?? "",
    profile_pic_url: user.profile_pic_url_hd ?? user.profile_pic_url ?? "",
    follower_count: user.follower_count ?? user.edge_followed_by?.count ?? 0,
    following_count: user.following_count ?? user.edge_follow?.count ?? 0,
    media_count: user.media_count ?? 0,
    is_private: user.is_private ?? false,
    is_verified: user.is_verified ?? false,
    category_name: user.category_name ?? null,
    external_url: user.external_url ?? null,
  };
}

function mapPostType(node: Record<string, unknown>): "IMAGE" | "VIDEO" | "SIDECAR" {
  if (node.is_video || node.__typename === "GraphVideo") return "VIDEO";
  if (node.__typename === "GraphSidecar" || node.media_type === 8) return "SIDECAR";
  return "IMAGE";
}

export async function fetchPosts(username: string): Promise<InstagramPost[]> {
  const res = await fetch(
    `${BASE_URL}/posts?username_or_id_or_url=${encodeURIComponent(username)}`,
    { headers: getHeaders(), cache: "no-store" }
  );

  if (res.status === 429) {
    throw new InstagramAPIError("RATE_LIMITED", "Rate limited", 429);
  }
  if (!res.ok) {
    throw new InstagramAPIError("INSTAGRAM_API_ERROR", "Instagram API error", res.status);
  }

  const data = await res.json();

  // Handle different response shapes from the API
  let items: Record<string, unknown>[] = [];
  if (Array.isArray(data?.data?.items)) {
    items = data.data.items;
  } else if (Array.isArray(data?.items)) {
    items = data.items;
  } else if (data?.data?.user?.edge_owner_to_timeline_media?.edges) {
    items = data.data.user.edge_owner_to_timeline_media.edges.map(
      (e: { node: Record<string, unknown> }) => e.node
    );
  }

  return items.slice(0, 12).map((item): InstagramPost => {
    const node = (item.node as Record<string, unknown>) ?? item;
    const caption =
      (node.caption as string) ??
      ((node.edge_media_to_caption as { edges: { node: { text: string } }[] })
        ?.edges?.[0]?.node?.text ?? "");

    return {
      type: mapPostType(node),
      caption: (typeof caption === "string" ? caption : "").slice(0, 500),
      likes:
        (node.like_count as number) ??
        ((node.edge_liked_by as { count: number })?.count ?? 0),
      comments:
        (node.comment_count as number) ??
        ((node.edge_media_to_comment as { count: number })?.count ?? 0),
      views: (node.view_count as number) ?? (node.video_view_count as number) ?? null,
      visual_description: (node.accessibility_caption as string) ?? null,
      timestamp: (node.taken_at as number) ?? (node.taken_at_timestamp as number) ?? 0,
    };
  });
}
