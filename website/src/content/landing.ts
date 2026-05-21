export type PlatformBrand = {
  name: string
  /** Simple Icons slug — https://simpleicons.org */
  icon?: string
  color: string
}

export const CODING_PLATFORMS: PlatformBrand[] = [
  { name: 'LeetCode', icon: 'leetcode', color: '#FFA116' },
  { name: 'HackerRank', icon: 'hackerrank', color: '#00EA64' },
  { name: 'CodeSignal', icon: 'codesignal', color: '#006AFF' },
  { name: 'CoderPad', icon: 'coderpad', color: '#FF6B35' },
  { name: 'Codility', icon: 'codility', color: '#0081FF' },
  { name: 'Karat', color: '#7C3AED' },
  { name: 'TestGorilla', icon: 'testgorilla', color: '#FF4F00' },
  { name: 'HackerEarth', icon: 'hackerearth', color: '#2C3454' },
  { name: 'CodePen', icon: 'codepen', color: '#47CF73' },
  { name: 'Replit', icon: 'replit', color: '#F26207' }
]

export const MEETING_PLATFORMS: PlatformBrand[] = [
  { name: 'Zoom', icon: 'zoom', color: '#0B5CFF' },
  { name: 'Microsoft Teams', icon: 'microsoftteams', color: '#6264A7' },
  { name: 'Google Meet', icon: 'googlemeet', color: '#00897B' },
  { name: 'Webex', icon: 'webex', color: '#00BCF2' },
  { name: 'Slack', icon: 'slack', color: '#4A154B' },
  { name: 'Discord', icon: 'discord', color: '#5865F2' },
  { name: 'Whereby', icon: 'whereby', color: '#FFC700' },
  { name: 'Amazon Chime', icon: 'amazonaws', color: '#FF9900' }
]

/** Drop your demo clips in website/public/videos/ with these filenames. */
export const DEMO_VIDEOS = {
  youScreensharing: import.meta.env.VITE_DEMO_VIDEO_YOU ?? '/videos/you-screensharing.mp4',
  interviewerView: import.meta.env.VITE_DEMO_VIDEO_INTERVIEWER ?? '/videos/interviewer-view.mp4'
} as const

export const SYSTEM_DESIGN_VIDEO =
  import.meta.env.VITE_DEMO_VIDEO_SYSTEM_DESIGN ?? '/videos/system-design.mp4'

export const SYSTEM_DESIGN_HIGHLIGHTS = [
  {
    icon: '◈',
    title: 'Structured deep answers',
    body: 'Requirements, API design, data model, scaling path, and failure modes — not a wall of buzzwords.'
  },
  {
    icon: '◇',
    title: 'Mermaid architecture diagrams',
    body: 'Visual boxes and arrows you can walk the interviewer through while you screenshare the problem.'
  },
  {
    icon: '◎',
    title: 'Voice + screen context',
    body: 'Capture the whiteboard prompt and the interviewer’s follow-ups — Kraken adapts as the round evolves.'
  },
  {
    icon: '⚡',
    title: 'Auto mode ready',
    body: 'Let the copilot watch the screen and listen — deep solves fire when the question or diagram changes.'
  }
] as const

export const LANDING_FEATURES = [
  {
    icon: '👁',
    title: 'Screenshare-proof',
    body: 'The overlay uses capture exclusion on Windows 10 2004+ so it stays off the shared screen pipeline.',
    span: 'large' as const
  },
  {
    icon: '⌨',
    title: 'Undetectable hotkeys',
    body: 'Capture, record, quick answer, and deep answer — all from the keyboard without switching tabs.'
  },
  {
    icon: '◈',
    title: 'Structured output',
    body: 'Clear answers with follow-up depth for coding, system design diagrams, and behavioral STAR responses.'
  },
  {
    icon: '◎',
    title: 'Multimodal reasoning',
    body: 'Screen capture plus optional voice input — the copilot reads the full question context before answering.'
  },
  {
    icon: '◉',
    title: 'Job-description aware',
    body: 'Paste a JD URL and upload your resume so answers match the role, stack, and company.'
  },
  {
    icon: '⚡',
    title: 'Every interview round',
    body: 'Coding, system design with Mermaid diagrams, and behavioral — not just LeetCode grinding.',
    span: 'large' as const
  }
]

export const HERO_STATS = [
  { value: '100%', label: 'Invisible on screen share' },
  { value: '18+', label: 'Platforms supported' },
  { value: '$15', label: 'Less than competitors' }
] as const

export const TESTIMONIALS = [
  {
    quote:
      'The hotkey flow felt natural during a system design round. Structured answers let me focus on communication, not panic.',
    role: 'Senior Engineer',
    company: 'FAANG'
  },
  {
    quote:
      'JD context actually mattered — answers referenced the job posting stack instead of generic textbook responses.',
    role: 'Full-stack Developer',
    company: 'Series B startup'
  },
  {
    quote:
      'I was skeptical about screen share invisibility. The interviewer view demo sold me — nothing suspicious on their side.',
    role: 'New grad',
    company: 'Big Tech'
  }
] as const

export const FAQ_ITEMS = [
  {
    q: 'Is Kraken Interview detectable during screen share?',
    a: 'On Windows 10 2004+ and Windows 11, the overlay uses capture exclusion so it is omitted from most screen-share pipelines — Zoom, Teams, Meet, and coding platforms.'
  },
  {
    q: 'What interview types are supported?',
    a: 'Coding, system design (with Mermaid diagrams), behavioral STAR answers, and general no-code rounds — with optional job-description context.'
  },
  {
    q: 'Do I need an account?',
    a: 'No signup for the desktop app. Subscribe on the website, download the app, and look up your plan anytime by email.'
  },
  {
    q: 'How is pricing compared to other copilots?',
    a: 'Pro plans start at $24/week — $15 less than leading competitors on equivalent tiers.'
  }
] as const
