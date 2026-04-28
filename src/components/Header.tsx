import { NavLink } from 'react-router-dom'
import type { AlignmentStatus } from '../lib/dateUtils'
import { statusLabel } from '../lib/dateUtils'
import AuthButton from './AuthButton'
import './Header.css'

type HeaderProps = {
  status: AlignmentStatus
  compliantCount: number
  totalWeeks: number
}

export default function Header({ status, compliantCount, totalWeeks }: HeaderProps) {
  return (
    <header className="site-header" role="banner">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__brand" aria-label="Cadence — home">
          <span className="site-header__logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--color-primary)" />
              <path
                d="M9 16h4l2 4 4-10 2 6h4"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          <span className="site-header__wordmark">Cadence</span>
        </NavLink>

        <nav className="site-header__nav" aria-label="Primary">
          <NavLink to="/" end className="site-header__link" title="Home">
            <svg className="site-header__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <polyline points="9 21 9 12 15 12 15 21"/>
            </svg>
            <span className="site-header__link-text">Home</span>
          </NavLink>
          <NavLink to="/stats" className="site-header__link" title="Stats">
            <svg className="site-header__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="12" width="4" height="9"/>
              <rect x="10" y="7" width="4" height="14"/>
              <rect x="17" y="3" width="4" height="18"/>
            </svg>
            <span className="site-header__link-text">Stats</span>
          </NavLink>
          <NavLink to="/about" className="site-header__link" title="About">
            <svg className="site-header__link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span className="site-header__link-text">About</span>
          </NavLink>
        </nav>

        <span
          className="status-pill site-header__status"
          data-status={status}
          aria-label={`Current status: ${statusLabel(status)}, ${compliantCount} of ${totalWeeks} weeks compliant`}
        >
          {statusLabel(status)}
        </span>
        <AuthButton />
      </div>
    </header>
  )
}
