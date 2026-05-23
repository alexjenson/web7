import { UserInput, AnalysisResult, TrendingTopic } from "./types";

// (old detection functions removed — analysis now based on user input)


// ─── Trending Topics Database ──────────────────────────────────────────────

const TRENDING_TOPICS: Record<string, TrendingTopic[]> = {
  "Fitness & Wellness": [
    { title: "I tried the 75 Hard challenge for 30 days — here's what actually happened", format: "Reel", hook: "Day 1 I couldn't do 10 push-ups. Day 30? Watch this.", rationale: "75 Hard content consistently goes viral with transformation stories." },
    { title: "5 gym mistakes beginners make (that trainers never tell you)", format: "Carousel", hook: "You're wasting half your workout without knowing it.", rationale: "Mistake-focused educational content drives saves and shares." },
    { title: "Morning routine that changed my body in 60 days", format: "Reel", hook: "No 5am wake-ups. No ice baths. Just this.", rationale: "Morning routine content is evergreen and high-engagement." },
    { title: "Why you're NOT losing weight (and it's not what you think)", format: "Carousel", hook: "Eating at a deficit and still not losing? Read this.", rationale: "Nutrition myth-busting drives strong engagement and saves." },
    { title: "Full body workout you can do in 15 minutes at home", format: "Reel", hook: "No equipment. No excuses. Let's go.", rationale: "Home workout content has sustained high demand post-pandemic." },
    { title: "What I eat in a day as a [niche athlete/trainer]", format: "Reel", hook: "Protein, carbs, and no restricting — here's my actual diet.", rationale: "'What I eat in a day' is one of the most searched formats on Instagram." },
    { title: "Protein myths fitness influencers keep spreading", format: "Carousel", hook: "You don't need 1g per pound of bodyweight. Here's why.", rationale: "Myth-busting builds authority and drives debate in comments." },
    { title: "The underrated exercise nobody talks about", format: "Reel", hook: "This one move fixed my posture and boosted my lifts.", rationale: "Contrarian fitness content consistently outperforms standard tutorials." },
    { title: "Rest day routine that actually speeds up recovery", format: "Carousel", hook: "Rest days aren't for Netflix. They're for this.", rationale: "Recovery content is trending as wellness audiences grow." },
    { title: "Signs you're overtraining and how to fix it", format: "Carousel", hook: "Tired all the time? Can't sleep? Your body is screaming at you.", rationale: "Overtraining awareness is a high-save, high-share topic." },
  ],
  "Food & Cooking": [
    { title: "5-ingredient meals that taste like they took hours", format: "Reel", hook: "Dinner in 15 minutes that your guests will beg you for.", rationale: "Quick, minimal-ingredient recipes dominate food content right now." },
    { title: "The recipe I make every single week (and why)", format: "Reel", hook: "I've made this 47 times. It's still my favorite.", rationale: "Personal attachment to recipes builds authentic connection." },
    { title: "High-protein meals under 500 calories (full week plan)", format: "Carousel", hook: "Stop eating plain chicken and rice. Try these instead.", rationale: "High-protein + low calorie meal content is extremely high-demand." },
    { title: "Grocery store ingredients, restaurant-quality results", format: "Reel", hook: "This $4 ingredient makes everything taste gourmet.", rationale: "Budget cooking with impressive results drives massive saves." },
    { title: "Foods I stopped eating after working in a restaurant kitchen", format: "Carousel", hook: "I know how these are made. That changed everything.", rationale: "Insider knowledge from industry pros drives curiosity and shares." },
    { title: "The one cooking technique that changed everything", format: "Reel", hook: "Every chef knows this. Most home cooks don't.", rationale: "Technique-focused content positions creator as an authority." },
    { title: "Meal prep for the whole week in under 2 hours", format: "Reel", hook: "Sunday prep = stress-free weekdays. Here's exactly how.", rationale: "Meal prep content consistently tops engagement charts." },
    { title: "Trending TikTok recipes tested: which ones actually work?", format: "Carousel", hook: "I tried 8 viral food hacks so you don't have to.", rationale: "Testing viral content creates engagement from multiple audiences." },
    { title: "What a professional chef eats for breakfast every day", format: "Reel", hook: "Not avocado toast. Not overnight oats. This.", rationale: "'What I eat' format with professional credibility performs exceptionally." },
    { title: "The ingredient swap that makes every dish healthier", format: "Carousel", hook: "Same taste. Half the calories. You're welcome.", rationale: "Healthy substitution content saves well and drives repeat visits." },
  ],
  "Travel": [
    { title: "Hidden gems in [destination] most tourists miss", format: "Reel", hook: "I asked a local where they actually go. This is what they said.", rationale: "Local insider content is the top-performing travel format in 2025." },
    { title: "How I traveled for 2 weeks on a $1,000 budget", format: "Carousel", hook: "Full breakdown. Flights, hotels, food — everything.", rationale: "Budget travel breakdowns drive enormous saves and shares." },
    { title: "The travel mistake that cost me $800 (so you don't repeat it)", format: "Reel", hook: "One booking decision. Eight hundred dollars gone.", rationale: "Personal travel mistakes drive strong empathetic engagement." },
    { title: "Best solo travel destinations for 2025", format: "Carousel", hook: "Safe, stunning, and surprisingly affordable. Here's my list.", rationale: "Solo travel content is one of the fastest-growing travel subtopics." },
    { title: "Packing list that fits a 2-week trip in a carry-on", format: "Carousel", hook: "No checked bags. No bag fees. No stress.", rationale: "Minimalist packing content is perennially high-save." },
    { title: "Why I stopped going to tourist traps (and what I do instead)", format: "Reel", hook: "The 'must-visit' list ruined my trip. Here's the alternative.", rationale: "Anti-tourist content resonates strongly with experienced travelers." },
    { title: "Countries that are absolutely worth it in 2025", format: "Carousel", hook: "The underrated destinations everyone will be talking about.", rationale: "Destination prediction content captures early-trend audiences." },
    { title: "How to find cheap flights — the strategies that actually work", format: "Carousel", hook: "Not Google Flights. Not Skyscanner. This.", rationale: "Flight hacking content saves extremely well." },
    { title: "What nobody tells you about [popular destination]", format: "Reel", hook: "I wish someone had warned me before I booked.", rationale: "Contrarian destination takes generate debate and massive reach." },
    { title: "My honest travel review: was it worth the hype?", format: "Reel", hook: "Everyone said it was paradise. Here's what I actually found.", rationale: "Honest reviews build trust and long-term audience loyalty." },
  ],
  "Fashion": [
    { title: "Outfits for every body type — real, wearable looks", format: "Reel", hook: "Fashion is for everyone. Let me show you how.", rationale: "Inclusive fashion content consistently outperforms niche styling." },
    { title: "How to build a capsule wardrobe from scratch in 2025", format: "Carousel", hook: "30 items. Endless outfits. No shopping panic.", rationale: "Capsule wardrobe content is evergreen and drives very high saves." },
    { title: "Thrift flip: $15 find to runway-worthy piece", format: "Reel", hook: "Thrift store reject to outfit of the week. Watch.", rationale: "Thrift flip Reels consistently go viral with transformation reveals." },
    { title: "The fashion rules I broke (and why you should too)", format: "Reel", hook: "Who decided you can't wear this? Not me.", rationale: "Rule-breaking content drives strong emotional engagement." },
    { title: "Trending vs. timeless: how to invest in your wardrobe", format: "Carousel", hook: "Stop buying trends. Start buying these.", rationale: "Investment dressing content resonates with conscious consumers." },
    { title: "Styling the same piece 7 different ways", format: "Reel", hook: "One blazer. Seven completely different looks.", rationale: "Versatility content drives saves from viewers wanting styling ideas." },
    { title: "What's actually trending in fashion right now (not what magazines say)", format: "Carousel", hook: "The real street style trends for 2025.", rationale: "Insider trend reporting builds authority and drives engagement." },
    { title: "Affordable dupes for designer pieces that look identical", format: "Carousel", hook: "Looks like $500. Costs $40. Here's where to find them.", rationale: "Dupe content is one of the highest-performing fashion formats." },
    { title: "I wore only monochrome outfits for a week — the results", format: "Reel", hook: "Everyone thought I was having a breakdown. I was onto something.", rationale: "Style challenge content drives curiosity-click and engagement." },
    { title: "Fashion mistakes that age you 10 years", format: "Carousel", hook: "It's not about being 'trendy'. It's about these specific things.", rationale: "Age-related styling tips are highly shareable across demographics." },
  ],
  "Beauty & Skincare": [
    { title: "My honest 90-day skincare transformation (no filters)", format: "Reel", hook: "This is my skin without any editing. Watch what changed.", rationale: "Authentic transformation content drives massive trust and engagement." },
    { title: "Skincare ingredients that actually work (backed by science)", format: "Carousel", hook: "Stop buying products with these buzzwords and start buying these.", rationale: "Science-backed beauty content is the dominant trend in skincare." },
    { title: "Drugstore dupes for high-end skincare that dermatologists recommend", format: "Carousel", hook: "Same active ingredient. A tenth of the price.", rationale: "Dupe + credibility combination drives enormous saves." },
    { title: "The makeup mistake making you look older", format: "Reel", hook: "I see this on everyone. It's one small thing.", rationale: "Mistake-correction beauty content triggers immediate stops in feeds." },
    { title: "5-minute makeup routine for busy mornings", format: "Reel", hook: "Full face in 5 minutes. I timed it. Watch.", rationale: "Quick makeup routines are perennially top-performing." },
    { title: "Skincare routine order that actually matters", format: "Carousel", hook: "You've been layering your products wrong. Here's the fix.", rationale: "Routine order content drives saves as a reference guide." },
    { title: "Ingredients you should NEVER mix in your skincare", format: "Carousel", hook: "This combination is burning your skin barrier. Stop now.", rationale: "Warning-format content drives shares from protective instincts." },
    { title: "Glass skin routine: exactly what I use and in what order", format: "Reel", hook: "The dewy skin trend is real. Here's how to achieve it.", rationale: "Glass skin remains one of the most searched beauty topics globally." },
    { title: "Clean beauty products worth the premium price", format: "Carousel", hook: "I've tested 50+ clean products. Only these made the cut.", rationale: "Curated recommendation content saves at extremely high rates." },
    { title: "Gua sha: separating fact from social media fiction", format: "Reel", hook: "Does it actually de-puff? I tested it for 30 days.", rationale: "Tool-testing content provides clear value and builds credibility." },
  ],
  "Tech & Gadgets": [
    { title: "AI tools that are replacing entire job categories (2025)", format: "Carousel", hook: "Not a prediction. This is already happening.", rationale: "AI impact content is the highest-engagement tech topic right now." },
    { title: "The gadget I use every single day that nobody talks about", format: "Reel", hook: "It's not a phone. Not a laptop. And I can't live without it.", rationale: "Underrated product reveals drive curiosity clicks and engagement." },
    { title: "Tech setup that 10x'd my productivity", format: "Reel", hook: "I went from 4 hours of deep work to 9. These tools did it.", rationale: "Productivity + tech content is a dominant high-save format." },
    { title: "Free alternatives to expensive software you're overpaying for", format: "Carousel", hook: "Adobe charges $600/year. These free tools do the same.", rationale: "Cost-saving tech content drives massive saves and shares." },
    { title: "Honest review: is the new [trending product] worth it?", format: "Reel", hook: "I spent $[X] and used it for 30 days. My verdict:", rationale: "Honest product reviews are the most trusted tech content format." },
    { title: "Privacy settings you need to change on your phone right now", format: "Carousel", hook: "Your phone is tracking more than you think. Fix this today.", rationale: "Privacy content drives urgency-based shares and saves." },
    { title: "Coding skills that will be irreplaceable in the AI era", format: "Carousel", hook: "AI won't replace coders who learn these things.", rationale: "Future-of-work tech content performs strongly with professional audiences." },
    { title: "My honest take on [viral tech product]: overhyped or not?", format: "Reel", hook: "Everyone's buying this. Here's the truth after 60 days.", rationale: "Verdict content on viral products drives massive engagement." },
    { title: "The smartest ways to use ChatGPT for real work", format: "Carousel", hook: "Not for writing essays. For actually saving 10 hours a week.", rationale: "Practical AI use case content is consistently top-performing." },
    { title: "Tech red flags: devices and apps you should delete now", format: "Carousel", hook: "If you have these apps on your phone, read this first.", rationale: "Warning + actionable content drives shares from protective behavior." },
  ],
  "Business & Entrepreneurship": [
    { title: "How I went from $0 to $10k/month (honest breakdown)", format: "Carousel", hook: "No course to sell. No fluff. Just what actually worked.", rationale: "Revenue milestone breakdowns are top-performing entrepreneurship content." },
    { title: "Business lessons that took me 3 years to learn", format: "Carousel", hook: "I paid for these with mistakes. You get them for free.", rationale: "Wisdom-sharing content builds deep trust and saves." },
    { title: "The biggest mistake new entrepreneurs make in year one", format: "Reel", hook: "I made it too. So does almost everyone. Here's how to avoid it.", rationale: "Mistake content resonates powerfully with early-stage audience." },
    { title: "Side hustles that are actually worth your time in 2025", format: "Carousel", hook: "Not dropshipping. Not Amazon FBA. These.", rationale: "Side hustle content with specificity drives strong engagement." },
    { title: "How to validate a business idea before spending a dollar", format: "Carousel", hook: "Most businesses fail because of this one skipped step.", rationale: "Validation frameworks are extremely high-save reference content." },
    { title: "What your business coach won't tell you about scaling", format: "Reel", hook: "Scaling too fast killed my first business. Here's what I learned.", rationale: "Counter-narrative coaching content drives strong debate and reach." },
    { title: "The real cost of running a $100k business", format: "Carousel", hook: "Revenue is not profit. Here's the honest breakdown.", rationale: "Financial transparency content is rare and drives massive engagement." },
    { title: "Sales scripts that converted 30% of my cold outreach", format: "Carousel", hook: "Copy these word for word. They work.", rationale: "Tactical, copyable content saves at extremely high rates." },
    { title: "How I built an audience of [X] without paid ads", format: "Reel", hook: "Organic growth is not dead. Here's my exact strategy.", rationale: "Organic growth strategy is the #1 question from new entrepreneurs." },
    { title: "Pricing your service: the framework that doubled my income", format: "Carousel", hook: "You're probably undercharging. Here's how to fix it.", rationale: "Pricing strategy content is evergreen and extremely high-save." },
  ],
  "Photography & Videography": [
    { title: "Camera settings I use for every type of shot", format: "Carousel", hook: "Stop using Auto. These settings changed everything.", rationale: "Settings guides are perennial top-savers in the photography community." },
    { title: "How to get cinematic footage with a phone camera", format: "Reel", hook: "Shot on iPhone 15. Looks like a $10k camera. Here's how.", rationale: "Phone filmmaking content reaches the widest possible photography audience." },
    { title: "Lightroom preset I spent 6 months perfecting (and my settings)", format: "Reel", hook: "Every photo on my feed uses this exact edit. Watch.", rationale: "Editing workflow content drives saves and follower trust." },
    { title: "Composition techniques that make photos impossible to scroll past", format: "Carousel", hook: "Rule of thirds is the floor. These are the ceiling.", rationale: "Advanced composition content positions creator as an authority." },
    { title: "Golden hour vs. blue hour: which one actually looks better?", format: "Reel", hook: "I shot the same scene at both. The results surprised me.", rationale: "Side-by-side comparison content drives strong engagement." },
    { title: "How to pose people who say they're 'not photogenic'", format: "Reel", hook: "Nobody is unphotogenic. Bad posing just makes it seem that way.", rationale: "Portrait posing guidance is one of the most requested photography topics." },
    { title: "Budget camera gear that shoots like premium equipment", format: "Carousel", hook: "Under $500 total. Here's what I'd buy to start.", rationale: "Gear recommendation content for beginners drives massive reach." },
    { title: "The editing mistake killing the mood of your photos", format: "Reel", hook: "It's not the filter. It's this one slider.", rationale: "Single-fix content with high impact drives immediate engagement." },
    { title: "How I built a photography portfolio with zero clients", format: "Carousel", hook: "The strategy that got me my first paid booking.", rationale: "Business side of photography content fills a major gap in the niche." },
    { title: "Drone shots that are worth the investment (and ones that aren't)", format: "Reel", hook: "I spent $800 on a drone. Here's my honest assessment.", rationale: "Drone content consistently outperforms standard photography on reach." },
  ],
  "Education & Learning": [
    { title: "Study method that tripled my retention rate", format: "Carousel", hook: "Not flashcards. Not re-reading. This science-backed approach.", rationale: "Study technique content is consistently top-performing for student audiences." },
    { title: "Books that genuinely changed how I think (not the usual list)", format: "Carousel", hook: "Not Atomic Habits. Not Think and Grow Rich. These.", rationale: "Anti-conventional book recommendations drive strong engagement." },
    { title: "How to learn any skill in 20 hours (the actual method)", format: "Reel", hook: "The 10,000 hours rule is a myth. Here's what actually works.", rationale: "Skill acquisition content performs very well with growth-focused audiences." },
    { title: "The note-taking system that top students actually use", format: "Carousel", hook: "It's not what your professor told you to do.", rationale: "Note-taking systems are perennial top-save content for students." },
    { title: "Online certifications that are actually worth getting in 2025", format: "Carousel", hook: "Not all certifications are equal. These ones employers notice.", rationale: "Career-relevant certification guides are extremely high-save." },
    { title: "How to read a book a week without speed reading", format: "Reel", hook: "I read 52 books last year. Here's exactly how I did it.", rationale: "Reading habit content resonates deeply with learning-focused audiences." },
    { title: "Morning routine of the world's highest performers", format: "Carousel", hook: "Elon sleeps 6 hours. Bezos wakes at 7am. What do they actually share?", rationale: "High-performer analysis content drives aspiration-based engagement." },
    { title: "The self-education roadmap I wish I had at 18", format: "Carousel", hook: "No college. No student debt. A real path to expertise.", rationale: "Self-education content resonates strongly with young audiences." },
    { title: "Why most people never finish online courses (and how to fix it)", format: "Reel", hook: "You have 8 unfinished courses. So does everyone. Here's why.", rationale: "Relatable problem content drives high comment engagement." },
    { title: "Habits of people who are constantly learning and growing", format: "Carousel", hook: "It's not reading more. It's doing this one thing differently.", rationale: "Habit content for growth audiences drives strong saves and shares." },
  ],
  "Lifestyle": [
    { title: "Morning routine that actually makes you productive all day", format: "Reel", hook: "I tested 12 morning routines. Only this one worked consistently.", rationale: "Morning routine content is one of the highest-engagement lifestyle formats." },
    { title: "How I built a life I don't need a vacation from", format: "Carousel", hook: "It took 3 years. Here's the exact changes I made.", rationale: "Lifestyle design content resonates deeply with aspirational audiences." },
    { title: "The habit that changed my life (that nobody talks about)", format: "Reel", hook: "Not journaling. Not meditation. This small, daily thing.", rationale: "Underrated habit reveals drive curiosity engagement." },
    { title: "Digital detox: what happened when I quit social media for 30 days", format: "Reel", hook: "I lost followers. I lost engagement. I gained everything else.", rationale: "Digital detox content is deeply resonant with burnt-out audiences." },
    { title: "Minimalism experiment: I owned 100 things for a month", format: "Reel", hook: "I thought it would be miserable. I was completely wrong.", rationale: "Minimalism challenge content drives strong curiosity engagement." },
    { title: "Toxic habits that are secretly draining your energy", format: "Carousel", hook: "You don't have low energy. You have high energy leaks.", rationale: "Energy management content performs strongly across all demographics." },
    { title: "The $0 self-care routine that outperformed my expensive one", format: "Carousel", hook: "I spent $300/month on wellness. Here's what I replaced it with.", rationale: "Budget vs. premium self-care content drives strong relatable engagement." },
    { title: "How to stop procrastinating (not the advice you've already heard)", format: "Carousel", hook: "Discipline is not the answer. This is.", rationale: "Fresh angles on procrastination consistently top lifestyle engagement." },
    { title: "What I stopped doing that made me happier", format: "Reel", hook: "Productivity hacks, morning routines, cold showers — I quit all of it.", rationale: "Subtractive improvement content offers a refreshing perspective." },
    { title: "Building a daily routine when you have no motivation", format: "Carousel", hook: "Stop waiting to feel motivated. Build a system that doesn't need it.", rationale: "Low-motivation productivity content is deeply relatable and high-save." },
  ],
  "Comedy & Entertainment": [
    { title: "POV: [relatable everyday scenario]", format: "Reel", hook: "We've all been here. No one talks about it.", rationale: "POV format is the #1 performing comedy structure on Instagram Reels." },
    { title: "Things that only [target audience] will understand", format: "Reel", hook: "If you've ever [relatable experience], this is for you.", rationale: "Audience-specific humor drives strong share behavior among in-group viewers." },
    { title: "Responding to DMs I get every week (unfiltered)", format: "Reel", hook: "You people are something else. Let me show you.", rationale: "Creator-audience interaction content drives genuine authenticity." },
    { title: "The most unhinged comment I've ever received", format: "Reel", hook: "Someone actually said this to me. In public.", rationale: "Reaction content to surprising comments drives high comment engagement." },
    { title: "Signs you grew up [shared background/culture]", format: "Reel", hook: "If you didn't have one of these, were you even there?", rationale: "Nostalgia + shared identity content drives massive shares and tags." },
    { title: "Types of people at [universal scenario]", format: "Reel", hook: "There are exactly 5 types. Which one are you?", rationale: "Character archetype content drives identification and tagging behavior." },
    { title: "Honest review of [trending product/place/experience]", format: "Reel", hook: "They said it was amazing. They lied. Let me explain.", rationale: "Comedy review format adds entertainment value to educational content." },
    { title: "Things I wish someone had told me about [life stage]", format: "Reel", hook: "I learned all of this the embarrassing way.", rationale: "Retrospective advice with comedy timing performs very strongly." },
    { title: "When [universal experience] hits different", format: "Reel", hook: "You know the feeling. And you know it's not normal.", rationale: "Validation content for common experiences drives strong saves and shares." },
    { title: "Expectations vs. reality: [relatable scenario]", format: "Reel", hook: "I had a vision. Life had other plans.", rationale: "Expectations vs. reality format is one of the highest-retention comedy structures." },
  ],
  "Finance & Investing": [
    { title: "How I saved $10,000 in one year on an average salary", format: "Carousel", hook: "No side hustle required. Just these specific changes.", rationale: "Savings milestone breakdowns are top-performing personal finance content." },
    { title: "Investment mistakes that cost beginners thousands", format: "Carousel", hook: "I made all of these. Learn from me, not from your account balance.", rationale: "Mistake-prevention content drives strong protective engagement." },
    { title: "The investing strategy I wish I started at 22", format: "Carousel", hook: "Time in the market beats timing the market. Here's proof.", rationale: "Retrospective investing advice resonates with both beginners and experienced audiences." },
    { title: "Why your savings account is losing you money", format: "Reel", hook: "1% APY while inflation is 3%. Do the math.", rationale: "Counter-intuitive financial content drives urgency and engagement." },
    { title: "Passive income streams that actually generated money this year", format: "Carousel", hook: "Not theory. Actual numbers. Here's what worked.", rationale: "Real passive income data drives extremely strong saves and engagement." },
    { title: "Credit score hacks that actually work (not myths)", format: "Carousel", hook: "Paid off all my debt. Score dropped. Here's why — and the fix.", rationale: "Credit score content is perennially high-search and high-save." },
    { title: "The budgeting method that finally stuck after 5 years of trying", format: "Reel", hook: "Not 50/30/20. Not zero-based. This simple approach.", rationale: "Personal budgeting success stories drive high relatability engagement." },
    { title: "What financial advisors don't tell middle-income earners", format: "Carousel", hook: "The advice they give wealthy clients is completely different.", rationale: "Insider financial knowledge creates strong trust and share behavior." },
    { title: "How to negotiate your salary (scripts that actually work)", format: "Carousel", hook: "Copy these exact phrases. I increased my salary 40%.", rationale: "Actionable salary negotiation scripts save at extremely high rates." },
    { title: "Is the stock market actually a good investment right now?", format: "Reel", hook: "Honest answer: depends on these 3 things specific to your situation.", rationale: "Market commentary with nuance builds trust over hype-based competitors." },
  ],
  "Pets & Animals": [
    { title: "Signs your dog is actually stressed (that owners miss)", format: "Carousel", hook: "That wagging tail doesn't always mean happy. Know the difference.", rationale: "Pet welfare content drives strong shares from concerned owners." },
    { title: "Foods that are secretly toxic to your pet", format: "Carousel", hook: "You've probably given your pet at least one of these.", rationale: "Safety warning pet content triggers immediate saves and shares." },
    { title: "Training my dog in 30 days: what actually worked", format: "Reel", hook: "Day 1: chaos. Day 30: watch this.", rationale: "Pet transformation content drives high views and emotional engagement." },
    { title: "A day in the life of my [pet]", format: "Reel", hook: "Spoiler: it involves 14 hours of sleep and snacks.", rationale: "Day-in-the-life pet content is evergreen and consistently high-performing." },
    { title: "Pet products that are actually worth the premium price", format: "Carousel", hook: "I've bought the cheap versions. These are the ones that last.", rationale: "Product recommendation content saves at high rates for pet owners." },
    { title: "What I wish I knew before getting a [pet]", format: "Carousel", hook: "Cute pictures don't show you the first 6 months.", rationale: "Pre-pet advice content reaches potential owners at decision stage." },
    { title: "How to introduce pets to a new baby — the right way", format: "Reel", hook: "I've seen this go wrong too many times. Here's how to do it safely.", rationale: "Transition content for life changes performs strongly with family audiences." },
    { title: "Understanding your cat's body language (full breakdown)", format: "Carousel", hook: "Your cat is constantly talking to you. You just don't speak cat.", rationale: "Educational pet communication content drives saves as a reference guide." },
    { title: "My pet's health scare and what I learned from it", format: "Reel", hook: "I almost missed this. If you have a pet, please watch.", rationale: "Personal pet health stories drive strong emotional engagement and shares." },
    { title: "Best exercises for different dog breeds", format: "Carousel", hook: "A border collie and a bulldog do NOT need the same exercise. Here's why.", rationale: "Breed-specific advice content reaches targeted pet owner audiences." },
  ],
  "Nature & Sustainability": [
    { title: "Zero waste swaps I've made that actually made a difference", format: "Carousel", hook: "Not carrying a metal straw. These real changes.", rationale: "Practical sustainability content outperforms preachy eco-content." },
    { title: "How I reduced my carbon footprint without going off-grid", format: "Carousel", hook: "Still using a phone. Still driving occasionally. Here's what moved the needle.", rationale: "Realistic sustainability content resonates with mainstream audiences." },
    { title: "Wild animal encounter that changed how I see nature", format: "Reel", hook: "I didn't plan it. I didn't expect it. Watch what happened.", rationale: "Authentic wildlife encounters are among the highest-engagement nature content." },
    { title: "Plants that purify indoor air (backed by NASA research)", format: "Carousel", hook: "Your home air quality is probably terrible. These plants help.", rationale: "Science-backed plant content drives strong saves and shares." },
    { title: "Hidden natural places near major cities most people don't know", format: "Carousel", hook: "You don't need to fly to see nature this stunning.", rationale: "Accessible nature destinations drive strong saves from urban audiences." },
    { title: "Sustainable brands that are actually sustainable (not greenwashing)", format: "Carousel", hook: "Most 'eco-friendly' brands are lying to you. These ones aren't.", rationale: "Anti-greenwashing content builds trust and drives strong engagement." },
    { title: "What I learned spending a week completely offline in nature", format: "Reel", hook: "No phone. No Wi-Fi. One week. Here's what happened to my brain.", rationale: "Digital detox in nature content resonates strongly with burnout audiences." },
    { title: "Climate facts that should be in the news but aren't", format: "Carousel", hook: "The headlines focus on politics. The science is more urgent.", rationale: "Educational climate content positions creator as a trusted source." },
    { title: "How to start a kitchen garden with zero experience", format: "Carousel", hook: "I killed every plant I'd ever owned. Then I tried this.", rationale: "Beginner gardening content reaches the largest possible sustainability audience." },
    { title: "The ocean plastic problem nobody shows you the scale of", format: "Reel", hook: "I went to a remote island. There was more plastic than sand.", rationale: "Visual environmental impact content drives strong emotional shares." },
  ],
};

