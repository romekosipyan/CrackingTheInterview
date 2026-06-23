import type { InterviewCategory, InterviewSession, SolveMode } from '@shared/types'
import { isSystemDesignSession, localizeHotkeyText } from '@shared/types'
import type { PlanEntitlements } from '@shared/subscriptionEntitlements'
import { getEntitlements } from '@shared/subscriptionEntitlements'
import { getAiConfig } from '../aiConfig'
import { getResumeText } from '../resume'

type ChatMessage =
  | { role: 'system'; content: string }
  | {
      role: 'user'
      content:
        | string
        | Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }>
    }
  | { role: 'assistant'; content: string }

type PromptContext = {
  programmingLanguage: string
  interviewLanguage: string
  interviewCategory: InterviewCategory
  generalCategory?: string
  resumeText?: string
  jobDescriptionText?: string
  transcriptOnly: boolean
  entitlements: PlanEntitlements
}

export type StreamHandlers = {
  onChunk: (delta: string, content: string) => void
}

let abortController: AbortController | null = null
let conversation: ChatMessage[] = []

const INPUT_REQUIRED_MSG = localizeHotkeyText(
  'Provide at least a screenshot (Alt+S) or voice transcript (Alt+B) before solving.'
)

export function stopAiRequest(): void {
  abortController?.abort()
  abortController = null
}

export function clearConversation(): void {
  conversation = []
}

export function hasActiveConversation(): boolean {
  return conversation.some((message) => message.role === 'assistant')
}

function resumeContextBlock(resumeText?: string): string {
  if (!resumeText?.trim()) return ''
  return `\nCandidate resume/CV (stored locally on device — use for behavioral, introduction, and experience answers; do not invent facts not in the resume):\n${resumeText.trim()}`
}

function jobDescriptionContextBlock(jobDescriptionText?: string): string {
  if (!jobDescriptionText?.trim()) return ''
  return `\nJob description (scraped from the URL provided at session start — use to tailor answers to the role, company, responsibilities, tech stack, and requirements; do not invent requirements not listed):\n${jobDescriptionText.trim()}`
}

function interviewContextBlock(ctx: PromptContext): string {
  if (!ctx.entitlements.jdResumeContext) return ''
  const resumeBlock = ctx.interviewCategory === 'coding' ? '' : resumeContextBlock(ctx.resumeText)
  return `${resumeBlock}${jobDescriptionContextBlock(ctx.jobDescriptionText)}`
}

function isSystemDesignInterview(ctx: PromptContext): boolean {
  return ctx.entitlements.systemDesignDiagrams && isSystemDesignSession(ctx)
}

const MERMAID_BLOCK_PATTERN = /```mermaid[\s\S]*?```/i

function hasMermaidDiagram(content: string): boolean {
  return MERMAID_BLOCK_PATTERN.test(content)
}

function systemDesignDiagramRules(): string {
  return `
MANDATORY DIAGRAM RULE (never skip):
- You MUST include section ## Architecture Diagram with a fenced \`\`\`mermaid block.
- The app renders this block as a visual diagram for the candidate — text-only architecture answers are incomplete.
- Use flowchart TB or flowchart LR with 5–12 labeled nodes (Client, API, DB, Cache, Queue, CDN, etc.).
- Example format:
## Architecture Diagram
\`\`\`mermaid
flowchart TB
  Client[Mobile App] --> LB[Load Balancer]
  LB --> API[API Service]
  API --> Cache[(Redis)]
  API --> DB[(PostgreSQL)]
\`\`\``
}

function buildSystemDesignFastSections(): string {
  return `SYSTEM DESIGN MODE — architecture interview copilot.

Required sections (exact headings, in this order):
## Answer
Concise first-person spoken answer covering requirements, high-level approach, and key trade-offs.

## Architecture Diagram
\`\`\`mermaid
flowchart TB
  ...required visual diagram...
\`\`\`

## Trade-offs
Brief bullets on the main design decisions.

${systemDesignDiagramRules()}`
}

function buildSystemDesignDeepSections(transcriptOnly: boolean): string {
  if (transcriptOnly) {
    return `## Answer
Detailed first-person answer the candidate should give.

## Assumptions
## Architecture Diagram
\`\`\`mermaid
flowchart TB
  ...required visual diagram...
\`\`\`
## Components
## Data flow
## Trade-offs
## Scaling & failure modes

${systemDesignDiagramRules()}`
  }

  return `## Problem Restatement
## Assumptions
## Strategy
## Architecture Diagram
\`\`\`mermaid
flowchart TB
  ...required visual diagram...
\`\`\`
## Components
## Data flow
## Trade-offs
## Scaling & failure modes

${systemDesignDiagramRules()}`
}

