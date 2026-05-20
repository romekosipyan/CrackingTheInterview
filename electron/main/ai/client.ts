import { z } from 'zod'
import type { SolveMode, SolveResponse } from '@shared/types'
import { getSettings } from '../store'

const solveResponseSchema = z.object({
  status: z.enum(['waiting', 'solved']),
  problemSummary: z.string(),
  approach: z.string(),
  complexity: z.object({
    time: z.string(),
    space: z.string()
  }),
  code: z.object({
    language: z.string(),
    solution: z.string()
  }),
  edgeCases: z.array(z.string()),
  followUpQuestions: z.array(z.string())
})

type ChatMessage =
  | { role: 'system'; content: string }
  | {
      role: 'user'
      content:
        | string
        | Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }>
    }
  | { role: 'assistant'; content: string }

let abortController: AbortController | null = null
let conversation: ChatMessage[] = []

export function stopAiRequest(): void {
  abortController?.abort()
  abortController = null
}

export function clearConversation(): void {
  conversation = []
}

function buildSystemPrompt(
  programmingLanguage: string,
  interviewLanguage: string,
  mode: SolveMode
): string {
  if (mode === 'fast') {
    return `You are a coding interview copilot. Code in ${programmingLanguage}. Text fields in ${interviewLanguage}.
Return ONLY valid JSON. Be concise but complete.

Carefully read the screenshot and any interview audio transcript for ANY coding problem.

Prefer status "solved" when the transcript or screenshot contains a coding question — only use "waiting" if neither source has one.

Schema:
{"status":"waiting"|"solved","problemSummary":string,"approach":string,"complexity":{"time":string,"space":string},"code":{"language":string,"solution":string},"edgeCases":string[],"followUpQuestions":string[]}

If waiting: brief screen description, approach "Waiting for question", complexity "N/A", code "// waiting", edgeCases [], followUpQuestions ["Capture when problem visible"].

If solved: problemSummary (1-2 lines), approach (brief), complexity, complete working code, edgeCases (max 3), followUpQuestions [].`
  }

  return `You are an expert coding interview copilot.
Programming language: ${programmingLanguage}
Respond in ${interviewLanguage} for all text fields except code.
Think step-by-step internally, then return only valid JSON with thorough approach and edge cases.

Use the interview audio transcript as the primary question source when provided. Also use the screenshot for additional context.

First decide whether a coding interview question is present in the transcript and/or screenshot (LeetCode/HackerRank/CoderPad/problem statement, IDE with a defined task, shared doc with a coding prompt, etc.).

If NO interview question is detected:
- Set "status" to "waiting"
- "problemSummary": briefly describe what is visible on screen (apps, windows, page, partial text)
- "approach": explain that no interview question was detected yet and you are standing by; tell the user to capture again when the problem appears
- "complexity": { "time": "N/A", "space": "N/A" }
- "code": { "language": "${programmingLanguage}", "solution": "// Waiting for interview question..." }
- "edgeCases": []
- "followUpQuestions": ["Capture again when the problem statement is visible"]

If a question IS detected:
- Set "status" to "solved"
- Provide a complete interview-ready solution in ${programmingLanguage}

Always return valid JSON. Never refuse, apologize, or return an error message outside the JSON schema.

Return ONLY valid JSON matching this schema:
{
  "status": "waiting" | "solved",
  "problemSummary": string,
  "approach": string,
  "complexity": { "time": string, "space": string },
  "code": { "language": string, "solution": string },
  "edgeCases": string[],
  "followUpQuestions": string[]
}`
}

function extractJsonPayload(raw: string): unknown {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
    if (fenced) return JSON.parse(fenced[1].trim())

    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1))

    throw new Error('AI returned invalid JSON')
  }
}

function normalizeSolvePayload(parsed: unknown, programmingLanguage: string): unknown {
  if (!parsed || typeof parsed !== 'object') return parsed

  const value = parsed as Record<string, unknown>
  const complexity =
    value.complexity && typeof value.complexity === 'object'
      ? (value.complexity as Record<string, unknown>)
      : {}
  const code =
    value.code && typeof value.code === 'object' ? (value.code as Record<string, unknown>) : {}

  return {
    status: value.status === 'waiting' ? 'waiting' : 'solved',
    problemSummary: typeof value.problemSummary === 'string' ? value.problemSummary : '',
    approach: typeof value.approach === 'string' ? value.approach : '',
    complexity: {
      time: typeof complexity.time === 'string' ? complexity.time : 'N/A',
      space: typeof complexity.space === 'string' ? complexity.space : 'N/A'
    },
    code: {
      language: typeof code.language === 'string' ? code.language : programmingLanguage,
      solution: typeof code.solution === 'string' ? code.solution : '// No solution'
    },
    edgeCases: Array.isArray(value.edgeCases)
      ? value.edgeCases.filter((item): item is string => typeof item === 'string')
      : [],
    followUpQuestions: Array.isArray(value.followUpQuestions)
      ? value.followUpQuestions.filter((item): item is string => typeof item === 'string')
      : []
  }
}

