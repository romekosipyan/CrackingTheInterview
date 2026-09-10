export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  body: string
  author: string
  date: string
  readingTime: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'failed-system-design-interview-recovery-plan',
    title: 'Failed a system design interview? A 7-day recovery plan',
    excerpt:
      'You just failed a system design round. Here is a 7-day plan to rebuild structure, practice under pressure, and walk into your next loop with confidence.',
    body: `## You failed a system design interview. That stings.

If you are reading this the same day you got the rejection email — or worse, the same hour you walked out of the call — take a breath. A failed system design interview does not mean you are not a real engineer. It usually means one of three things: you skipped a phase of the framework, you ran out of time before you showed depth, or nerves made you jump to boxes before clarifying requirements. All three are fixable in a week.

This is not a pep talk. It is a day-by-day recovery plan with specific exercises, time boxes, and a way to measure whether you are actually improving. Follow it for seven days before your next loop.

## What interviewers were actually grading

System design rounds are not trivia. The interviewer wants to see whether you can turn a vague prompt into a structured conversation: clarify scope, estimate scale, sketch a high-level architecture, go deep on the interesting parts, and discuss how the system behaves under load and failure. If you spent twenty minutes on database indexing before you had a clear data flow, the signal was "jumps to implementation." If you never asked about read/write ratio or latency targets, the signal was "does not clarify requirements."

None of that requires memorizing Twitter's architecture. It requires repetition under mild pressure. That is what the next seven days are for.

## Your 7-day recovery plan

Each day has one focus, one primary exercise, and a hard stop. Do not add extra LeetCode on top — your brain needs to build a new habit loop, not more volume.

| Day | Focus | Primary exercise | Time box |
|-----|-------|------------------|----------|
| 1 | Requirements clarification | Clarify scope on 3 prompts without drawing | 45 min |
| 2 | Back-of-envelope estimation | Estimate QPS, storage, bandwidth for 2 systems | 60 min |
| 3 | High-level design | End-to-end diagram for one prompt | 50 min |
| 4 | Deep dives | Pick 2 components; justify technology choices | 60 min |
| 5 | Scale and monitoring | 10x traffic + observability for Day 3 design | 45 min |
| 6 | Timed mock | Full 45-minute run, recorded or with a partner | 45 min |
| 7 | Retro | Write what broke; pick one drill for next week | 30 min |

### Day 1 — Requirements clarification (no diagrams yet)

Pick three classic prompts: URL shortener, news feed, ride matching. Set a timer for fifteen minutes each. Your only job is to ask questions and summarize scope out loud or in writing. Do not draw a single box.

Write down at least eight questions per prompt. Cover functional requirements (what users can do), non-functional requirements (latency, availability, consistency), scale assumptions (DAU, read vs write ratio), and explicit out-of-scope items ("we are not building ML ranking in v1"). End each session with a one-paragraph summary: "We are building X for Y users with Z constraints."

If you freeze on what to ask, use the checklist from our [system design interview tips](/blog/system-design-interview-tips) post: scale, core use cases, consistency model, and failure tolerance. Day 1 success means you can talk for three minutes about what you are building before you touch a whiteboard.

### Day 2 — Back-of-envelope estimation

Take two prompts from Day 1. For each, spend thirty minutes estimating:

- Daily active users and requests per second (peak vs average)
- Storage per object and total storage per year
- Bandwidth for a typical read and write path

Use round numbers. "100 million DAU, each generates 5 reads and 1 write per day" is enough. The goal is order-of-magnitude sanity, not spreadsheet precision. Google's Site Reliability Engineering book has a clear treatment of why back-of-the-envelope math matters in production systems — the same skill transfers directly to interviews.

Common mistake: estimating storage but never connecting it to QPS. Always tie numbers to a user action ("each photo upload is 2 MB; 10 million uploads per day is ~20 TB/day before replication").

### Day 3 — High-level design

Choose the prompt you understand best from Days 1–2. Set fifty minutes. Draw clients, load balancers, application tier, primary datastore, cache, and async pipeline if needed. Walk the happy path for the main use case from client click to persisted data and back.

Rules for this session:

- Spend the first five minutes re-stating requirements (do not skip this — it is muscle memory now)
- Label data flow with arrows, not a wall of component names
- Stop at one clear architecture; do not fork into three options unless the interviewer asked for trade-offs

If you want a reference framework for component choices, the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) overview is a solid external checklist — not because you should name AWS services in every answer, but because it forces you to think about reliability, performance, and operability as separate lenses.

### Day 4 — Deep dives

Return to yesterday's diagram. The interviewer will not ask about everything; they will zoom in. Pick two areas that are genuinely interesting for your prompt: maybe consistent hashing for a cache, write path for a feed, or idempotency for payments.

For each deep dive, prepare:

- Why this component exists in the architecture
- Two technology options and why you picked one (Redis vs Memcached, SQL vs wide-column, queue vs stream)
- One failure mode and how you detect or recover from it

Spend thirty minutes per deep dive. Say the trade-offs out loud. "I would start with PostgreSQL because our access pattern is keyed lookups with strong consistency; if we outgrow single-node write throughput, we can shard by user_id" is the level of specificity you want.

### Day 5 — Scale, failure, and monitoring

Take the design from Day 3 and ask: what happens at 10x traffic? List three bottlenecks (database connections, hot keys, single leader) and one mitigation each. Then add a minimal observability story: metrics you would chart (p99 latency, error rate, queue depth), one alert you would page on, and one dashboard an on-call engineer would open first.

This is where many candidates stop early in the real interview. Spending forty-five minutes here separates "I drew boxes" from "I have operated something like this." You do not need Kubernetes war stories — you need plausible operational thinking.

### Day 6 — Timed mock (45 minutes, no pauses)

Run a full mock with a timer. Use the same prompt or a new one (notification system and chat app are good alternates). Structure:

- 0–5 min: requirements
- 5–15 min: high-level design
- 15–35 min: deep dives (follow where a real interviewer would push)
- 35–45 min: scale and monitoring

Record yourself or ask a friend to interrupt with "why?" every few minutes. If you do not have a partner, [practice mode](/practice) on Kraken Interview lets you run a timed system design session with diagram support — useful for checking whether you still skip the requirements phase when the clock is running. It will not substitute for knowing distributed systems fundamentals; it helps you stay structured when adrenaline spikes.

### Day 7 — Retro and next-week drill

Watch or skim the Day 6 recording. Write one page answering:

- Where did I lose time?
- Which question from the interviewer (or imaginary interviewer) stumped me?
- Did I quantify anything, or stay vague?

Pick **one** weakness and schedule two more 30-minute drills on it next week. Do not restart the whole seven days unless you failed the mock on fundamentals; usually one gap (estimation, deep dive depth, or monitoring) is the lever.

## What to do after a failed system design interview

Send a brief thank-you if you have a recruiter contact — no need to argue the decision. Ask whether feedback is available; many companies will not share it, and that is fine. Your recovery work is offline, not in email threads.

If you have another company in the pipeline, do not reuse the exact same narrative you used in the failed round unless it was strong. Fresh prompts expose whether you learned the framework or memorized one story.

## When a copilot helps (and when it does not)

Tools like [Kraken Interview](/lockedin-ai-alternative) can surface a phase checklist and generate Mermaid diagrams during practice so you remember to clarify requirements before drawing boxes. That is the honest use case: structure and recall under pressure, not outsourcing design judgment. If you cannot explain every box on the diagram without the overlay, you are not ready — the next onsite will show that quickly.

Compare copilots on features that matter for system design practice — diagram quality, latency, whether practice mode matches live-call pacing — not on hype. A desktop copilot with capture exclusion is irrelevant for offline whiteboard practice; it matters when you are rehearsing on a video call.

## The bottom line

A failed system design interview what to do next is not "grind twelve more hours of random YouTube videos." It is seven focused days: clarify, estimate, sketch, dive deep, scale, mock, retro. Engineers who run this loop twice rarely fail the same way twice.

When you are ready to pressure-test Day 6 again, run a timed session on [practice mode](/practice) or with a peer. Structure beats panic — and structure is trainable in a week.`,
    author: 'Kraken Interview Team',
    date: '2026-09-14',
    readingTime: '6 min read',
    tags: ['system design', 'interview prep', 'career', 'recovery'],
  },
  {
    slug: 'best-ai-interview-copilot-2026',
    title: 'Best AI Interview Copilot in 2026: What to Look For (and What to Avoid)',
    excerpt:
      'Shopping for an AI interview assistant? Compare pricing, screen-share stealth, system design support, and behavioral prep before you commit to a subscription.',
    body: `## Why AI Interview Copilots Took Off

The 2024–2026 hiring market made technical interviews more competitive than ever. Candidates who once relied solely on LeetCode grinding started looking for real-time assistance during live rounds — not to replace thinking, but to stay structured when adrenaline hits.

An AI interview copilot is a desktop app that captures your screen and/or audio, sends context to a language model, and surfaces hints, code scaffolds, or talking points in a discreet overlay. The best ones feel like a senior engineer whispering reminders — not a cheat sheet you blindly read.

## The 5 Features That Actually Matter

**1. Screen-share invisibility.** If your overlay appears in Zoom, Teams, or Google Meet recordings, the tool is a liability. Look for OS-level capture exclusion (Windows \`WDA_EXCLUDEFROMCAPTURE\`, macOS \`sharingType = .none\`). Kraken Interview uses these APIs so the overlay is visible on your monitor but absent from every capture pipeline.

**2. Interview type coverage.** Coding-only tools leave you exposed on system design and behavioral rounds. The strongest copilots handle all three: algorithm problems, architecture diagrams, and STAR-format behavioral stories. Kraken generates Mermaid diagrams for system design and structured STAR outlines for behavioral questions.

**3. Context personalization.** Generic answers sound generic. Tools that accept a job description URL and resume produce responses referencing your actual stack, experience level, and the role's requirements. This is the difference between "use a cache" and "given your React + Node background at this fintech, I'd recommend Redis for session state with a 15-minute TTL."

**4. Latency and streaming.** A suggestion that arrives 30 seconds late is useless. Modern copilots stream tokens as they're generated. Quick answers should appear in 2–4 seconds; deep answers with diagrams may take 8–15 seconds but should show progress immediately.

**5. Transparent pricing.** Weekly subscriptions dominate this market. Compare total cost over a typical 4–8 week interview loop, not just the headline weekly rate.

## 2026 Pricing Comparison

| Tool | Weekly | Monthly | Lifetime | Free trial |
|------|--------|---------|----------|------------|
| Kraken Interview | $24 | $54 | $684 | 30 min / device |
| Leading competitor A | $39 | $69 | $699 | Limited |
| Leading competitor B | $29 | — | — | Limited |

Over an 8-week interview loop, Kraken saves $120+ compared to competitor A on weekly billing — while adding system design diagrams, behavioral STAR mode, and JD + resume context on Pro Monthly.

## Red Flags When Evaluating Copilots

- **No capture-exclusion demo.** If the vendor can't show you a side-by-side "your view vs interviewer view" video, be skeptical.
- **Cloud audio routing.** Some tools send raw audio to third-party servers. Prefer local transcription with only text sent to the LLM API.
- **Coding-only positioning.** If system design and behavioral aren't mentioned, assume they're not supported.
- **No cancellation path.** Subscriptions should be cancellable from a web portal without emailing support.

## Our Recommendation

For engineers in active interview loops who need coding, system design, and behavioral coverage with proven screen-share invisibility, [Kraken Interview](https://krakeninterview.com/pricing) offers the best feature-to-price ratio in 2026. Start with the free 30-minute trial — enough for a full mock round — before choosing Pro Weekly ($24) or Pro Monthly ($54).`,
    author: 'Kraken Team',
    date: '2026-06-05',
    readingTime: '8 min read',
    tags: ['AI', 'Interview Copilot', 'Comparison']
  },
  {
    slug: 'interview-copilot-comparison-2026',
    title: 'Kraken Interview vs Other AI Copilots: Feature & Price Comparison',
    excerpt:
      'Side-by-side comparison of Kraken Interview against leading AI interview assistants — pricing, system design, behavioral prep, and screen-share stealth.',
    body: `## Why Compare Before You Subscribe

AI interview copilots are a significant investment — $24–39 per week adds up fast during a multi-month job search. Before committing, compare what you actually get for the price across coding, system design, behavioral, and stealth features.

## Feature Comparison

| Feature | Kraken Interview | Competitor A | Competitor B |
|---------|------------------|--------------|--------------|
| Weekly price | **$24** | $39 | $29 |
| Monthly price | **$54** | $69 | — |
| Lifetime option | **$684** | $699 | — |
| Coding interviews | ✓ | ✓ | ✓ |
| System design | **✓ (Mermaid diagrams)** | Basic text | ✗ |
| Behavioral (STAR) | ✓ | ✗ | ✓ |
| Screen share stealth | ✓ | ✓ | ✓ |
| Voice input | ✓ | ✓ | ✗ |
| JD + Resume context | ✓ | ✗ | ✗ |
| Platforms supported | **18+** | 10+ | 8+ |
| Free trial | **30 min / device** | Limited | Limited |

## Where Kraken Interview Wins

**Price.** At $24/week, Kraken is $15 cheaper than competitor A and $5 cheaper than competitor B. Over a typical 8-week loop, that's $40–120 in savings.

**System design depth.** Kraken generates Mermaid architecture diagrams — boxes, arrows, and component labels you can walk the interviewer through while screensharing. Competitor A offers text-only responses; competitor B doesn't support system design at all.

**Behavioral + coding + design in one app.** Instead of juggling separate tools for LeetCode hints and STAR story prep, Kraken covers every round type in a single overlay with consistent hotkeys.

**Job-description awareness.** Paste a JD URL and upload your resume. Answers reference the role's tech stack, seniority level, and company context instead of generic textbook responses.

## Where Competitors May Fit Better

If you only need basic coding hints and don't care about system design or behavioral prep, competitor B's lower feature set may feel sufficient — though you'll still pay $5/week more than Kraken for fewer capabilities.

Competitor A has brand recognition and a longer track record. If price isn't a factor and you don't need Mermaid diagrams or JD context, it's a viable option — but you'll pay 62% more per week.

## The Bottom Line

For most software engineers preparing for full interview loops (coding + system design + behavioral), Kraken Interview offers the strongest combination of features and value. The 30-minute free trial lets you verify screen-share invisibility and test a full mock round before subscribing.

[View Kraken Interview pricing →](https://krakeninterview.com/pricing)`,
    author: 'Kraken Team',
    date: '2026-06-03',
    readingTime: '5 min read',
    tags: ['Comparison', 'Pricing', 'Product']
  },
  {
    slug: 'ai-coding-interview-assistant-guide',
    title: 'How to Use an AI Assistant During Live Coding Interviews (Without Freezing Up)',
    excerpt:
      'A practical guide to using AI interview tools effectively — hotkey workflows, when to use quick vs deep answers, and how to stay natural while getting real-time help.',
    body: `## The Real Problem AI Copilots Solve

Coding interviews aren't really about whether you can implement Dijkstra's algorithm from memory. They're about whether you can communicate your approach, handle follow-ups, and stay calm when the pressure spikes. AI copilots help with the second and third — keeping you structured when your brain goes blank.

This isn't about reading answers verbatim. It's about having a safety net that reminds you of the approach, suggests edge cases you forgot, and helps you recover when you hit a wall.

## Before the Interview: Setup Checklist

**1. Upload your resume and paste the JD URL.** Tools like Kraken Interview use this context to tailor suggestions to the role's stack and your experience level.

**2. Pick your language.** Set Python, Java, JavaScript, or whatever the role expects. Suggestions will use the right syntax and idioms.

**3. Test screen-share invisibility.** Start a test call or use the built-in verification mode. Confirm the overlay is absent from the shared view. This takes 2 minutes and prevents disaster.

**4. Memorize the hotkeys.** Kraken's workflow:
- **Alt+S** — Capture screen (grab the problem statement)
- **Alt+B** — Record voice (capture follow-up questions)
- **Alt+Enter** — Quick answer (fast hint, 2–4 seconds)
- **Alt+Shift+Enter** — Deep answer (full solution with explanation)
- **Alt+Escape** — End interview

Practice these until they're muscle memory. Fumbling for keys mid-interview breaks your flow.

## During the Interview: When to Use What

**Quick answer (Alt+Enter)** — Use when:
- You need a pattern reminder ("this looks like sliding window")
- You forgot the name of an algorithm
- You want to confirm your approach before coding

**Deep answer (Alt+Shift+Enter)** — Use when:
- You're stuck after 3+ minutes on a problem
- The interviewer asks a follow-up you didn't anticipate
- You need a complete code scaffold to adapt and explain

**Voice capture (Alt+B)** — Use when:
- The interviewer explains a constraint verbally
- They ask a follow-up question without changing the screen
- You're in a system design round with spoken prompts

## How to Stay Natural

The biggest mistake is reading the overlay word-for-word. Interviewers notice monotone delivery and eye movement. Instead:

1. **Glance, don't stare.** Quick 1–2 second looks at the overlay between sentences.
2. **Paraphrase everything.** "So my approach would be to use a hash map here because we need O(1) lookups..."
3. **Think out loud first.** Say "Let me think about the trade-offs..." before glancing at a hint. It buys time and sounds natural.
4. **Use the copilot for recovery, not replacement.** If you know the approach, don't trigger a deep answer. Save it for when you're genuinely stuck.

## After the Interview: Learn From It

Review what the copilot suggested versus what you actually said. The gaps tell you what to study before the next round. If you needed deep answers on every graph problem, spend a week on BFS/DFS patterns instead of relying on the tool.

## Try It Before Your Next Loop

Kraken Interview offers a one-time 30-minute free trial per device — enough for a full mock coding round. [Download free](https://krakeninterview.com/#download) and run through a medium LeetCode problem with the hotkey workflow above. You'll know within 30 minutes whether it fits your style.`,
    author: 'Kraken Team',
    date: '2026-06-01',
    readingTime: '6 min read',
    tags: ['Coding Interview', 'AI', 'How-To']
  },
  {
    slug: 'ai-interview-copilot-guide',
    title: 'What Is an AI Interview Copilot and How Does It Work?',
    excerpt:
      'AI interview copilots are changing how candidates prepare for and navigate technical interviews. Learn what they do, how they work under the hood, and what to look for when choosing one.',
    body: `## The Rise of AI-Assisted Interviews

Technical interviews have always been high-stakes. You get 45 minutes to prove your worth, and one bad freeze can undo weeks of preparation. That pressure is exactly why AI interview copilots have gained traction — they act as a real-time thinking partner that helps you stay structured when nerves kick in.

An AI interview copilot is a desktop application that listens to your interview audio (or reads screen-shared problems), processes the conversation through a large language model, and surfaces relevant hints, code scaffolds, or talking points in a discreet overlay. Think of it as having a brilliant study partner whispering reminders in your ear — except it runs locally on your machine and is invisible to screen-sharing software.

## How the Technology Works

Under the hood, most copilots follow a three-stage pipeline. First, audio is captured and transcribed using a speech-to-text model. Second, the transcript is fed into an LLM along with context about the question type (coding, system design, behavioral). Third, the model's response is rendered in a lightweight overlay that sits on top of your meeting window. The best implementations, like Kraken Interview, use OS-level capture exclusion so the overlay never appears in shared screens or recordings.

Latency matters enormously here. A suggestion that arrives 30 seconds after you needed it is useless. Modern copilots stream tokens as they're generated, so you start seeing useful output within a few seconds of the question being asked. Some also maintain a rolling context window of the entire conversation, which means follow-up questions get increasingly accurate answers.

## What to Look For

Not all copilots are created equal. Key differentiators include capture-exclusion support (essential if your interview uses screen sharing), model quality (the difference between GPT-4-class and a fine-tuned open model is significant), and system design capabilities. Many tools handle LeetCode-style problems reasonably well, but fall apart when the interviewer asks you to design a distributed cache or a notification system. Look for a tool that provides structured frameworks — like identifying requirements, estimating scale, choosing components — rather than just dumping a wall of text.

Privacy is another critical factor. Some copilots route audio through cloud servers, which means your interview content travels across the internet. A better approach is local-first processing where the audio never leaves your machine, and only the transcribed text is sent to the LLM API. This minimizes your exposure and keeps the interaction between you and the model.

## The Ethical Question

The elephant in the room: is using a copilot cheating? The honest answer is nuanced. If the tool is doing the thinking for you and you're blindly reading answers, yes — and it won't help you on the job either. But if you're using it as a safety net to stay structured, overcome anxiety, and recall patterns you've already studied, it's closer to using notes during an open-book exam. The industry is still forming opinions here, but the trend is clear — candidates who combine genuine preparation with smart tooling tend to outperform on both interviews and actual job performance.`,
    author: 'Kraken Team',
    date: '2026-05-20',
    readingTime: '6 min read',
    tags: ['AI', 'Interview Prep', 'Product']
  },
  {
    slug: 'system-design-interview-tips',
    title: 'System Design Interview Tips: From Panic to Structured Answers',
    excerpt:
      'System design interviews don\'t have to be terrifying. This guide walks through a repeatable framework that turns vague prompts like "design Twitter" into confident, structured answers.',
    body: `## Why System Design Feels So Hard

Unlike coding interviews where there's usually a correct answer, system design questions are deliberately open-ended. When an interviewer says "design a URL shortener," they're not looking for one right architecture — they're evaluating how you think, communicate trade-offs, and navigate ambiguity. The problem is that most engineers don't practice this skill explicitly, so they freeze when the whiteboard appears.

The good news is that system design interviews follow predictable patterns. Once you internalize a framework, the "design X" prompt stops being paralyzing and starts being an invitation to showcase your engineering judgment.

## A Four-Phase Framework

**Phase 1: Requirements & Scope (3-5 minutes).** Before drawing a single box, clarify what you're building. Ask about the user base scale, core use cases, and any specific constraints. Is this a read-heavy or write-heavy system? Do we need real-time updates? What's the expected latency SLA? This phase shows the interviewer you don't jump to solutions prematurely.

**Phase 2: High-Level Design (10-12 minutes).** Sketch the major components: clients, load balancers, application servers, databases, caches, and message queues. Start with the simplest architecture that satisfies the requirements, then iterate. Draw the data flow for the primary use case end-to-end. This is where Kraken Interview's system design mode shines — it can suggest component diagrams and remind you of patterns you might forget under pressure.

**Phase 3: Deep Dives (15-18 minutes).** The interviewer will pick one or two areas to zoom into. Maybe it's the database schema, the caching strategy, or how you'd handle a specific failure mode. This is where you demonstrate depth. Discuss specific technologies (Redis vs Memcached, PostgreSQL vs DynamoDB), explain why you'd choose one over the other, and acknowledge the trade-offs of your choices.

**Phase 4: Scaling & Extensions (5-7 minutes).** If time permits, discuss how the system evolves. What happens at 10x the traffic? How would you add a new feature? What monitoring and alerting would you set up? This shows you think beyond the initial build.

## Common Mistakes to Avoid

The biggest mistake is diving into implementation details too early. If you're discussing database indexing strategies before you've established the overall architecture, you're in trouble. Another common pitfall is not quantifying. "We need a lot of storage" is weak; "at 500M users generating 2 tweets/day at 280 bytes each, that's roughly 100GB/day of raw text" is strong.

Don't be afraid to use back-of-the-envelope math. Interviewers love seeing candidates who can quickly estimate QPS, storage requirements, and bandwidth. It doesn't have to be precise — order-of-magnitude is fine.

## Practice Makes Permanent

The only way to get comfortable with system design is repetition. Pick a system you use daily (Instagram, Uber, Slack) and spend 45 minutes designing it end-to-end. Record yourself or use an AI tool to simulate the interview pressure. The goal isn't to memorize architectures — it's to build the muscle memory of structured thinking so that when the real interview hits, the framework kicks in automatically.`,
    author: 'Kraken Team',
    date: '2026-05-14',
    readingTime: '7 min read',
    tags: ['System Design', 'Interview Prep', 'Career']
  },
  {
    slug: 'invisible-screen-share-explained',
    title: 'How Capture Exclusion Makes Your Overlay Invisible on Screen Share',
    excerpt:
      'Ever wondered how some desktop overlays stay invisible during screen shares? This deep dive explains the OS-level APIs behind capture exclusion on Windows and macOS.',
    body: `## The Problem: Overlays and Screen Sharing Don't Mix

If you've ever tried to use a desktop overlay during a video call, you've likely noticed the problem — whatever appears on your screen also appears in the shared feed. This is by design: screen-sharing APIs capture the composite of everything rendered on your display. But there are legitimate reasons to exclude certain windows from capture: password managers, notification popups, confidential dashboards, and yes, interview preparation tools.

Both Windows and macOS provide OS-level APIs that let an application flag its windows as "excluded from capture." This isn't a hack or a workaround — it's a supported platform capability that privacy-focused applications have used for years.

## How It Works on Windows

Windows offers the \`SetWindowDisplayAffinity\` API with the \`WDA_EXCLUDEFROMCAPTURE\` flag. When an application sets this flag on its window handle, the Desktop Window Manager (DWM) instructs the capture pipeline to skip that window entirely. It won't appear in screen recordings, screen-sharing sessions, or even screenshots taken with the Print Screen key.

Kraken Interview uses this API on Windows to ensure its overlay — the panel showing suggestions and code hints — is completely invisible to any capture software. The overlay is still fully visible to the user on their physical display, but as far as the screen-sharing pipeline is concerned, it doesn't exist. This works universally across all major meeting platforms: Zoom, Google Meet, Microsoft Teams, and WebEx.

## How It Works on macOS

macOS takes a slightly different approach. The \`CGWindowLevel\` system combined with the \`sharingType\` property on \`NSWindow\` controls capture behavior. Setting \`window.sharingType = .none\` tells the WindowServer to exclude that window from all screen capture operations, including the APIs that Zoom and Meet use to grab your screen content.

The implementation is clean: the overlay window is created with the appropriate sharing type from the moment it's initialized. There's no toggling, no race conditions — the window is simply never part of the capturable surface. This approach has been stable since macOS Catalina, and it's the same mechanism that macOS itself uses for certain system UI elements.

## Why This Matters

The reliability of capture exclusion is what separates a practical tool from a liability. If an overlay might "sometimes" leak into a screen share, it's worse than useless — it's dangerous. The OS-level approach is binary: the window is either excluded or it isn't. There's no pixel-level blending, no transparency tricks, and no dependency on the specific screen-sharing application's behavior.

It's worth noting that this technology is widely used beyond interview tools. Screen annotation software, system monitors, accessibility overlays, and teleprompter applications all rely on the same APIs. The capability exists because there are genuine privacy and usability reasons to have windows that are visible locally but invisible to capture.

## Testing and Verification

If you want to verify that capture exclusion is working, the simplest test is to start a screen share in your meeting app and look at the preview. Any excluded windows will be completely absent from the shared view. You can also use OBS or the built-in screen recording tools — excluded windows won't appear there either. Kraken Interview includes a built-in test mode that walks you through this verification before your actual interview, so you can have complete confidence that the overlay is invisible.`,
    author: 'Kraken Team',
    date: '2026-05-06',
    readingTime: '5 min read',
    tags: ['Technology', 'Screen Share', 'Privacy']
  },
  {
    slug: 'leetcode-alternatives-2026',
    title: 'Beyond LeetCode: Smarter Ways to Prepare for Coding Interviews in 2026',
    excerpt:
      'LeetCode grinding isn\'t the only way to prepare for coding interviews. Explore modern alternatives that build deeper understanding and better simulate real interview conditions.',
    body: `## The LeetCode Plateau

If you've solved 300+ LeetCode problems and still feel unprepared, you're not alone. The "grind" approach has diminishing returns because it optimizes for pattern recognition on a fixed problem set rather than building transferable problem-solving skills. By 2026, the interview landscape has shifted enough that pure LeetCode preparation leaves significant gaps.

Modern technical interviews increasingly test system thinking, code quality, and communication — not just whether you can implement Dijkstra's algorithm from memory. Companies like Google, Meta, and top startups have evolved their interview processes, and your preparation strategy should evolve too.

## Alternative Approaches That Work

**Mock interviews with real humans.** Nothing simulates interview pressure like talking through a problem with another person. Platforms like Pramp and interviewing.io connect you with peers or experienced engineers for practice sessions. The feedback you get on communication style, problem decomposition, and whiteboard presence is invaluable — and it's something LeetCode can never provide.

**Build something real.** Instead of solving isolated problems, build a small but complete project: a rate limiter, a key-value store, a simple database. You'll encounter the same algorithmic challenges (hash maps, trees, concurrency) but in context, which builds much deeper understanding. When an interviewer asks about hash collisions, you'll draw on experience rather than memorization.

**AI-assisted practice.** Tools like Kraken Interview let you simulate the full interview experience — including real-time feedback, follow-up questions, and system design walkthroughs — without needing to schedule sessions with other people. The advantage is availability: you can practice at 11 PM on a Tuesday when no mock interview partner is awake.

## Focus on Weak Spots, Not Volume

The most efficient preparation targets your weaknesses specifically. If you consistently struggle with dynamic programming, spending a week deeply understanding the paradigm (memoization vs tabulation, identifying subproblems, state transition definitions) is worth more than solving 50 random mediums. Use a spaced-repetition approach: solve a problem, revisit it three days later, then a week later. If you can reconstruct the approach from scratch, you've actually learned it.

Similarly, don't neglect the "soft" skills that LeetCode ignores entirely. Practice explaining your thought process out loud while you code. Get comfortable saying "I'm not sure about the optimal approach, let me think about the trade-offs." Interviewers consistently rate candidates higher when they communicate clearly, even if their solution isn't perfect.

## The Integrated Approach

The best 2026 interview preparation combines multiple modalities: targeted problem-solving for algorithmic fluency, system design practice for architectural thinking, behavioral preparation for the STAR-format questions, and full mock interviews to tie it all together. Allocate your time proportionally based on the role — backend engineering roles weight system design heavily, while new-grad positions still lean on algorithms.

Whatever approach you choose, remember that the goal isn't to game the interview — it's to build genuine competence that serves you on the job. The best interview performance comes from candidates who deeply understand fundamentals and can apply them flexibly, not from those who've memorized the most solutions.`,
    author: 'Kraken Team',
    date: '2026-04-28',
    readingTime: '6 min read',
    tags: ['Interview Prep', 'LeetCode', 'Career']
  },
  {
    slug: 'behavioral-interview-star-method',
    title: 'The STAR Method for Behavioral Interviews: A Complete Guide',
    excerpt:
      'Behavioral interviews trip up even experienced engineers. Master the STAR method to deliver concise, compelling stories that showcase your impact and leadership.',
    body: `## Why Engineers Struggle with Behavioral Questions

You've spent weeks grinding algorithms, and then the interviewer hits you with: "Tell me about a time you disagreed with your manager." Your mind goes blank. Not because you don't have relevant experiences, but because you haven't structured them into narratives that are easy to recall and deliver under pressure.

Behavioral interviews assess collaboration, leadership, conflict resolution, and ownership — skills that matter enormously on the job but rarely get practiced deliberately. The STAR method gives you a repeatable structure to turn messy real-world experiences into clear, compelling stories.

## STAR Breakdown

**Situation:** Set the scene in 2-3 sentences. What was the project, team, and context? Keep it concise — the interviewer doesn't need a five-minute backstory. "I was the tech lead on a six-person team building a real-time analytics pipeline for our advertising platform" is enough.

**Task:** What was your specific responsibility or challenge? This is where you clarify your role versus the team's role. "My job was to design the ingestion layer that needed to handle 50,000 events per second with sub-second latency" makes your ownership clear.

**Action:** This is the core — what did you actually do? Be specific about your decisions and reasoning. Don't say "we decided to use Kafka." Say "I proposed using Kafka over our existing RabbitMQ setup because we needed horizontal scalability and replay capability. I built a proof-of-concept, benchmarked it against our requirements, and presented the results to the team." Use "I" not "we" — the interviewer wants to understand your contribution.

**Result:** Quantify the outcome wherever possible. "The new pipeline processed 80,000 events per second at p99 latency of 200ms, which was 3x our original requirement. It's been running in production for 18 months with 99.97% uptime." Numbers make stories memorable and credible.

## Building Your Story Bank

Before any interview, prepare 8-10 STAR stories that cover the common behavioral themes: leadership, conflict, failure, ambiguity, tight deadlines, cross-team collaboration, and mentoring. Write them down and practice delivering each one in under two minutes. You'll reuse and adapt these stories across multiple interviews — a good "disagreement" story can also answer "tell me about a time you influenced without authority."

Kraken Interview can help here too — its behavioral mode listens to the question and suggests which of your prepared stories might be the best fit, along with reminders about specific details you planned to mention. It's like having your preparation notes accessible without breaking eye contact.

## Advanced Tips

**Layer in self-awareness.** After delivering your STAR answer, add a reflection: "If I were to do it again, I'd involve the QA team earlier in the process — I learned that late-stage testing feedback is much more expensive to address." This shows growth mindset and humility, which interviewers value highly.

**Match story intensity to question severity.** If someone asks about a minor disagreement, don't tell a story about a massive organizational conflict. Calibrate your response to what's being asked. Have stories at different scales ready.

**Practice the transitions.** The weakest part of most STAR answers is the seam between sections. Work on smooth transitions: "Given that context, my immediate priority was..." or "The result of that approach was..." These connectors keep your answer flowing naturally instead of sounding like a rigid template.

The key insight is that behavioral interviews reward preparation just as much as technical ones. Engineers who treat them as an afterthought consistently underperform, while those who invest a few hours building and rehearsing their story bank find them to be the easiest part of the interview loop.`,
    author: 'Kraken Team',
    date: '2026-04-15',
    readingTime: '7 min read',
    tags: ['Behavioral', 'Interview Prep', 'STAR Method']
  }
]
