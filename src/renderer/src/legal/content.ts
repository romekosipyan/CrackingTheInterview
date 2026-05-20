export type LegalSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type LegalDocument = {
  title: string
  updatedAt: string
  intro: string
  sections: LegalSection[]
}

export const TERMS_OF_SERVICE: LegalDocument = {
  title: 'Terms of Service',
  updatedAt: 'May 20, 2026',
  intro:
    'These Terms of Service ("Terms") govern your use of CrackingTheInterview (the "App"). By installing, accessing, or using the App, you agree to these Terms. If you do not agree, do not use the App.',
  sections: [
    {
      title: '1. Experimental AI Software',
      paragraphs: [
        'The App is experimental AI software that provides screen capture analysis, voice transcription, and generated interview assistance.',
        'AI output may be inaccurate, incomplete, outdated, or inappropriate. Output is provided "AS IS" and with all faults. You must independently verify all information before relying on it.',
        'We do not use your session content, resume/CV, or local data to train our own or third-party machine learning models.'
      ]
    },
    {
      title: '2. No Employment or Interview Guarantee',
      paragraphs: [
        'We do not guarantee that use of the App will help you obtain employment, pass an interview, receive an offer, or achieve any particular result.',
        'You are solely responsible for how you use the App and for complying with the rules, policies, and honor codes of employers, schools, interview platforms, and applicable law.',
        'You agree that we are not responsible if you use the App during live interviews or assessments.'
      ]
    },
    {
      title: '3. Subscription, Billing, and No Refunds',
      paragraphs: [
        'Paid access is provided through a recurring subscription processed by Stripe and linked to the email address you provide.',
        'We do not operate our own user database. Subscription status and billing records are managed in Stripe using your email as the account identifier.',
        'Unless required by mandatory consumer protection law, all fees are non-refundable and non-creditable once charged.',
        'Subscriptions renew automatically each billing period unless you cancel at least 24 hours before renewal through the Stripe customer portal or other cancellation method we provide.',
        'We may change subscription pricing with reasonable prior notice where required by law.'
      ]
    },
    {
      title: '4. Session Data (Memory Only)',
      paragraphs: [
        'During an active interview session, the App may temporarily hold screenshots, transcripts, and AI responses in device memory.',
        'We do not store your voice recordings or transcribed text on our servers. Audio is processed for transcription during the session and is not retained by us after the session ends.',
        'When a session ends, in-memory session content is wiped from the App.'
      ]
    },
    {
      title: '5. Resume / CV (Local Storage)',
      paragraphs: [
        'You may optionally upload or store a resume/CV locally in the App to improve spoken and behavioral interview answers.',
        'Your resume/CV is stored only on your device unless you export it yourself. We do not upload or store your resume/CV on our servers.',
        'During an active session, relevant resume/CV content may be sent to third-party AI providers solely to generate answers you request. It is not retained by us after the session ends.',
        'You are responsible for ensuring your resume/CV is accurate and that you have the right to use it.'
      ]
    },
    {
      title: '6. Acceptable Use',
      paragraphs: ['You agree not to use the App in ways that:'],
      bullets: [
        'Violate an employer’s, platform’s, or institution’s interview or academic integrity rules',
        'Misrepresent your skills, knowledge, or identity',
        'Infringe intellectual property or privacy rights of others',
        'Are unlawful, deceptive, or harmful'
      ]
    },
    {
      title: '7. Third-Party Services',
      paragraphs: [
        'The App uses third-party services including Stripe for payments and AI/transcription providers to deliver features during sessions.',
        'Your use of those services may also be subject to their terms and privacy policies.'
      ]
    },
    {
      title: '8. Disclaimer of Warranties',
      paragraphs: [
        'Except as required by mandatory law, the App and all services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, or statutory, including merchantability, fitness for a particular purpose, accuracy, and non-infringement.',
        'We do not warrant that the App will be uninterrupted, error-free, secure, or invisible in every screen-sharing environment.'
      ]
    },
    {
      title: '9. Limitation of Liability',
      paragraphs: [
        'To the maximum extent permitted by law, CrackingTheInterview and its operators are not liable for any indirect, incidental, special, consequential, or punitive damages, or for lost opportunities, employment outcomes, reputation harm, or disciplinary action arising from your use of the App.',
        'Our total liability for any claim relating to the App is limited to the greater of (a) the fees you paid us in the twelve (12) months before the claim or (b) USD $100, unless mandatory law requires otherwise.',
        'EU/EEA and UK consumers retain mandatory rights under local law.'
      ]
    },
    {
      title: '10. Suspension and Termination',
      paragraphs: [
        'We may suspend or terminate access if you violate these Terms or if required for legal, security, or operational reasons.',
        'You may stop using the App at any time and cancel your subscription through Stripe.'
      ]
    },
    {
      title: '11. Changes',
      paragraphs: [
        'We may update these Terms. Material changes may require renewed acceptance in the App before continued use.',
        'The effective version is shown in the App.'
      ]
    },
    {
      title: '12. Governing Law',
      paragraphs: [
        'These Terms are governed by the laws applicable to our place of establishment, without regard to conflict-of-law rules, except where mandatory consumer protection laws in your country of residence provide otherwise.'
      ]
    },
    {
      title: '13. Contact',
      paragraphs: [
        'For legal or privacy questions, contact us using the email address shown in Settings or your Stripe receipt.'
      ]
    }
  ]
}

