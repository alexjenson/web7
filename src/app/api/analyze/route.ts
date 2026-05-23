import { NextResponse } from "next/server";
import { parseUsername } from "@/lib/parseUsername";
import { fetchInstagramData, InstagramAPIError } from "@/lib/instagram";
import { analyze } from "@/lib/analyzer";

export const runtime = "nodejs";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  let body: { username?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_INPUT", "Invalid request body", 400);
  }

  const username = parseUsername(body.username ?? "");
  if (!username) {
    return errorResponse("INVALID_INPUT", "Enter a valid Instagram URL or username", 400);
  }

  try {
    const { profile, posts } = await fetchInstagramData(username);

    if (profile.is_private) {
      return errorResponse(
        "PRIVATE_ACCOUNT",
        "This account is private — we can only analyze public profiles",
        403
      );
    }

    // Still analyze with just profile bio/category if no posts were scraped
    if (posts.length === 0 && !profile.biography && !profile.category_name) {
      return errorResponse(
        "NO_POSTS",
        "This account has no public posts or bio to analyze",
        422
      );
    }

    const analysis = analyze(profile, posts);
    return NextResponse.json({ profile, analysis });
  } catch (err) {
    if (err instanceof InstagramAPIError) {
      const statusMap: Record<string, number> = {
        USER_NOT_FOUND: 404,
        PRIVATE_ACCOUNT: 403,
        RATE_LIMITED: 429,
        INSTAGRAM_BLOCKED: 403,
        INSTAGRAM_API_ERROR: 502,
      };
      const messageMap: Record<string, string> = {
        USER_NOT_FOUND: "That Instagram account doesn't seem to exist",
        PRIVATE_ACCOUNT: "This account is private — we can only analyze public profiles",
        RATE_LIMITED: "Too many requests — please try again in 30 seconds",
        INSTAGRAM_BLOCKED: "Instagram is temporarily blocking this request — please try again in a moment",
        INSTAGRAM_API_ERROR: "Couldn't reach Instagram right now — please try again",
      };
      return errorResponse(
        err.code,
        messageMap[err.code] ?? err.message,
        statusMap[err.code] ?? 502
      );
    }

    console.error("Unexpected error:", err);
    return errorResponse("SERVER_ERROR", "An unexpected error occurred", 500);
  }
}
