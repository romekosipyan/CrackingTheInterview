/**
 * Competitor "alternative" landing pages — the fastest-ranking, highest-intent
 * SEO surface for a new domain. Each entry renders at /{slug} (e.g.
 * /interview-coder-alternative) via AlternativePage.tsx.
 *
 * Pricing figures are the competitors' publicly listed rates at time of writing
 * and can change — every page shows a "verify on their site" disclaimer, matching
 * the main comparison table. Keep claims factual and defensible.
 */

export type AlternativeRow = {
  label: string
  kraken: string
  competitor: string
  /** true when Kraken's cell is the clear win (renders highlighted). */
  krakenWins?: boolean
}

export type AlternativeFaq = {
  q: string
  a: string
}

export type Alternative = {
  /** URL slug, e.g. "interview-coder-alternative" */
  slug: string
  /** Competitor display name */
  competitor: string
  /** Competitor site (nofollow external link) */
  competitorUrl?: string
  /** <title> + H1 */
  title: string
  /** Meta description */
  description: string
  /** Short hero sub-headline */
  tagline: string
  /** 3–5 concrete reasons to switch */
  whySwitch: string[]
  /** Head-to-head rows (Kraken vs this competitor) */
  rows: AlternativeRow[]
  /** Page-specific FAQ (also emitted as FAQPage JSON-LD) */
  faqs: AlternativeFaq[]
}

const TRIAL_ROW: AlternativeRow = {
  label: 'Free trial',
  kraken: 'One-time 30-min trial per device',
  competitor: 'Limited / credits',
  krakenWins: true,
}

const COVERAGE_ROWS: AlternativeRow[] = [
  {
    label: 'System design',
    kraken: 'Mermaid architecture diagrams',
    competitor: 'Text only or unsupported',
    krakenWins: true,
  },
  {
    label: 'Behavioral (STAR)',
    kraken: 'Structured STAR answers',
    competitor: 'Varies',
  },
  {
    label: 'JD + resume context',
    kraken: 'Answers match the role & your stack',
    competitor: 'Generic answers',
    krakenWins: true,
  },
  {
    label: 'Screen-share stealth',
    kraken: 'OS-level capture exclusion',
    competitor: 'Supported',
  },
]