// Fallback topics for any unmatched niche
const GENERIC_TOPICS: TrendingTopic[] = [
  { title: "My honest journey: the failures nobody talks about", format: "Reel", hook: "Everyone shows the win. Here's what happened before it.", rationale: "Vulnerability content builds authentic connections across all niches." },
  { title: "Things I wish I knew when I started (full breakdown)", format: "Carousel", hook: "3 years of lessons. Yours in 2 minutes.", rationale: "Hindsight advice performs strongly across every content category." },
  { title: "A day in my life — the real, unfiltered version", format: "Reel", hook: "No highlights reel. Just what an actual day looks like.", rationale: "Authentic behind-the-scenes content consistently outperforms polished content." },
  { title: "The single change that made the biggest difference", format: "Reel", hook: "I tried 20 things. Only one actually moved the needle.", rationale: "Single-focus insight content is memorable and highly shareable." },
  { title: "My top 10 resources that changed everything for me", format: "Carousel", hook: "Books, tools, people — the list I return to constantly.", rationale: "Resource curation content saves at extremely high rates." },
  { title: "Things I stopped doing that improved my life immediately", format: "Carousel", hook: "Subtracting these 6 habits added more than adding 10 new ones.", rationale: "Subtractive improvement content offers a unique perspective that performs well." },
  { title: "What nobody tells you about [your niche] starting out", format: "Carousel", hook: "I learned all of this the hard, expensive, time-consuming way.", rationale: "Insider knowledge content builds authority and drives high saves." },
  { title: "The worst advice I ever followed (and what to do instead)", format: "Reel", hook: "It came from a trusted source. It set me back a year.", rationale: "Counter-advice content drives strong debate and engagement." },
  { title: "Behind the scenes: what making this content actually looks like", format: "Reel", hook: "The outtakes, the setups, and the moments before the camera rolls.", rationale: "Creator process content builds authenticity and follower loyalty." },
  { title: "My predictions for where this is all going in 2025-2026", format: "Carousel", hook: "I've watched this space long enough to have strong opinions.", rationale: "Predictive content positions creators as forward-thinking authorities." },
];

