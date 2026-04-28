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
          <NavLink to="/" end className="site-header__link">
            Home
          </NavLink>
          <NavLink to="/stats" className="site-header__link">
            Stats
          </NavLink>
          <NavLink to="/about" className="site-header__link">
            About
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
