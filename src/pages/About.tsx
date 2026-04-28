import { useEffect } from 'react'
import {
  COMPLIANT_DAYS_PER_WEEK,
  COMPLIANT_WEEKS_REQUIRED,
  ROLLING_WEEKS,
} from '../lib/dateUtils'
import { useTheme } from '../lib/ThemeContext'
import './About.css'

export default function About() {
  useEffect(() => {
    document.title = 'About — Cadence'
  }, [])

  const { theme, toggleTheme } = useTheme()

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
        <section className="about__section card fade-up fade-up-delay-4" aria-labelledby="appearance">
          <h2 id="appearance" className="about__h2">Appearance</h2>
          <p className="about__appearance-desc">
            Switch between light and dark mode. Your preference is saved automatically.
          </p>
          <div className="about__theme-row">
            <span className={`about__theme-option${theme === 'light' ? ' is-active' : ''}`} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="4"/>
                <line x1="12" y1="20" x2="12" y2="22"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="2" y1="12" x2="4" y2="12"/>
                <line x1="20" y1="12" x2="22" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              Light
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
              className={`theme-toggle${theme === 'dark' ? ' is-dark' : ''}`}
              onClick={toggleTheme}
            >
              <span className="theme-toggle__thumb" />
            </button>
            <span className={`about__theme-option${theme === 'dark' ? ' is-active' : ''}`} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              Dark
            </span>
          </div>
        </section>
      </article>
    </div>
  )
}
