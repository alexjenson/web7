import { TrendingTopic } from "./types";

export type ScriptLength = "short" | "medium" | "long";

export interface ScriptMeta {
  text: string;
  characters: number;
  estimatedTime: string;
}

const WPM = 150;

function wordsToTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const seconds = Math.round((words / WPM) * 60);
  if (seconds < 60) return `~${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `~${m}m ${s}s` : `~${m} min`;
}

function nicheTag(niche: string) {
  return niche.replace(/[^a-zA-Z]/g, "");
}

// ─── Reel ─────────────────────────────────────────────────────────────────────

function reelShort(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0 – 3 sec)
"${t.hook}"

🎙️ BODY  (3 – 27 sec)
"Most people in ${niche} skip this completely — and it's costing them results.

I'm not going to sugarcoat it. Once I understood this, my content changed. My growth changed. Everything changed.

Here's the short version of what actually matters."

📣 CALL TO ACTION  (last 3 sec)
"Save this and follow for more ${niche} content every week."

📝 CAPTION
${t.hook}

${t.title} — here's my honest take.

Drop a 🔥 if this helped!

#${nicheTag(niche)} #trending #${nicheTag(niche)}creator`;
}

function reelMedium(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0 – 3 sec)
"${t.hook}"

🎙️ BODY  (3 – 55 sec)
"I want to talk about something that took me way too long to figure out in ${niche}.

${t.title} — sounds simple, right? But here's what almost nobody tells you.

First: the creators who are actually growing right now are not doing more. They're doing less, better. They picked one specific thing and went all in.

Second: your audience does not care about perfection. They care about honesty. The most vulnerable, unpolished version of your content will almost always outperform the overproduced version.

Third — and this is the one I want you to really sit with — the gap between where you are and where you want to be is not a talent gap. It's a consistency gap.

That's it. That's the whole thing."

📣 CALL TO ACTION  (last 5 sec)
"Save this so you can come back to it. And follow — I post ${niche} content every single week."

📝 CAPTION
${t.hook}

Here's what I wish someone told me earlier about ${niche}:

The strategy is simple. The execution is where most people quit.

Save this 📌 — you'll want it later.

#${nicheTag(niche)} #trending #${nicheTag(niche)}tips #contentcreator`;
}