function systemDesignUserHint(): string {
  return 'System design session: include a rendered architecture diagram in ## Architecture Diagram using a ```mermaid code block.'
}

function systemDesignContinuationHint(): string {
  return 'Keep or update the ## Architecture Diagram section with a valid ```mermaid block reflecting any changes.'
}

function mergeDiagramIntoContent(original: string, diagramResponse: string): string {
  const mermaidMatch = diagramResponse.match(/```mermaid([\s\S]*?)```/i)
  if (!mermaidMatch) return original

  const diagramSection = `## Architecture Diagram\n\`\`\`mermaid${mermaidMatch[1]}\`\`\``

  if (/## Architecture Diagram/i.test(original)) {
    return original.replace(/## Architecture Diagram[\s\S]*?(?=\n## |\s*$)/i, diagramSection)
  }

  if (/## Trade-offs/i.test(original)) {
    return original.replace(/(?=## Trade-offs)/i, `${diagramSection}\n\n`)
  }

  if (/## Scaling/i.test(original)) {
    return original.replace(/(?=## Scaling)/i, `${diagramSection}\n\n`)
  }

  return `${original.trimEnd()}\n\n${diagramSection}`
}

async function ensureSystemDesignDiagram(
  session: InterviewSession,
  mode: SolveMode,
  content: string,
  handlers: StreamHandlers,
  entitlements: PlanEntitlements
): Promise<string> {
  if (
    !entitlements.systemDesignDiagrams ||
    !isSystemDesignSession(session) ||
    hasMermaidDiagram(content)
  ) {
    return content
  }

  conversation.push({
    role: 'user',
    content:
      'Your previous answer is missing the required ## Architecture Diagram section with a ```mermaid code block. Reply with ONLY that section and a valid Mermaid flowchart for the system you described. No other sections or commentary.'
  })

  const diagramResponse = await streamCompletion(
    conversation,
    mode,
    {
      onChunk: (delta, diagramFull) => {
        handlers.onChunk(delta, mergeDiagramIntoContent(content, diagramFull))
      }
    },
    { isSystemDesign: true }
  )

  const merged = mergeDiagramIntoContent(content, diagramResponse)

  conversation.pop()
  conversation.pop()
  conversation.pop()
  conversation.push({ role: 'assistant', content: merged })

  return merged
}

function buildFastSystemPrompt(ctx: PromptContext): string {
  const contextBlock = interviewContextBlock(ctx)
  const isCoding = ctx.interviewCategory === 'coding'
  const isSystemDesign = isSystemDesignInterview(ctx)

  const transcriptRules = ctx.transcriptOnly
    ? `
Transcript-only interview mode (no screenshot):
- Extract the interviewer's latest question or prompt from the transcript.
- Write the answer the CANDIDATE should give, in first person (I/me/my).
- Do NOT describe, summarize, or restate what was asked — provide the actual spoken answer.
- For introductions ("tell me about yourself"), behavioral questions, or background questions, use the resume/CV and job description when available.
- Keep answers concise and natural for speaking aloud (roughly 30–90 seconds unless a longer answer is clearly needed).
- If the transcript is only small talk or unclear, answer the most recent plausible interview question you can infer.`
    : ''

  return `You are a fast interview copilot. Respond in ${ctx.interviewLanguage}.${contextBlock}
${isSystemDesign ? '\nYou are in SYSTEM DESIGN mode. Every answer MUST include a ## Architecture Diagram section with a ```mermaid block.' : ''}

Rules:
- Be accurate. Do NOT invent facts not supported by the screenshot, transcript, resume, or job description.
- When a screenshot is attached, analyze it carefully — assume a question IS visible unless the image is blank.
- Only if there is truly no screenshot and no transcript, respond with: ## Status\\nWaiting for a screenshot or voice transcript.
- Use markdown only. No JSON.
${transcriptRules}

${isSystemDesign ? buildSystemDesignFastSections() : isCoding ? `For CODING tasks (write/implement/debug code):
## Answer
Brief explanation (2-4 sentences) of the approach.

## Solution
\`\`\`${ctx.programmingLanguage}
complete working code
\`\`\`

For NON-CODING questions (conceptual, behavioral, yes/no, introductions):
## Answer
Direct answer the candidate should say. First person. No meta-commentary about the question.` : `For general/non-coding interviews:
## Answer
Structured answer in first person that the candidate can speak aloud.`}

Transcript text (if any) supplements screenshots — treat it as additional context on top of images.`
}

function buildDeepSystemPrompt(ctx: PromptContext): string {
  const contextBlock = interviewContextBlock(ctx)
  const isCoding = ctx.interviewCategory === 'coding'
  const isSystemDesign = isSystemDesignInterview(ctx)

  const transcriptRules = ctx.transcriptOnly
    ? `
Transcript-only interview mode:
- Answer as the candidate in first person.
- Do not restate the question — provide the full answer.
- Use the resume/CV and job description for introductions and experience questions when available.`
    : ''

  return `You are an expert interview copilot. Respond in ${ctx.interviewLanguage}.${contextBlock}
${isSystemDesign ? '\nYou are in SYSTEM DESIGN mode. Every answer MUST include a ## Architecture Diagram section with a ```mermaid block.' : ''}

Rules:
- Be thorough and accurate. Do NOT hallucinate constraints, resume facts, or job requirements.
- If no clear question exists, respond with exactly: ## Status\\nWaiting for a screenshot or voice transcript.
- Use markdown only. No JSON.
${transcriptRules}

Required sections (use these exact headings):
${isSystemDesign ? buildSystemDesignDeepSections(ctx.transcriptOnly) : ctx.transcriptOnly && !isCoding ? `## Answer
Detailed first-person answer the candidate should give.` : `## Problem Restatement
## Assumptions
## Strategy
## Complexity
Time: ...
Space: ...
${isCoding ? `## Implementation
\`\`\`${ctx.programmingLanguage}
complete working code
\`\`\`` : `## Answer
Detailed structured answer.`}`}

Transcript supplements screenshots as additional context.`
}

function promptContextFromSession(
  session: InterviewSession,
  transcriptOnly: boolean,
  entitlements: PlanEntitlements
): PromptContext {
  return {
    programmingLanguage: session.programmingLanguage,
    interviewLanguage: session.interviewLanguage,
    interviewCategory: session.interviewCategory,
    generalCategory: session.generalCategory,
    resumeText: entitlements.jdResumeContext ? getResumeText() || undefined : undefined,
    jobDescriptionText: entitlements.jdResumeContext ? session.jobDescriptionText : undefined,
    transcriptOnly,
    entitlements
  }
}

function buildUserText(
  transcript: string | undefined,
  screenshotCount: number,
  isContinuation: boolean,
  isSystemDesign: boolean
): string {
  if (isContinuation && transcript) {
    const parts = [
      `Additional voice transcript since the last answer:\n${transcript}`,
      'Update or refine your previous answer using this new information. Answer as the candidate in first person — do not describe the question.'
    ]
    if (isSystemDesign) {
      parts.push(systemDesignContinuationHint())
    }
    return parts.join('\n\n')
  }

  const parts: string[] = []
  if (transcript) {
    parts.push(`Voice transcript (system audio + microphone):\n${transcript}`)
    if (screenshotCount === 0) {
      parts.push(
        'This is a transcript-only input. Identify the interviewer\'s question and write the candidate\'s spoken answer in first person.'
      )
    }
  }
  if (screenshotCount > 0) {
    parts.push(
      screenshotCount === 1
        ? 'Analyze the attached screenshot.'
        : `Analyze the ${screenshotCount} attached screenshots together.`
    )
  }
  if (transcript && screenshotCount > 0) {
    parts.push('Use transcript as additional context on top of the screenshot(s).')
  }
  if (isSystemDesign) {
    parts.push(systemDesignUserHint())
  }
  return parts.join('\n\n')
}

function buildUserMessageContent(
  userText: string,
  screenshotDataUrls: string[],
  imageDetail: 'low' | 'auto'
): ChatMessage['content'] {
  if (screenshotDataUrls.length === 0) return userText

  const parts: Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }> =
    [{ type: 'text', text: userText }]

  for (const url of screenshotDataUrls) {
    parts.push({ type: 'image_url', image_url: { url, detail: imageDetail } })
  }

  return parts
}

function detectStatus(
  content: string,
  hadScreenshots: boolean,
  hadTranscript: boolean
): 'waiting' | 'solved' {
  const normalized = content.toLowerCase().trim()
  const isExplicitWait =
    normalized.includes('waiting for a screenshot') ||
    normalized.includes('waiting for question') ||
    (normalized.startsWith('## status') && normalized.includes('waiting'))

  if (isExplicitWait && !hadScreenshots && !hadTranscript) return 'waiting'
  if (isExplicitWait && (hadScreenshots || hadTranscript) && normalized.length < 120) return 'waiting'
  return 'solved'
}

async function streamCompletion(
  messages: ChatMessage[],
  mode: SolveMode,
  handlers: StreamHandlers,
  options?: { maxTokens?: number; isSystemDesign?: boolean }
): Promise<string> {
  const settings = getAiConfig()
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is not configured.')
  }

  stopAiRequest()
  abortController = new AbortController()

  const model = mode === 'deep' ? settings.deepModel : settings.fastModel
  const isSystemDesign = options?.isSystemDesign ?? false
  const maxTokens =
    options?.maxTokens ??
    (isSystemDesign
      ? mode === 'deep'
        ? 6144
        : 4096
      : mode === 'deep'
        ? 4096
        : 2048)

  const response = await fetch(`${settings.apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: maxTokens,
      temperature: mode === 'deep' ? 0.2 : 0,
      messages
    }),
    signal: abortController.signal
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`AI request failed (${response.status}): ${body}`)
  }

  if (!response.body) throw new Error('Empty AI stream response')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') continue

      try {
        const parsed = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>
        }
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) {
          full += delta
          handlers.onChunk(delta, full)
        }
      } catch {
        // ignore malformed SSE chunks
      }
    }
  }

  conversation.push({ role: 'assistant', content: full })
  return full
}

export async function runStreamSolve(
  session: InterviewSession,
  mode: SolveMode,
  screenshots: string[],
  transcript: string | undefined,
  handlers: StreamHandlers,
  options?: { entitlements?: PlanEntitlements }
): Promise<{ content: string; status: 'waiting' | 'solved' }> {
  const entitlements = options?.entitlements ?? getEntitlements('lifetime')
  const hasTranscript = Boolean(transcript?.trim())
  const hasScreenshots = screenshots.length > 0
  const transcriptOnly = hasTranscript && !hasScreenshots
  const ctx = promptContextFromSession(session, transcriptOnly, entitlements)
  const isContinuation = hasActiveConversation() && !hasScreenshots && hasTranscript
  const isSystemDesign = isSystemDesignInterview(ctx)

  if (!hasScreenshots && !hasTranscript) {
    throw new Error(INPUT_REQUIRED_MSG)
  }

  if (isContinuation) {
    conversation.push({
      role: 'user',
      content: buildUserText(transcript, 0, true, isSystemDesign)
    })
  } else {
    const systemPrompt = mode === 'fast' ? buildFastSystemPrompt(ctx) : buildDeepSystemPrompt(ctx)
    const imageDetail = 'auto'

    conversation = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: buildUserMessageContent(
          buildUserText(transcript, screenshots.length, false, isSystemDesign),
          screenshots,
          imageDetail
        )
      }
    ]
  }

  let content = await streamCompletion(conversation, mode, handlers, { isSystemDesign })
  content = await ensureSystemDesignDiagram(session, mode, content, handlers, entitlements)
  return { content, status: detectStatus(content, hasScreenshots, hasTranscript) }
}

export async function runStreamFollowUp(
  question: string,
  session: InterviewSession,
  mode: SolveMode,
  handlers: StreamHandlers,
  options?: { entitlements?: PlanEntitlements }
): Promise<{ content: string; status: 'waiting' | 'solved' }> {
  if (!hasActiveConversation()) {
    throw new Error('No active conversation. Capture input and solve first.')
  }

  const entitlements = options?.entitlements ?? getEntitlements('lifetime')
  const ctx = promptContextFromSession(session, true, entitlements)
  const isSystemDesign = isSystemDesignInterview(ctx)
  const followUpParts = [
    `Follow-up: ${question}`,
    `Respond in ${session.interviewLanguage}. Answer as the candidate in first person when appropriate.`
  ]
  if (isSystemDesign) {
    followUpParts.push(systemDesignContinuationHint())
  }

  conversation.push({
    role: 'user',
    content: followUpParts.join('\n')
  })

  let content = await streamCompletion(conversation, mode, handlers, { isSystemDesign })
  content = await ensureSystemDesignDiagram(session, mode, content, handlers, entitlements)
  return { content, status: detectStatus(content, false, true) }
}
