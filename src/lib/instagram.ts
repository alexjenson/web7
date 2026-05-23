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

const IG_APP_ID = "936619743392459";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Referer: "https://www.instagram.com/",
  Origin: "https://www.instagram.com",
  "x-ig-app-id": IG_APP_ID,
  "x-requested-with": "XMLHttpRequest",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
};

function mapType(node: Record<string, unknown>): "IMAGE" | "VIDEO" | "SIDECAR" {
  const t = node.__typename as string;
  if (t === "GraphVideo" || node.is_video) return "VIDEO";
  if (t === "GraphSidecar" || node.media_type === 8) return "SIDECAR";
  return "IMAGE";
}

export async function fetchInstagramData(
  username: string
): Promise<{ profile: InstagramProfile; posts: InstagramPost[] }> {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: BROWSER_HEADERS,
      cache: "no-store",
    });
  } catch {
    throw new InstagramAPIError(
      "INSTAGRAM_API_ERROR",
      "Could not reach Instagram — check your connection",
      503
    );
  }

  if (res.status === 404) {
    throw new InstagramAPIError("USER_NOT_FOUND", "User not found", 404);
  }
  if (res.status === 401 || res.status === 403) {
    throw new InstagramAPIError(
      "INSTAGRAM_BLOCKED",
      "Instagram is blocking this request — try again in a moment",
      403
    );
  }
  if (res.status === 429) {
    throw new InstagramAPIError("RATE_LIMITED", "Too many requests", 429);
  }
  if (!res.ok) {
    throw new InstagramAPIError("INSTAGRAM_API_ERROR", "Instagram API error", res.status);
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    throw new InstagramAPIError("INSTAGRAM_API_ERROR", "Invalid response from Instagram", 502);
  }

  const user = (data as { data?: { user?: Record<string, unknown> } })?.data?.user;
  if (!user || !user.username) {
    throw new InstagramAPIError("USER_NOT_FOUND", "User not found", 404);
  }

  if (user.is_private) {
    const profile: InstagramProfile = {
      username: user.username as string,
      full_name: (user.full_name as string) ?? "",
      biography: (user.biography as string) ?? "",
      profile_pic_url: (user.profile_pic_url_hd as string) ?? (user.profile_pic_url as string) ?? "",
      follower_count: (user.edge_followed_by as { count: number })?.count ?? 0,
      following_count: (user.edge_follow as { count: number })?.count ?? 0,
      media_count: (user.media_count as number) ?? 0,
      is_private: true,
      is_verified: (user.is_verified as boolean) ?? false,
      category_name: (user.category_name as string) ?? null,
      external_url: (user.external_url as string) ?? null,
    };
    return { profile, posts: [] };
  }

  const profile: InstagramProfile = {
    username: user.username as string,
    full_name: (user.full_name as string) ?? "",
    biography: (user.biography as string) ?? "",
    profile_pic_url: (user.profile_pic_url_hd as string) ?? (user.profile_pic_url as string) ?? "",
    follower_count: (user.edge_followed_by as { count: number })?.count ?? 0,
    following_count: (user.edge_follow as { count: number })?.count ?? 0,
    media_count: (user.media_count as number) ?? 0,
    is_private: false,
    is_verified: (user.is_verified as boolean) ?? false,
    category_name: (user.category_name as string) ?? null,
    external_url: (user.external_url as string) ?? null,
  };

  const edges = (
    user.edge_owner_to_timeline_media as {
      edges: { node: Record<string, unknown> }[];
    }
  )?.edges ?? [];

  const posts: InstagramPost[] = edges.slice(0, 12).map((edge) => {
    const node = edge.node;
    const captionText =
      (node.edge_media_to_caption as { edges: { node: { text: string } }[] })
        ?.edges?.[0]?.node?.text ?? "";
    return {
      type: mapType(node),
      caption: captionText.slice(0, 500),
      likes: (node.edge_liked_by as { count: number })?.count ?? 0,
      comments: (node.edge_media_to_comment as { count: number })?.count ?? 0,
      views: (node.video_view_count as number) ?? null,
      visual_description: (node.accessibility_caption as string) ?? null,
      timestamp: (node.taken_at_timestamp as number) ?? 0,
    };
  });

  return { profile, posts };
}
