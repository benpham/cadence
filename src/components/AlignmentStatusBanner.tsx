import type { AlignmentStatus } from '../lib/dateUtils'
import {
  COMPLIANT_WEEKS_REQUIRED,
  statusDescription,
  statusLabel,
} from '../lib/dateUtils'
import './AlignmentStatusBanner.css'

type AlignmentStatusBannerProps = {
  status: AlignmentStatus
  compliantCount: number
  totalWeeks: number
}

export default function AlignmentStatusBanner({
  status,
  compliantCount,
  totalWeeks,
}: AlignmentStatusBannerProps) {
  const progressPct = Math.min(
    100,
    (compliantCount / COMPLIANT_WEEKS_REQUIRED) * 100,
  )
  const thresholdPct = (COMPLIANT_WEEKS_REQUIRED / totalWeeks) * 100

  return (
    <section
      className="alignment-banner card fade-up"
      data-status={status}
      aria-labelledby="alignment-banner-title"
    >
      <div className="alignment-banner__content">
        <p className="alignment-banner__eyebrow">Rolling 12-week status</p>
        <h1 id="alignment-banner-title" className="alignment-banner__title">
          {statusLabel(status)}
        </h1>
        <p className="alignment-banner__desc">
          {statusDescription(status, compliantCount, totalWeeks)}
        </p>

        <div className="alignment-banner__metric">
          <span className="alignment-banner__count">
            <span className="alignment-banner__big">{compliantCount}</span>
            <span className="alignment-banner__sep"> / {totalWeeks}</span>
          </span>
          <span className="alignment-banner__metric-label">
            Compliant weeks (need {COMPLIANT_WEEKS_REQUIRED} for In Alignment)
          </span>
        </div>

        <div
          className="alignment-banner__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={COMPLIANT_WEEKS_REQUIRED}
          aria-valuenow={compliantCount}
          aria-label={`Progress toward In Alignment: ${compliantCount} of ${COMPLIANT_WEEKS_REQUIRED} required compliant weeks`}
        >
          <div className="alignment-banner__track">
            <div
              className="alignment-banner__fill"
              style={{ width: `${progressPct}%` }}
            />
            <div
              className="alignment-banner__threshold"
              style={{ left: `${thresholdPct}%` }}
              aria-hidden="true"
            >
              <span className="alignment-banner__threshold-tick" />
              <span className="alignment-banner__threshold-label">Threshold</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