function reelLong(t: TrendingTopic, niche: string): string {
  return `🎬 HOOK  (0 – 3 sec)
"${t.hook}"

🎙️ INTRO  (3 – 10 sec)
"I've been in ${niche} long enough to know what actually works — and today I'm breaking down everything on: ${t.title}."

🎙️ BODY  (10 – 80 sec)
"Let's get into it.

Point one: most people start by asking 'what should I post?' That's the wrong question. The right question is 'who am I posting for?' Once you know that specific person — their fears, their goals, what keeps them up at night — everything becomes easier.

Point two: the algorithm is not your enemy. The algorithm rewards content that people actually watch, save, and share. Which means if you focus on genuinely helping your audience in ${niche}, the algorithm will work for you — not against you.

Point three: you will not figure this out from the outside looking in. You have to post. You have to fail publicly. The creators you admire have a hundred posts you've never seen — the ones that didn't work. That's how they got good.

Point four: stop optimizing for likes. Likes are validation. Saves are trust. Shares are endorsements. Optimize for saves and shares and your account will grow faster than any hack or trend could ever do.

Point five: ${t.title} is not a one-time thing. It's a direction. Stay consistent in that direction for longer than feels comfortable — and then stay a little longer. That's where the growth happens.

The bottom line: this works. But only if you do."

🎙️ CLOSE  (80 – 87 sec)
"That's my full breakdown of ${t.title}. I hope something in there hit different for you."

📣 CALL TO ACTION  (last 3 sec)
"Save this. Follow. I'll see you in the next one."

📝 CAPTION
${t.hook}

${t.title} — I went deep on this one so you don't have to.

The part that surprised me most? Point four. Go back and read it.

Save this post before you scroll 📌
Share it with a ${niche} creator who needs it 🔁

#${nicheTag(niche)} #trending #${nicheTag(niche)}tips #contentcreator #growthmindset`;
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

function carouselShort(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — The Problem
Most ${niche} creators are focused on the wrong things.
They're optimizing for likes when they should be optimizing for trust.

📑 SLIDE 3 — The Insight
${t.title}.
This single focus area separates creators who plateau from creators who grow.

📑 SLIDE 4 — What to Do
Show up consistently in ${niche}.
Be specific, not broad.
Serve one person so well that they share you with everyone they know.

📑 SLIDE 5 — CTA
Save this carousel.
Follow for more ${niche} tips every week.

📝 CAPTION
${t.hook}

Swipe for the full breakdown 👉
Save this — you'll come back to it.

#${nicheTag(niche)} #trending #${nicheTag(niche)}tips`;
}

function carouselMedium(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — Why This Matters
${t.title} is one of the most underrated topics in ${niche} right now.
Most creators either ignore it or get it completely wrong.
Here's what you actually need to know.

📑 SLIDE 3 — The Mistake Everyone Makes
Trying to reach everyone.
Posting for the algorithm instead of for a person.
Waiting until things are perfect before hitting publish.
All three of these kill growth — faster than any bad post ever could.

📑 SLIDE 4 — The Real Strategy
Pick one person. Speak to them specifically.
Give them something they can use today — not theory, not inspiration — something actionable.
Do that consistently and your ${niche} account will grow on its own.

📑 SLIDE 5 — The Mindset Shift
You are not competing with every creator in ${niche}.
You are finding the people who are waiting for exactly what you have to say.
Those people exist. Your job is to keep showing up until they find you.

📑 SLIDE 6 — The Compound Effect
One post rarely goes viral. But 50 consistent, specific, honest posts?
That's a reputation. That's authority. That's a community.
That's what you're actually building.

📑 SLIDE 7 — The Bottom Line
${t.title}.
Stop thinking about it. Start executing it.
Progress over perfection — always.

📑 SLIDE 8 — CTA
Save this carousel before you scroll.
Follow for more ${niche} content every week.

📝 CAPTION
${t.hook}

Swipe all the way through — slide 5 is the one most people skip 👉

Save this ✅ Share with a ${niche} creator who needs it 🔁

#${nicheTag(niche)} #trending #${nicheTag(niche)}creator`;
}

function carouselLong(t: TrendingTopic, niche: string): string {
  return `📑 SLIDE 1 — Hook
"${t.hook}"

📑 SLIDE 2 — Let's Be Honest
${t.title} — this is a topic that gets talked about a lot in ${niche}.
But most of the advice out there is either too vague or too advanced.
This breakdown is different. Let's get into it.

📑 SLIDE 3 — Mistake #1
Starting with the wrong question.
"What should I post?" is not the right place to begin.
"Who am I posting for?" is. Everything else follows from there.

📑 SLIDE 4 — Mistake #2
Confusing activity with progress.
Posting five times a week with no strategy is not a plan. It's noise.
Fewer, better posts beat more mediocre ones every single time.

📑 SLIDE 5 — The Foundation
Know your one person. Know their problem. Know what success looks like for them.
Every piece of ${niche} content you create should serve that one person so well that they feel like you made it just for them.

📑 SLIDE 6 — The Strategy That Works
Show up consistently in one format.
Master it before adding another.
Let your audience tell you what they want more of — then give it to them better than anyone else.

📑 SLIDE 7 — The Counterintuitive Truth
Vulnerability outperforms polish.
Your story of struggling is more powerful than your story of succeeding.
The creators growing fastest in ${niche} right now are the ones being the most honest.

📑 SLIDE 8 — The Long Game
The creators who win in ${niche} are not the most talented.
They're the most patient. They outlast everyone who gives up between months three and six.
If you're still here at month twelve, you're already ahead of 90% of people who started with you.

📑 SLIDE 9 — Advanced Move
Once something is working — do not change it because you're bored.
Your audience is not bored. They followed you for that. Keep delivering it.
Boredom is a creator problem, not an audience problem.

📑 SLIDE 10 — Summary
${t.title}.
One format. One person. One consistent message. That's the whole strategy.
Execute it for six months straight and the results will speak for themselves.

📑 SLIDE 11 — CTA
Save this deep-dive before you scroll.
Share it with a ${niche} creator who needs it.
Follow for breakdowns like this every week.

📝 CAPTION
${t.hook}

This is the most detailed breakdown I've done on ${niche} growth strategy.
Swipe all the way through — slide 7 is the one that changed everything for me.

Save this 📌 Share it 🔁 Follow for more ✅

#${nicheTag(niche)} #trending #${nicheTag(niche)}creator #deepdive #contentcreator`;
}

// ─── Static Photo ─────────────────────────────────────────────────────────────

function staticShort(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

${t.title} — and once I understood this, everything about my ${niche} content changed.

Save this if it helped 💾
Follow for more ${niche} tips ✅

#${nicheTag(niche)} #trending`;
}

function staticMedium(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

${t.title}.

Here's what that looks like in practice: you stop creating content for the algorithm and start creating it for one specific person. That shift is everything. Your message gets clearer, your audience becomes more loyal, and the algorithm rewards you for it — not the other way around.

The best ${niche} creators I know are not the most talented. They're the most consistent and the most honest. That's the real edge.

Save this if it resonated 💾
Follow for more ${niche} content every week ✅

#${nicheTag(niche)} #trending #${nicheTag(niche)}creator`;
}

function staticLong(t: TrendingTopic, niche: string): string {
  return `📸 CAPTION
${t.hook}

${t.title}.

Let me be direct about what I've learned after doing this in ${niche} for a while.

The creators who are building something real are not the ones with the best equipment or the most time. They're the ones who show up when it would be easier not to. They post when no one is watching. They refine their message when no one is asking them to.

Here's the thing nobody tells you at the start: the early posts are supposed to be imperfect. They're how you learn what your audience actually cares about. Every post that didn't land is data. Every comment — good or bad — is your audience telling you something worth listening to.

${t.title} — that's the thread running through all of it. It's not a tactic. It's a direction.

If you're reading this and you're somewhere in the middle — not where you started but not where you want to be — I want you to know: that middle is where everyone quits. Don't quit there. The people who make it are the ones who kept going when the results weren't there yet.

Save this post 💾
Share it with a ${niche} creator who needs to hear it 🔁
Follow for weekly content that actually helps ✅

.
.
.
#${nicheTag(niche)} #trending #${nicheTag(niche)}creator #contentcreator #growthmindset`;
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

  return {
    text,
    characters: text.length,
    estimatedTime: wordsToTime(text),
  };
}