export const PRIVACY_POLICY: LegalDocument = {
  title: 'Privacy Policy',
  updatedAt: 'May 20, 2026',
  intro:
    'This Privacy Policy explains how CrackingTheInterview ("we", "us") handles information when you use our desktop App. We designed the App to minimize data collection and to avoid operating a traditional user database.',
  sections: [
    {
      title: '1. Summary',
      paragraphs: ['Key points:'],
      bullets: [
        'No database: we do not maintain a separate user account database',
        'Subscription is managed in Stripe and linked to your email',
        'Voice and transcripts are processed during sessions and not stored by us after sessions end',
        'Resume/CV is stored locally on your device unless you delete or export it',
        'We do not sell personal information',
        'We do not use your data to train AI models'
      ]
    },
    {
      title: '2. Information We Process',
      paragraphs: ['Depending on how you use the App, we may process:'],
      bullets: [
        'Email address and optional name (for subscription linkage and local profile settings)',
        'Subscription and billing metadata in Stripe (payment status, customer ID, invoices)',
        'Session content in device memory only: screenshots, transcripts, and AI prompts/responses during an active interview session',
        'Resume/CV text stored locally on your device if you choose to upload it',
        'Technical data necessary to operate the App (e.g., app version, error logs if enabled locally)'
      ]
    },
    {
      title: '3. What We Do Not Store on Our Servers',
      paragraphs: ['We do not store on our servers:'],
      bullets: [
        'Voice recordings',
        'Transcribed interview text after a session ends',
        'Screenshots after a session ends',
        'Your resume/CV file or text',
        'A centralized profile database beyond Stripe subscription records tied to email'
      ]
    },
    {
      title: '4. Local Device Storage',
      paragraphs: [
        'The App stores limited settings on your computer, such as your optional name, email, language defaults, preferred display, legal acceptance record, and optionally your resume/CV text.',
        'This local data remains on your device unless you export or delete it through Settings.',
        'Resume/CV content is never uploaded to our servers. It may be included in AI requests only during active sessions you initiate.'
      ]
    },
    {
      title: '5. AI Training Policy',
      paragraphs: [
        'We do not use your personal information, session content, or resume/CV to train artificial intelligence or machine learning models.',
        'Third-party AI providers process data to deliver features you request during a session according to their own policies.'
      ]
    },
    {
      title: '6. Legal Bases (GDPR / UK GDPR)',
      paragraphs: ['Where GDPR or UK GDPR applies, we rely on:'],
      bullets: [
        'Contract: providing the App and subscription access',
        'Consent: optional profile fields, resume/CV upload, and session features that capture audio/screen content',
        'Legitimate interests: security, fraud prevention, and improving reliability, balanced against your rights'
      ]
    },
    {
      title: '7. Session Processing and AI Providers',
      paragraphs: [
        'When you start a session, audio may be transcribed and screenshots may be analyzed using third-party AI services to generate responses.',
        'If you have stored a resume/CV locally, relevant portions may be sent with your session request to help answer behavioral or introduction questions.',
        'This processing occurs to deliver the feature you request. We do not retain session content on our servers after the session ends.'
      ]
    },
    {
      title: '8. Stripe',
      paragraphs: [
        'Payments and subscription management are handled by Stripe. Stripe receives information needed to process payments and manage your subscription, including your email address.',
        'Stripe acts as an independent processor/controller according to its own privacy policy.'
      ]
    },
    {
      title: '9. International Transfers',
      paragraphs: [
        'If you are in the EU, EEA, or UK, your information may be processed in countries outside your residence, including the United States, through service providers such as Stripe and AI vendors.',
        'Where required, we use appropriate safeguards such as Standard Contractual Clauses or equivalent mechanisms offered by vendors.'
      ]
    },
    {
      title: '10. Retention',
      paragraphs: ['We retain information only as long as necessary:'],
      bullets: [
        'Session content: only in memory during an active session, then wiped',
        'Local settings and resume/CV: until you delete them or uninstall the App',
        'Stripe billing records: according to Stripe retention and legal/tax requirements'
      ]
    },
    {
      title: '11. Your Rights',
      paragraphs: ['Depending on your location, you may have the right to:'],
      bullets: [
        'Access personal information we hold about you',
        'Correct inaccurate information',
        'Delete information or withdraw consent',
        'Export your data in a portable format',
        'Object to or restrict certain processing',
        'Lodge a complaint with a supervisory authority (EU/EEA/UK)'
      ]
    },
    {
      title: '12. US State Privacy Rights (including CCPA/CPRA)',
      paragraphs: [
        'We do not sell or share personal information for cross-context behavioral advertising.',
        'California and other US state residents may request access, deletion, or correction of personal information we control. Because we do not operate a user database, most requests will relate to Stripe subscription records and any optional information you provided locally or during support contact.',
        'You can export or delete local App data, including resume/CV, from Settings.'
      ]
    },
    {
      title: '13. Exercising Your Rights',
      paragraphs: [
        'Use Settings in the App to export or delete local data, including resume/CV.',
        'For subscription or billing data, use the Stripe customer portal or contact us at the email shown in Settings.',
        'We will respond within timelines required by applicable law.'
      ]
    },
    {
      title: '14. Children',
      paragraphs: [
        'The App is not intended for users under 16 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children.'
      ]
    },
    {
      title: '15. Security',
      paragraphs: [
        'We use reasonable technical and organizational measures appropriate to the limited data we process. No method of transmission or storage is completely secure.'
      ]
    },
    {
      title: '16. Changes',
      paragraphs: [
        'We may update this Privacy Policy. Material changes will require renewed acceptance in the App where required by law.'
      ]
    },
    {
      title: '17. Contact',
      paragraphs: [
        'For privacy requests, contact us using the email address in Settings or your Stripe receipt.'
      ]
    }
  ]
}