async function requestCompletion(
  messages: ChatMessage[],
  mode: SolveMode,
  programmingLanguage: string,
  allowRetry = true
): Promise<SolveResponse> {
  const settings = getSettings()
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is not configured in Settings.')
  }

  stopAiRequest()
  abortController = new AbortController()

  const model = mode === 'deep' ? settings.deepModel : settings.fastModel
  const maxTokens = mode === 'deep' ? 4096 : allowRetry ? 1024 : 2048

  const response = await fetch(`${settings.apiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
      temperature: mode === 'deep' ? 0.3 : 0,
      messages
    }),
    signal: abortController.signal
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`AI request failed (${response.status}): ${body}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty AI response')

  try {
    const parsed = normalizeSolvePayload(extractJsonPayload(content), programmingLanguage)
    const result = solveResponseSchema.parse(parsed)
    conversation.push({ role: 'assistant', content })
    return result
  } catch (error) {
    if (!allowRetry) throw error

    conversation.push({ role: 'assistant', content })
    conversation.push({
      role: 'user',
      content:
        'Your previous response was invalid or truncated JSON. Return ONLY valid JSON matching the schema with all required fields. No markdown fences or extra text.'
    })

    return requestCompletion(conversation, mode, programmingLanguage, false)
  }
}

function buildSolveUserText(
  mode: SolveMode,
  transcript: string | undefined,
  hasScreenshot: boolean
): string {
  if (transcript && hasScreenshot) {
    return mode === 'fast'
      ? `Interview audio transcript (primary question source):\n${transcript}\n\nAlso analyze the screenshot for extra context. Solve the coding question with status "solved" if either source contains one.`
      : `Interview audio transcript (primary question source):\n${transcript}\n\nAlso analyze the screenshot for additional context. If a coding interview question is present in either source, solve it.`
  }

  if (transcript) {
    return mode === 'fast'
      ? `Interview audio transcript:\n${transcript}\n\nSolve the coding interview question from this transcript. Use status "solved" if a coding question is present, otherwise "waiting".`
      : `Interview audio transcript:\n${transcript}\n\nSolve the coding interview question described in the transcript. Use status "solved" if a coding question is present, otherwise "waiting".`
  }

  if (mode === 'fast') {
    return 'Analyze the screenshot carefully. If any coding interview question is visible (even partial), solve it with status "solved". Only use "waiting" if no coding question is visible.'
  }

  return 'Analyze the screenshot. If there is a coding interview question, solve it. If not, describe what you see and indicate you are waiting for the question.'
}

function buildUserMessageContent(
  userText: string,
  screenshotDataUrl: string
): ChatMessage['content'] {
  if (!screenshotDataUrl) return userText

  return [
    { type: 'text', text: userText },
    { type: 'image_url', image_url: { url: screenshotDataUrl, detail: 'auto' } }
  ]
}

export async function solveFromScreenshot(
  screenshotDataUrl: string,
  programmingLanguage: string,
  interviewLanguage: string,
  mode: SolveMode,
  transcript?: string
): Promise<SolveResponse> {
  clearConversation()

  const hasScreenshot = Boolean(screenshotDataUrl)
  const userText = buildSolveUserText(mode, transcript, hasScreenshot)

  conversation = [
    {
      role: 'system',
      content: buildSystemPrompt(programmingLanguage, interviewLanguage, mode)
    },
    {
      role: 'user',
      content: buildUserMessageContent(userText, screenshotDataUrl)
    }
  ]

  return requestCompletion(conversation, mode, programmingLanguage)
}

export async function solveFollowUp(
  question: string,
  programmingLanguage: string,
  interviewLanguage: string,
  mode: SolveMode
): Promise<SolveResponse> {
  if (conversation.length === 0) {
    throw new Error('No active conversation. Capture a screenshot and solve first.')
  }

  conversation.push({
    role: 'user',
    content: `Follow-up question: ${question}\nRespond in ${interviewLanguage}. Update the solution if needed. Return the same JSON schema with status "solved" if answering a coding question, otherwise "waiting".`
  })

  return requestCompletion(conversation, mode, programmingLanguage)
}
