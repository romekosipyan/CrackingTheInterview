import { useTranslation } from 'react-i18next'
import type { SolveResponse } from '../env.d'

type Props = {
  result: SolveResponse | null
}

export default function SolutionPanel({ result }: Props): JSX.Element {
  const { t } = useTranslation()

  if (!result) {
    return (
      <div className="overlay-content">
        <p>{t('noResult')}</p>
      </div>
    )
  }

  const waiting = result.status === 'waiting'

  return (
    <div className="overlay-content">
      {waiting && (
        <div className="section">
          <span className="badge">Waiting for question</span>
        </div>
      )}

      <div className="section">
        <h3>{waiting ? 'Screen overview' : 'Problem'}</h3>
        <p>{result.problemSummary}</p>
      </div>

      <div className="section">
        <h3>{waiting ? 'Status' : 'Approach'}</h3>
        <p>{result.approach}</p>
      </div>

      {!waiting && (
        <>
          <div className="section">
            <h3>Complexity</h3>
            <p>
              Time: {result.complexity.time}
              {'\n'}
              Space: {result.complexity.space}
            </p>
          </div>
          <div className="section">
            <h3>Code ({result.code.language})</h3>
            <div className="code-block">
              <pre>{result.code.solution}</pre>
            </div>
          </div>
          <div className="section">
            <h3>Edge cases</h3>
            <div className="chips">
              {result.edgeCases.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {result.followUpQuestions.length > 0 && (
        <div className="section">
          <h3>{waiting ? 'Next step' : 'Follow-ups'}</h3>
          <div className="chips">
            {result.followUpQuestions.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
