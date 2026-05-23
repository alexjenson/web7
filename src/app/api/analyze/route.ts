import { NextResponse } from "next/server";
import { parseUsername } from "@/lib/parseUsername";
import { analyzeFromInput } from "@/lib/analyzer";
import { UserInput } from "@/lib/types";

export const runtime = "nodejs";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  let body: Partial<UserInput>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_INPUT", "Invalid request body", 400);
  }

  const username = parseUsername(body.username ?? "");
  if (!username) {
    return errorResponse("INVALID_INPUT", "Enter a valid Instagram username or URL", 400);
  }
  if (!body.niche) {
    return errorResponse("INVALID_INPUT", "Please select your content niche", 400);
  }
  if (!body.format) {
    return errorResponse("INVALID_INPUT", "Please select your main content format", 400);
  }
  if (!body.language) {
    return errorResponse("INVALID_INPUT", "Please select your content language", 400);
  }

  const analysis = analyzeFromInput({
    username,
    niche: body.niche,
    format: body.format,
    language: body.language,
  });

  return NextResponse.json({ username, analysis });
}
