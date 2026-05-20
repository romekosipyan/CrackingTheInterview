import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      appName: 'CrackingTheInterview',
      homeTitle: 'Start your interview session',
      programmingLanguage: 'Programming language',
      interviewLanguage: 'Interview language',
      screenToCapture: 'Screen to capture',
      entireScreen: 'Entire screen',
      startInterview: 'Start Interview',
      settings: 'Settings',
      back: 'Back',
      basicDetails: 'Basic details',
      name: 'Name',
      email: 'Email',
      defaults: 'Defaults',
      appLanguage: 'App language',
      defaultProgrammingLanguage: 'Default programming language',
      subscription: 'Subscription',
      manageSubscription: 'Manage subscription',
      apiSettings: 'AI settings',
      apiKey: 'OpenAI API key',
      fastModel: 'Fast model',
      deepModel: 'Deep model',
      save: 'Save settings',
      saved: 'Settings saved',
      endInterview: 'End Interview',
      fastSolve: 'Fast Solve',
      deepSolve: 'Deep Solve',
      loading: 'Working…',
      noResult: 'Capture a screenshot (Alt+S) or record the question (Alt+B), then Fast or Deep Solve.',
      helpTitle: 'Hotkeys',
      sidebar: 'Session',
      recording: 'Recording',
      transcribing: 'Transcribing…',
      transcript: 'Transcript',
      noTranscript: 'Press Alt+B while the interviewer speaks. Captures system audio (speakers) on Windows.',
      systemAudio: 'System audio',
      microphoneAudio: 'Microphone',
      screenshot: 'Screenshot',
      copyCode: 'Copy code'
    }
  }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
