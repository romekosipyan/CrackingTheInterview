import type { LegalDocument as LegalDocumentType } from '../legal/content'

type Props = {
  document: LegalDocumentType
}

export default function LegalDocument({ document }: Props): JSX.Element {
  return (
    <article className="legal-document">
      <header className="legal-header">
        <h1>{document.title}</h1>
        <p className="legal-updated">Last updated: {document.updatedAt}</p>
        <p className="legal-intro">{document.intro}</p>
      </header>

      {document.sections.map((section) => (
        <section key={section.title} className="legal-section">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  )
}
