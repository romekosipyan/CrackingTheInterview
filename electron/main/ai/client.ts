import type { InterviewCategory, InterviewSession, SolveMode } from '@shared/types'
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
  transcriptOnly: boolean
}

export type StreamHandlers = {
  onChunk: (delta: string, content: string) => void
}

let abortController: AbortController | null = null
let conversation: ChatMessage[] = []

const INPUT_REQUIRED_MSG =
  'Provide at least a screenshot (Alt+S) or voice transcript (Alt+B) before solving.'

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

function buildFastSystemPrompt(ctx: PromptContext): string {
  const resumeBlock = resumeContextBlock(ctx.resumeText)
  const isCoding = ctx.interviewCategory === 'coding'

  const transcriptRules = ctx.transcriptOnly
    ? `
Transcript-only interview mode (no screenshot):
- Extract the interviewer's latest question or prompt from the transcript.
- Write the answer the CANDIDATE should give, in first person (I/me/my).
- Do NOT describe, summarize, or restate what was asked — provide the actual spoken answer.
- For introductions ("tell me about yourself"), behavioral questions, or background questions, use the resume/CV when available.
- Keep answers concise and natural for speaking aloud (roughly 30–90 seconds unless a longer answer is clearly needed).
- If the transcript is only small talk or unclear, answer the most recent plausible interview question you can infer.`
    : ''

  return `You are a fast interview copilot. Respond in ${ctx.interviewLanguage}.${resumeBlock}

Rules:
- Be accurate. Do NOT invent facts not supported by the screenshot, transcript, or resume.
- When a screenshot is attached, analyze it carefully — assume a question IS visible unless the image is blank.
- Only if there is truly no screenshot and no transcript, respond with: ## Status\\nWaiting for a screenshot or voice transcript.
- Use markdown only. No JSON.
${transcriptRules}

${isCoding ? `For CODING tasks (write/implement/debug code):
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
  const resumeBlock = resumeContextBlock(ctx.resumeText)
  const isCoding = ctx.interviewCategory === 'coding'

  const transcriptRules = ctx.transcriptOnly
    ? `
Transcript-only interview mode:
- Answer as the candidate in first person.
- Do not restate the question — provide the full answer.
- Use the resume/CV for introductions and experience questions when available.`
    : ''

  return `You are an expert interview copilot. Respond in ${ctx.interviewLanguage}.${resumeBlock}

Rules:
- Be thorough and accurate. Do NOT hallucinate constraints or resume facts.
- If no clear question exists, respond with exactly: ## Status\\nWaiting for a screenshot or voice transcript.
- Use markdown only. No JSON.
${transcriptRules}

Required sections (use these exact headings):
${ctx.transcriptOnly && !isCoding ? `## Answer
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
  transcriptOnly: boolean
): PromptContext {
  return {
    programmingLanguage: session.programmingLanguage,
    interviewLanguage: session.interviewLanguage,
    interviewCategory: session.interviewCategory,
    generalCategory: session.generalCategory,
    resumeText: getResumeText() || undefined,
    transcriptOnly
  }
}

function buildUserText(
  transcript: string | undefined,
  screenshotCount: number,
  isContinuation: boolean
): string {
  if (isContinuation && transcript) {
    return `Additional voice transcript since the last answer:\n${transcript}\n\nUpdate or refine your previous answer using this new information. Answer as the candidate in first person — do not describe the question.`
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
  handlers: StreamHandlers
): Promise<string> {
  const settings = getAiConfig()
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is not configured.')
  }

  stopAiRequest()
  abortController = new AbortController()

  const model = mode === 'deep' ? settings.deepModel : settings.fastModel
  const maxTokens = mode === 'deep' ? 4096 : 2048

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
  handlers: StreamHandlers
): Promise<{ content: string; status: 'waiting' | 'solved' }> {
  const hasTranscript = Boolean(transcript?.trim())
  const hasScreenshots = screenshots.length > 0
  const transcriptOnly = hasTranscript && !hasScreenshots
  const ctx = promptContextFromSession(session, transcriptOnly)
  const isContinuation = hasActiveConversation() && !hasScreenshots && hasTranscript

  if (!hasScreenshots && !hasTranscript) {
    throw new Error(INPUT_REQUIRED_MSG)
  }

  if (isContinuation) {
    conversation.push({
      role: 'user',
      content: buildUserText(transcript, 0, true)
    })
  } else {
    const systemPrompt = mode === 'fast' ? buildFastSystemPrompt(ctx) : buildDeepSystemPrompt(ctx)
    const imageDetail = 'auto'

    conversation = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: buildUserMessageContent(
          buildUserText(transcript, screenshots.length, false),
          screenshots,
          imageDetail
        )
      }
    ]
  }

  const content = await streamCompletion(conversation, mode, handlers)
  return { content, status: detectStatus(content, hasScreenshots, hasTranscript) }
}

export async function runStreamFollowUp(
  question: string,
  session: InterviewSession,
  mode: SolveMode,
  handlers: StreamHandlers
): Promise<{ content: string; status: 'waiting' | 'solved' }> {
  if (!hasActiveConversation()) {
    throw new Error('No active conversation. Capture input and solve first.')
  }

  conversation.push({
    role: 'user',
    content: `Follow-up: ${question}\nRespond in ${session.interviewLanguage}. Answer as the candidate in first person when appropriate.`
  })

  const content = await streamCompletion(conversation, mode, handlers)
  return { content, status: detectStatus(content, false, true) }
}
