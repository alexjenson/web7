import { TrendingTopic } from "./types";

export type ScriptLength = "short" | "medium" | "long";

export interface ScriptMeta {
  text: string;
  characters: number;
  estimatedTime: string;
}

// Average spoken words per minute
const WPM = 150;

function wordsToTime(wordCount: number): string {
  const seconds = Math.round((wordCount / WPM) * 60);
  if (seconds < 60) return `~${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `~${m}m ${s}s` : `~${m} min`;
}

function tag(niche: string) {
  return niche.replace(/[^a-zA-Z]/g, "");
}

// ─── Reel scripts ─────────────────────────────────────────────────────────────

function reelShort(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0–3 sec)
"${t.hook}"

🎙️ BODY  (3–27 sec)
• [Your key insight about: ${t.title}]
• [One surprising fact or tip your audience doesn't know]

📣 CTA  (last 3 sec)
"Follow for more ${niche} tips!"

📝 CAPTION
${t.hook}

Drop a 🔥 if this helped!

#${tag(niche)} #[your niche hashtags]`;
}

function reelMedium(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0–3 sec)
"${t.hook}"

🎙️ BODY  (3–55 sec)
• Open: Share a quick personal story tied to "${t.title}"
• Point 1: [Your first insight — be specific, not generic]
• Point 2: [A common mistake people make in ${niche}]
• Point 3: [The fix — exactly what to do instead]
• Close: One memorable one-liner that sticks

📣 CTA  (last 5 sec)
"Save this! And follow for more ${niche} content every week."

📝 CAPTION
${t.hook}

Here's what changed everything for me: [your insight]

Save this so you don't lose it 📌
Drop a comment if you've experienced this too 👇

#${tag(niche)} #trending #[your niche hashtags]`;
}

function reelLong(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0–3 sec)
"${t.hook}"

🎙️ INTRO  (3–10 sec)
Briefly say who you are and why you know this topic.
Keep it to one sentence — don't lose them here.

🎙️ BODY  (10–80 sec)
• Point 1: Set up the problem — what most people get wrong about ${t.title}
• Point 2: [Your first real insight — add a specific number or example]
• Point 3: [The turning point — what changed your understanding]
• Point 4: [The practical action — exactly what to do step by step]
• Point 5: [The result — what changes when you apply this]

🎙️ CLOSE  (80–87 sec)
"The bottom line on ${t.title}: [one powerful sentence]"

📣 CTA  (last 3 sec)
"Save this and follow — I post ${niche} content every week."

📝 CAPTION
${t.hook}

I spent [time] figuring this out so you don't have to.

Here's the short version: [your core insight]

The part nobody talks about: [your surprising angle]

Save this + follow for weekly ${niche} content 👇

. . .
#${tag(niche)} #trending #[your niche hashtags] #[location or audience tag]`;
}

// ─── Carousel scripts ──────────────────────────────────────────────────────────

function carouselShort(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — The Problem
Why does ${t.title} matter? One sentence.

📑 SLIDES 3–5 — The Value  (one point each)
• Slide 3: [Key insight #1]
• Slide 4: [Key insight #2]
• Slide 5: [Key insight #3]

📑 LAST SLIDE — CTA
"Save this! Follow for more ${niche} tips."

📝 CAPTION
${t.hook}
Swipe for the full breakdown 👉

#${tag(niche)} #[your niche hashtags]`;
}

function carouselMedium(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — The Problem / Context
Explain why ${t.title} matters.
Keep to under 20 words. One idea only.

📑 SLIDES 3–7 — The Value  (one point per slide)
• Slide 3: [Your first key insight]
• Slide 4: [Common mistake — and the fix]
• Slide 5: [Specific example or stat that proves the point]
• Slide 6: [Practical tip your audience can act on today]
• Slide 7: [The surprising or counterintuitive angle]

📑 SLIDE 8 — Summary
One sentence that captures the entire lesson.

📑 LAST SLIDE — CTA
"Save this carousel before you scroll!
Follow for more ${niche} tips every week."

📝 CAPTION
${t.hook}

Swipe through for the full breakdown 👉

Save this — you'll come back to it. ✅

#${tag(niche)} #trending #[your niche hashtags]`;
}

function carouselLong(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — Why This Matters
The core problem with ${t.title} that nobody talks about.
One idea. Short text. High contrast design.

📑 SLIDE 3 — The Setup
What most people believe (and why it's wrong).

📑 SLIDES 4–9 — Deep Dive  (one insight per slide)
• Slide 4: [The #1 thing you need to understand]
• Slide 5: [Real example — be specific, use numbers if possible]
• Slide 6: [The counterintuitive angle — something they won't expect]
• Slide 7: [Step-by-step action they can take today]
• Slide 8: [Common pitfall to avoid]
• Slide 9: [The result when done right — paint the picture]

📑 SLIDE 10 — Summary
"Here's what we covered:" — bullet list recap, 4–5 points max.

📑 LAST SLIDE — CTA
"Save this for later 📌
Share with someone who needs this.
Follow for more ${niche} deep-dives every week."

📝 CAPTION
${t.hook}

I've been in ${niche} long enough to know this is misunderstood.

Swipe through — this one's worth the full read.

The key insight most people miss: [your angle]

Save + follow for more breakdowns like this 👇

. . .
#${tag(niche)} #trending #[your niche hashtags] #deepdive`;
}

// ─── Static / Photo captions ───────────────────────────────────────────────────

function staticShort(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

[Your 1–2 sentence insight about: ${t.title}]

Save this 💾  |  Follow for more ${niche} tips

#${tag(niche)} #[your niche hashtags]`;
}

function staticMedium(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

[Write 3–4 sentences expanding on: ${t.title}]
[Add your personal perspective or a specific example]
[Close with one actionable tip your audience can use today]

Save this post if it resonated 💾
Drop a comment — I'd love to hear your take 👇

#${tag(niche)} #trending #[your niche hashtags]`;
}

function staticLong(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

[Paragraph 1: Open with a personal story or relatable moment tied to ${t.title}]

[Paragraph 2: Share the core insight — what you've learned, what changed, what most people miss]

[Paragraph 3: Give the practical takeaway — specific, actionable, not generic]

[Closing line: Something memorable that will stick with the reader]

—

Save this post so you can come back to it 💾
Share it with someone who needs to see this 🔁
New here? Follow for more ${niche} content every week ✅

. . .
#${tag(niche)} #trending #[your niche hashtags] #[location or audience tag]`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateScript(
  topic: TrendingTopic,
  niche: string,
  length: ScriptLength
): ScriptMeta {
  let text: string;

  if (topic.format === "Reel") {
    text = length === "short" ? reelShort(topic, niche)
         : length === "long"  ? reelLong(topic, niche)
         : reelMedium(topic, niche);
  } else if (topic.format === "Carousel") {
    text = length === "short" ? carouselShort(topic, niche)
         : length === "long"  ? carouselLong(topic, niche)
         : carouselMedium(topic, niche);
  } else {
    text = length === "short" ? staticShort(topic, niche)
         : length === "long"  ? staticLong(topic, niche)
         : staticMedium(topic, niche);
  }

  const wordCount = text.trim().split(/\s+/).length;
  return {
    text,
    characters: text.length,
    estimatedTime: wordsToTime(wordCount),
  };
}
