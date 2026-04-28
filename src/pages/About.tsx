import { useEffect } from 'react'
import {
  COMPLIANT_DAYS_PER_WEEK,
  COMPLIANT_WEEKS_REQUIRED,
  ROLLING_WEEKS,
} from '../lib/dateUtils'
import './About.css'

export default function About() {
  useEffect(() => {
    document.title = 'About — Cadence'
  }, [])

  return (
    <div className="container about">
      <article className="about__article fade-up">
        <p className="about__eyebrow">About Cadence</p>
        <h1 className="about__title">A simple way to track your RTO rhythm.</h1>
        <p className="about__lede">
          Cadence helps you see — at a glance — whether your in-office attendance keeps you In
          Alignment with your return-to-office expectations. Tap a day, watch the math do itself.
        </p>

        <section className="about__section card fade-up fade-up-delay-1" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="about__h2">How it works</h2>
          <ol className="about__steps">
            <li>
              <span className="about__step-num">1</span>
              <div>
                <h3 className="about__step-title">A week is Sunday through Saturday.</h3>
                <p>Each week is its own bucket. The week column on the calendar shows the date range.</p>
              </div>
            </li>
            <li>
              <span className="about__step-num">2</span>
              <div>
                <h3 className="about__step-title">{COMPLIANT_DAYS_PER_WEEK} badge-ins make a week compliant.</h3>
                <p>
                  Click any day on the calendar to mark a badge-in. When a week reaches{' '}
                  {COMPLIANT_DAYS_PER_WEEK} or more, the week is compliant — its summary
                  pip turns green.
                </p>
              </div>
            </li>
            <li>
              <span className="about__step-num">3</span>
              <div>
                <h3 className="about__step-title">
                  {COMPLIANT_WEEKS_REQUIRED} of the last {ROLLING_WEEKS} weeks puts you In Alignment.
                </h3>
                <p>
                  The status banner on the home page tracks a rolling {ROLLING_WEEKS}-week window
                  ending with the current week. Hit the threshold and you're In Alignment. Fall short
                  and you'll see At Risk or Out of Alignment along with the gap.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="about__section card fade-up fade-up-delay-2" aria-labelledby="privacy">
          <h2 id="privacy" className="about__h2">Your data stays with you.</h2>
          <p>
            Cadence stores your badge-in history in your browser's local storage. Nothing is sent
            anywhere — closing the tab keeps your data, clearing site data resets it. To use Cadence
            on another device, you'll start fresh there.
          </p>
        </section>

        <section className="about__section card fade-up fade-up-delay-3" aria-labelledby="status-meanings">
          <h2 id="status-meanings" className="about__h2">What the statuses mean</h2>
          <ul className="about__status-list">
            <li>
              <span className="status-pill" data-status="aligned">In Alignment</span>
              <span>{COMPLIANT_WEEKS_REQUIRED} or more compliant weeks in the rolling window.</span>
            </li>
            <li>
              <span className="status-pill" data-status="at-risk">At Risk</span>
              <span>{COMPLIANT_WEEKS_REQUIRED - 2} or {COMPLIANT_WEEKS_REQUIRED - 1} compliant weeks — a slip away from falling out.</span>
            </li>
            <li>
              <span className="status-pill" data-status="off-track">Out of Alignment</span>
              <span>Fewer than {COMPLIANT_WEEKS_REQUIRED - 2} compliant weeks — work needed to recover.</span>
            </li>
          </ul>
        </section>
      </article>
    </div>
  )
}
