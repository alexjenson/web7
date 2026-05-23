import Anthropic from "@anthropic-ai/sdk";
import { InstagramProfile, InstagramPost, AnalysisResult } from "./types";

export class ClaudeAnalysisError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "ClaudeAnalysisError";
    this.code = code;
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert Instagram content strategist and social media analyst.
You will receive structured data about an Instagram account and return a precise JSON analysis.
Be concise, data-driven, and actionable.
Always respond with valid JSON only — no markdown code fences, no prose outside JSON.`;

function formatPost(post: InstagramPost, index: number): string {
  const type = post.type === "VIDEO" ? "Reel/Video" : post.type === "SIDECAR" ? "Carousel" : "Photo";
  const views = post.views ? ` | Views: ${post.views.toLocaleString()}` : "";
  const visual = post.visual_description ? ` | Visual: "${post.visual_description.slice(0, 100)}"` : "";
  const caption = post.caption ? ` | Caption: "${post.caption.slice(0, 200)}"` : " | Caption: (none)";
  return `[${index + 1}] Type: ${type}${caption} | Likes: ${post.likes.toLocaleString()} | Comments: ${post.comments.toLocaleString()}${views}${visual}`;
}

export function buildPrompt(profile: InstagramProfile, posts: InstagramPost[]): string {
  const postsBlock = posts.length > 0
    ? posts.map(formatPost).join("\n")
    : "(no posts available)";

  return `Analyze this Instagram account and return a JSON object with EXACTLY this shape (no extra fields):

{
  "niche": {
    "primary": string,
    "secondary": string or null,
    "confidence": "high" or "medium" or "low",
    "reasoning": string (1-2 sentences)
  },
  "contentStyle": {
    "formats": array of strings (e.g. ["Reels", "Carousels", "Static Photos"]),
    "dominantFormat": string,
    "tone": string (e.g. "Educational & Inspirational"),
    "postingPattern": string (e.g. "3-4x per week, heavy Reels"),
    "visualStyle": string (e.g. "Clean white aesthetic, minimal text overlay")
  },
  "language": {
    "primary": string,
    "secondary": string or null,
    "region": string (e.g. "US/Canada", "India", "Brazil"),
    "audienceNote": string (1 sentence)
  },
  "trendingTopics": [
    {
      "title": string,
      "format": "Reel" or "Carousel" or "Static",
      "hook": string (opening line for the content),
      "rationale": string (why this fits their account and what is trending)
    }
  ]
}

The trendingTopics array must have EXACTLY 10 items.

ACCOUNT DATA:
Username: ${profile.username}
Full Name: ${profile.full_name}
Bio: ${profile.biography || "(no bio)"}
Instagram Category: ${profile.category_name || "(none)"}
Followers: ${profile.follower_count.toLocaleString()}
Following: ${profile.following_count.toLocaleString()}
Total Posts: ${profile.media_count}
Verified: ${profile.is_verified ? "Yes" : "No"}

RECENT ${posts.length} POSTS (newest first):
${postsBlock}

Instructions:
- Detect niche from bio, category, caption themes, and hashtags in captions.
- Detect language from the caption text — report the language captions are PRIMARILY written in.
- Detect content style from post type distribution, engagement patterns, and visual descriptions.
- For trending topics: tailor specifically to this creator's voice and niche. Each topic must be immediately actionable and feel native to their existing style.`;
}

function parseJSON(text: string): AnalysisResult {
  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

export async function analyzeWithClaude(
  profile: InstagramProfile,
  posts: InstagramPost[]
): Promise<AnalysisResult> {
  const userPrompt = buildPrompt(profile, posts);

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userPrompt },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages,
  });

  const rawText = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    return parseJSON(rawText);
  } catch {
    // Retry once with a correction follow-up
    const retryMessages: Anthropic.Messages.MessageParam[] = [
      ...messages,
      { role: "assistant", content: rawText },
      {
        role: "user",
        content:
          "Your response was not valid JSON. Return ONLY the JSON object — no markdown, no explanation, no code fences.",
      },
    ];

    const retryResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: retryMessages,
    });

    const retryText =
      retryResponse.content[0].type === "text" ? retryResponse.content[0].text : "";

    try {
      return parseJSON(retryText);
    } catch {
      throw new ClaudeAnalysisError("AI_PARSE_ERROR", "Failed to parse AI response");
    }
  }
}