export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'interview-coder-alternative',
    competitor: 'Interview Coder',
    title: 'The Best Interview Coder Alternative in 2026',
    description:
      'Looking for an Interview Coder alternative? Kraken Interview covers coding, system design (Mermaid), and behavioral rounds — invisible on screen share, from $24/week with a free trial.',
    tagline:
      'Same invisible-overlay superpower, but built for every round — coding, system design, and behavioral — at a lower price.',
    whySwitch: [
      'Full-loop coverage: coding, system design with real Mermaid diagrams, and behavioral STAR — not coding-only.',
      'Answers tailored to your job description and resume, so responses reference the actual role and your stack.',
      'Transparent, lower pricing — Pro from $24/week with a one-time 30-minute free trial per device.',
      'Works across 18+ coding platforms and every major video call (Zoom, Teams, Meet, Webex).',
    ],
    rows: [
      { label: 'Weekly price', kraken: '$24', competitor: 'Higher / monthly-only', krakenWins: true },
      { label: 'Coding interviews', kraken: 'Unlimited on Pro', competitor: 'Yes' },
      ...COVERAGE_ROWS,
      TRIAL_ROW,
    ],
    faqs: [
      {
        q: 'What is the best Interview Coder alternative?',
        a: 'Kraken Interview is a strong Interview Coder alternative: it keeps the invisible on-screen overlay but adds system design (Mermaid diagrams), behavioral STAR answers, and job-description + resume context, starting at $24/week with a free 30-minute trial.',
      },
      {
        q: 'Is Kraken Interview cheaper than Interview Coder?',
        a: 'Kraken Interview Pro starts at $24/week — typically below comparable copilot tiers. Always verify current pricing on each provider’s site before subscribing.',
      },
      {
        q: 'Does Kraken Interview work for system design interviews?',
        a: 'Yes. Kraken generates Mermaid architecture diagrams and structured deep answers (requirements, API, data model, scaling), not just text hints.',
      },
    ],
  },
  {
    slug: 'shadecoder-alternative',
    competitor: 'ShadeCoder',
    competitorUrl: 'https://www.shadecoder.com/',
    title: 'The Best ShadeCoder Alternative in 2026',
    description:
      'A ShadeCoder alternative that costs $15 less per week and adds Mermaid system design diagrams, behavioral STAR, and JD + resume context. Free 30-minute trial.',
    tagline: '$15 cheaper per week, with system design diagrams and behavioral prep ShadeCoder leaves out.',
    whySwitch: [
      'Save $15/week — Kraken Pro is $24/week vs ShadeCoder’s $39/week on comparable tiers.',
      'Real system design: Mermaid diagrams instead of text-only responses.',
      'Behavioral STAR mode plus JD + resume context, both included on Pro.',
      'Same OS-level capture exclusion, so the overlay stays off the shared screen.',
    ],
    rows: [
      { label: 'Weekly price', kraken: '$24', competitor: '$39', krakenWins: true },
      { label: 'Monthly price', kraken: '$54', competitor: '$69', krakenWins: true },
      { label: 'Lifetime option', kraken: '$684', competitor: '$699', krakenWins: true },
      { label: 'System design', kraken: 'Mermaid diagrams', competitor: 'Text only', krakenWins: true },
      { label: 'Behavioral (STAR)', kraken: 'Yes', competitor: 'No', krakenWins: true },
      { label: 'JD + resume context', kraken: 'Yes', competitor: 'No', krakenWins: true },
      TRIAL_ROW,
    ],
    faqs: [
      {
        q: 'Is Kraken Interview cheaper than ShadeCoder?',
        a: 'Yes. Kraken Pro Weekly is $24 vs ShadeCoder’s $39, Pro Monthly is $54 vs $69, and Lifetime is $684 vs $699 based on publicly listed pricing. Verify current rates before buying.',
      },
      {
        q: 'What does Kraken add over ShadeCoder?',
        a: 'Mermaid system-design diagrams, behavioral STAR answers, and job-description + resume context — in addition to the invisible screen-share overlay both tools offer.',
      },
    ],
  },
  {
    slug: 'lockedin-ai-alternative',
    competitor: 'LockedIn AI',
    competitorUrl: 'https://www.lockedinai.com/',
    title: 'The Best LockedIn AI Alternative in 2026',
    description:
      'A LockedIn AI alternative with Mermaid system design diagrams, behavioral STAR, and a lower monthly price. Invisible on screen share. Free 30-minute trial.',
    tagline: 'Lower monthly price, real system-design diagrams, and stealth on every plan — not just the top tier.',
    whySwitch: [
      'Lower monthly price — Kraken Pro Monthly is $54 vs LockedIn AI’s ~$69.99.',
      'Mermaid system-design diagrams you can walk the interviewer through.',
      'Screen-share stealth included, not gated behind a higher tier.',
      'One-time 30-minute free trial per device — enough for a full mock round.',
    ],
    rows: [
      { label: 'Monthly price', kraken: '$54', competitor: '$69.99', krakenWins: true },
      { label: 'Weekly option', kraken: '$24', competitor: '—', krakenWins: true },
      { label: 'System design', kraken: 'Mermaid diagrams', competitor: 'Text only', krakenWins: true },
      { label: 'Screen-share stealth', kraken: 'All plans', competitor: 'Pro plan only', krakenWins: true },
      { label: 'JD + resume context', kraken: 'Yes', competitor: 'Yes' },
      TRIAL_ROW,
    ],
    faqs: [
      {
        q: 'What is a good LockedIn AI alternative?',
        a: 'Kraken Interview offers a lower monthly price, Mermaid system-design diagrams, and screen-share stealth on every plan, with a free 30-minute trial to test it first.',
      },
    ],
  },
  {
    slug: 'final-round-ai-alternative',
    competitor: 'Final Round AI',
    competitorUrl: 'https://www.finalroundai.com/',
    title: 'The Best Final Round AI Alternative in 2026',
    description:
      'A Final Round AI alternative focused on live technical rounds: Mermaid system design, behavioral STAR, JD + resume context, and a lower price. Free 30-minute trial.',
    tagline: 'Built for live technical rounds — with system-design diagrams and a lower monthly price.',
    whySwitch: [
      'Lower monthly price — Kraken Pro Monthly is $54 vs Final Round AI’s ~$90.',
      'Mermaid architecture diagrams for system design, not just text.',
      'Supports 18+ coding platforms and every major video call.',
      'One-time 30-minute free trial per device before you commit.',
    ],
    rows: [
      { label: 'Monthly price', kraken: '$54', competitor: '$90', krakenWins: true },
      { label: 'Weekly option', kraken: '$24', competitor: '—', krakenWins: true },
      { label: 'System design', kraken: 'Mermaid diagrams', competitor: 'Text only', krakenWins: true },
      { label: 'Behavioral (STAR)', kraken: 'Yes', competitor: 'Yes' },
      { label: 'JD + resume context', kraken: 'Yes', competitor: 'Yes' },
      TRIAL_ROW,
    ],
    faqs: [
      {
        q: 'Is Kraken Interview cheaper than Final Round AI?',
        a: 'Kraken Pro Monthly is $54 vs Final Round AI’s publicly listed ~$90. Pricing changes, so verify on each site before subscribing.',
      },
    ],
  },
  {
    slug: 'cluely-alternative',
    competitor: 'Cluely',
    title: 'The Best Cluely Alternative for Technical Interviews in 2026',
    description:
      'A Cluely alternative purpose-built for technical interviews: coding, Mermaid system design, and behavioral STAR — invisible on screen share, from $24/week. Free trial.',
    tagline: 'Purpose-built for technical interviews — coding, system design, and behavioral in one overlay.',
    whySwitch: [
      'Interview-specific by design: coding, system design (Mermaid), and behavioral STAR in one tool.',
      'Job-description + resume context so answers match the role and your background.',
      'Works across 18+ coding platforms and every major video call.',
      'One-time 30-minute free trial per device, Pro from $24/week.',
    ],
    rows: [
      { label: 'Interview focus', kraken: 'Dedicated interview copilot', competitor: 'General-purpose assistant', krakenWins: true },
      { label: 'Coding interviews', kraken: 'Unlimited on Pro', competitor: 'General help' },
      ...COVERAGE_ROWS,
      TRIAL_ROW,
    ],
    faqs: [
      {
        q: 'Is Kraken Interview a good Cluely alternative for interviews?',
        a: 'Yes — where Cluely is a general-purpose assistant, Kraken Interview is purpose-built for technical interviews with coding, Mermaid system-design diagrams, behavioral STAR, and JD + resume context.',
      },
    ],
  },
]

export function getAlternative(slug: string | undefined): Alternative | undefined {
  return ALTERNATIVES.find((item) => item.slug === slug)
}
