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