const LANGUAGE_REGIONS: Record<string, { region: string; audienceNote: string }> = {
  English:    { region: "Global / English-speaking", audienceNote: "English content reaches the largest global Instagram audience." },
  Spanish:    { region: "Latin America / Spain", audienceNote: "Spanish content targets 500M+ speakers across LatAm and Spain." },
  Portuguese: { region: "Brazil / Portugal", audienceNote: "Portuguese content, likely targeting Brazil — the #2 Instagram market." },
  Hindi:      { region: "India", audienceNote: "Hindi content targets India's massive and fast-growing Instagram user base." },
  Arabic:     { region: "Middle East / North Africa", audienceNote: "Arabic content reaches high-engagement MENA communities." },
  French:     { region: "France / Francophone Africa", audienceNote: "French content covers a wide geographic reach including Africa." },
  German:     { region: "Germany / Austria / Switzerland", audienceNote: "German content targets the high-income DACH region." },
  Italian:    { region: "Italy", audienceNote: "Italian content for one of Europe's most active Instagram markets." },
  Japanese:   { region: "Japan", audienceNote: "Japanese content targets one of Asia's highest-spend audiences." },
  Korean:     { region: "South Korea", audienceNote: "Korean content benefits from K-culture's global reach and influence." },
  Turkish:    { region: "Turkey", audienceNote: "Turkish content targets one of the fastest-growing Instagram markets." },
  Indonesian: { region: "Indonesia / Southeast Asia", audienceNote: "Indonesian content targets the world's 4th most populous country." },
};

