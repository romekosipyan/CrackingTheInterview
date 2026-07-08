import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { localizeHotkeyText } from '@shared/types'

const hotkeyPostProcessor = {
  type: 'postProcessor' as const,
  name: 'hotkeys',
  process(value: string): string {
    return localizeHotkeyText(value)
  }
}

const resources = {
  en: {
    translation: {
      appName: 'Kraken Interview',
      appTagline: 'AI interview copilot',
      homeTitle: 'Start your interview session',
      homeSubtitle: 'Set up once, then capture and get AI answers in seconds.',
      homeActivePlan: 'Active plan: {{plan}}',
      homePlanFreeName: 'Free',
      homePlanLoading: 'Checking plan…',
      homePlanFreeNoEmail: 'One-time 30-minute trial on this device · subscribe for unlimited access.',
      homePlanFreeWithEmail: 'Free trial · {{minutes}} minutes remaining on this device (one-time trial).',
      homePlanFreeTrialRemaining: 'Free trial · {{minutes}} min remaining on this device (one-time).',
      homePlanFreeTrialUsed: 'Free trial used on this device · subscribe to continue.',
      homePlanFreeEmailLinked: 'Email linked — subscribe at krakeninterview.com/pricing for unlimited access.',
      homePlanUpgrade: 'View plans',
      homeFeatureJdResumeLocked:
        'Job description and resume context require Pro Monthly or Lifetime. Upgrade to unlock.',
      resumeSectionLocked: 'Resume / CV (Pro Monthly)',
      homeStepConfigure: 'Configure session',
      homeStepCapture: 'Capture question',
      homeStepAnswer: 'Get AI answer',
      overlayWelcomeTitle: 'Ready when you are',
      overlayWelcomeBody:
        'Capture the screen or record the question, then press Quick answer or Deep answer. Shortcuts are shown below.',
      exitHint: 'Alt + Escape · End interview',
      helpSubtitle: 'Keyboard only — your mouse stays free.',
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      greetingNight: 'Good night',
      programmingLanguage: 'Programming language',
      interviewLanguage: 'Interview language',
      interviewCategory: 'Interview category',
      jobDescriptionUrl: 'Job description URL (optional)',
      jobDescriptionUrlHint:
        'Fetched when the session starts and used as context for all interview answers.',
      jobDescriptionLoaded: 'Job description loaded',
      jobDescriptionContext: 'JD Context',
      jobDescriptionContextTitle: 'Job description loaded ({{count}} characters)',
      selectDisplay: 'Display to capture',
      selectDisplayHint: 'The entire screen from the selected monitor will be captured.',
      startInterview: 'Start Interview',
      interviewMode: 'Interview mode',
      interviewModeManual: 'Manual',
      interviewModeAuto: 'Auto',
      interviewModeManualHint:
        'Manual — capture with Alt+S, record with Alt+B, then Quick or Deep answer.',
      interviewModeAutoHint:
        'Auto — records system + mic, captures the screen every 5s, and runs Deep answer when the screen or transcript changes.',
      interviewModeAutoBadge: 'Auto',
      overlayWelcomeAutoBody:
        'Auto mode is running. Recording stays on, the screen is checked every 5 seconds, and Deep answers run when something changes.',
      settings: 'Settings',
      closeApp: 'Close app',
      back: 'Back',
      cancel: 'Cancel',
      basicDetails: 'Basic details',
      name: 'Name',
      email: 'Email',
      defaults: 'Defaults',
      appLanguage: 'App language',
      defaultProgrammingLanguage: 'Default programming language',
      subscription: 'Subscription',
      manageSubscription: 'Manage subscription',
      subscriptionDeviceStatusFree: 'Free tier — no device registration required.',
      subscriptionDeviceStatusPaid:
        'This device is registered ({{count}} of {{max}} devices).',
      subscriptionDeviceStatusBlocked:
        'Device limit reached ({{max}} devices). Remove one at krakeninterview.com/account.',
      subscriptionDeviceStatusUnknown: 'Save your email, then verify your device registration.',
      subscriptionVerifyDevice: 'Verify this device',
      subscriptionDeviceVerified: 'Device verified.',
      apiSettings: 'AI settings',
      apiKey: 'OpenAI API key',
      fastModel: 'Fast model',
      deepModel: 'Deep model',
      save: 'Save',
      saved: 'Settings saved',
      endInterview: 'End Interview',
      fastSolve: 'Quick answer',
      deepSolve: 'Deep answer',
      loading: 'Working…',
      noResult:
        'Capture up to 3 screenshots (Alt+S) or record the question (Alt+B), then Quick or Deep answer.',
      helpTitle: 'Shortcuts',
      sidebar: 'Session',
      recording: 'Recording',
      transcribing: 'Transcribing…',
      transcript: 'Transcript',
      noTranscript:
        'Press Alt+B while the interviewer speaks. Captures system audio + microphone on Windows.',
      transcriptCaptured: '{{count}} characters captured · full text in main panel',
      bothAudio: 'System + Mic',
      inputRequired:
        'Provide at least a screenshot (Alt+S) or voice transcript (Alt+B) before solving.',
      systemAudio: 'System audio',
      microphoneAudio: 'Microphone',
      screenshot: 'Screenshot',
      screenshots: 'Screenshots',
      noScreenshots: 'Alt+S to capture (max 3)',
      screenshotLimit: 'Screenshot limit reached (max 3). Run Quick answer to continue.',
      copyCode: 'Copy code',
      selectRole: 'Select role',
      addRole: 'Add role',
      noRoles: 'No roles yet — add one to personalize AI responses.',
      companyName: 'Company name',
      roleTitle: 'Role title',
      roleDescription: 'Role description (optional)',
      roleRequiredFields: 'Company name and role title are required.',
      errorNoRole: 'Select or add a role before starting.',
      errorNoScreen: 'Select a screen to capture.',
      creditsNote: 'Starting an interview is free. AI usage is included with your subscription.',
      screenShareTitle: 'Before you share your screen',
      screenShareSubtitle: 'This app stays invisible during screen share on Windows 10 2004+.',
      screenShareTip1: 'Share only the interview window (LeetCode, CoderPad, Zoom content) — not your full desktop if possible.',
      screenShareTip2: 'Use hotkeys only — the overlay is click-through so your mouse passes to apps underneath.',
      screenShareTip3: 'Alt+S captures screenshots, Alt+Enter / Alt+Shift+Enter for Quick / Deep answer.',
      screenShareTip4: 'Alt+Escape ends the session. Use the system tray to return to Home.',
      screenShareNote: 'The overlay uses capture exclusion (WDA_EXCLUDEFROMCAPTURE) and should not appear in Zoom, Teams, or OBS.',
      hotkeysOnlyHint: 'Hotkeys only — mouse passes through',
      hotkeyConflict: 'Failed to register hotkeys: {{keys}}. Close conflicting apps.',
      hotkeyConflictDetail: 'Some hotkeys conflict with another app. Close it or those shortcuts will not work.',
      waitingForQuestion: 'Waiting for question',
      screenOverview: 'Screen overview',
      problem: 'Problem',
      status: 'Status',
      approach: 'Approach',
      complexity: 'Complexity',
      time: 'Time',
      space: 'Space',
      code: 'Code',
      edgeCases: 'Edge cases',
      nextStep: 'Next step',
      followUps: 'Follow-ups',
      diagramLoading: 'Drawing diagram…',
      diagramRenderFailed: 'Could not render diagram.',
      architectureDiagram: 'Architecture diagram',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      and: 'and',
      legalAcceptanceTitle: 'Terms and Privacy',
      legalAcceptanceSubtitle: 'Please review and accept before using Kraken Interview.',
      legalSummaryExperimental:
        'This is an experimental AI tool. Output may be wrong or incomplete — always verify answers yourself.',
      legalSummaryNoLiability:
        'We are not responsible if you use this tool during interviews or for any employment outcome.',
      legalSummaryNoStorage:
        'Voice and transcripts are kept in memory only during a session and are wiped when the session ends. Resume/CV stays on your device only.',
      legalSummaryStripe:
        'Subscriptions are managed through Stripe using your email. We do not operate a separate user database.',
      legalSummaryNoRefund:
        'Subscription fees are non-refundable except where required by law. Cancel before renewal in Stripe.',
      legalReadFull: 'Read the full',
      legalVersionLabel: 'Version {{version}}.',
      legalAcceptanceCheckbox:
        'I agree to the Terms of Service and Privacy Policy, and I understand this is experimental AI software.',
      legalAcceptAndContinue: 'Accept and continue',
      legalMustAccept: 'Accept the Terms of Service and Privacy Policy before starting.',
      privacyAndLegal: 'Privacy & legal',
      emailStripeNote: 'Your email links your subscription in Stripe. We do not store account data in a separate database.',
      subscriptionStripeNote: 'Billing and subscription status are handled by Stripe.',
      privacyLocalDataNote:
        'Only local app preferences and optional resume/CV are stored on this device. Session audio, transcripts, and screenshots are not retained after a session ends.',
      legalAcceptedStatus: 'Legal terms accepted (version {{version}}).',
      legalNotAcceptedStatus: 'Legal terms not accepted for the current version.',
      privacyExport: 'Export local data',
      privacyDeleteLocal: 'Delete local data',
      privacyExportDone: 'Local data exported.',
      privacyDeleteDone: 'Local data deleted from this device.',
      privacyDeleteConfirm:
        'Delete all local app data on this device? This removes your profile, preferences, resume/CV, and legal acceptance record.',
      resumeSection: 'Resume / CV',
      resumeLocalNote:
        'Stored locally on this device only — never uploaded to our servers. Used during audio interviews to answer introduction and behavioral questions.',
      resumeUpload: 'Upload resume (.pdf, .doc, .docx, .txt, .md)',
      resumeReplace: 'Replace resume',
      resumeRemove: 'Remove resume',
      resumeNone: 'No resume uploaded yet.',
      resumeUploadedAt: 'Uploaded {{date}} · {{count}} characters',
      resumeInvalidType: 'Please upload a PDF, Word (.doc/.docx), or text resume file.',
      resumeTooLarge: 'Resume file is too large (max 10 MB).',
      resumeUploadFailed: 'Could not read the resume file.',
      shareSessionTitle: 'Session complete!',
      shareSessionStat: '{{count}} answer(s) generated this session.',
      shareSessionBody: 'Tell your friends about Kraken Interview — share your experience on social media.',
      shareOnTwitter: 'Share on X',
      shareOnLinkedin: 'LinkedIn',
      shareOnReddit: 'Reddit',
      copyLink: 'Copy link',
      copied: 'Copied!',
      jobDescriptionFetchFailed: 'Could not load the job description URL.',
      appVersionSection: 'Software updates',
      appVersionLabel: 'Version {{version}}',
      appCheckForUpdates: 'Check for updates',
      appUpdateChecking: 'Checking for updates…',
      appUpdateUpToDate: 'You are on the latest published release (v{{version}}).',
      appUpdateAheadOfPublished:
        'You are on v{{current}} — newer than the published release (v{{published}}). No update to download.',
      appUpdateAvailable: 'Version {{version}} is available.',
      appDownloadUpdate: 'Download update',
      appUpdateDownloading: 'Downloading update…',
      appUpdateReady: 'Update downloaded. Install v{{version}} to finish.',
      appInstallUpdate: 'Install update',
      appUpdateError: 'Could not check for updates.'
    }
  }
}

void i18n
  .use(hotkeyPostProcessor)
  .use(initReactI18next)
  .init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  postProcess: ['hotkeys']
})

export default i18n