const FORMAT_STYLE: Record<string, { tone: string; postingPattern: string; visualStyle: string }> = {
  Reels:     { tone: "Dynamic & Entertaining", postingPattern: "3–5 Reels per week recommended for max reach", visualStyle: "Fast cuts, trending audio, text overlays, hook in first 3 seconds" },
  Photos:    { tone: "Aesthetic & Aspirational", postingPattern: "4–7 posts per week, consistent grid aesthetic", visualStyle: "High-quality visuals, clean composition, strong color palette" },
  Carousels: { tone: "Educational & Value-driven", postingPattern: "2–4 carousels per week, save-worthy content", visualStyle: "Slide 1 hooks, minimal text per slide, strong CTA on last slide" },
  Mixed:     { tone: "Versatile & Engaging", postingPattern: "Mix of Reels (reach) + Carousels (saves) + Photos (brand)", visualStyle: "Consistent brand colors, varied formats for different goals" },
};

function getTrendingTopics(niche: string, format: string): TrendingTopic[] {
  const topics = TRENDING_TOPICS[niche] ?? GENERIC_TOPICS;
  // Filter to prefer matching format, then fill with others
  const preferred = topics.filter(t =>
    format === "Mixed" || format === "Photos"
      ? true
      : format === "Reels"
      ? t.format === "Reel"
      : t.format === "Carousel"
  );
  const rest = topics.filter(t => !preferred.includes(t));
  const ordered = [...preferred, ...rest];
  const shuffled = ordered.sort(() => Math.random() - 0.2);
  return shuffled.slice(0, 10);
}

// ─── Main Analyzer (from user input) ──────────────────────────────────────

export function analyzeFromInput(input: UserInput): AnalysisResult {
  const { niche, format, language } = input;

  const langInfo = LANGUAGE_REGIONS[language] ?? LANGUAGE_REGIONS["English"];
  const styleInfo = FORMAT_STYLE[format] ?? FORMAT_STYLE["Mixed"];

  const nicheResult = {
    primary: niche,
    secondary: null,
    confidence: "high" as const,
    reasoning: `You selected ${niche} as your niche. Topics and recommendations are fully tailored to this category.`,
  };

  const contentStyle = {
    formats: format === "Mixed" ? ["Reels", "Carousels", "Static Photos"] : [format === "Photos" ? "Static Photos" : format],
    dominantFormat: format === "Photos" ? "Static Photos" : format,
    tone: styleInfo.tone,
    postingPattern: styleInfo.postingPattern,
    visualStyle: styleInfo.visualStyle,
  };

  const languageResult = {
    primary: language,
    secondary: null,
    region: langInfo.region,
    audienceNote: langInfo.audienceNote,
  };

  const trendingTopics = getTrendingTopics(niche, format);

  return { niche: nicheResult, contentStyle, language: languageResult, trendingTopics };
}
