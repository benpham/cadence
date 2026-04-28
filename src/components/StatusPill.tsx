import { useEffect, useRef, useState } from 'react'
import type { AlignmentStatus } from '../lib/dateUtils'

type Status = AlignmentStatus | 'off-track'

type StatusPillProps = {
  status: Status
  children: React.ReactNode
  className?: string
  tooltip?: string
  'aria-label'?: string
}

function StatusIcon({ status }: { status: Status }) {
  if (status === 'aligned') {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
  if (status === 'at-risk') {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default function StatusPill({ status, children, className, tooltip, 'aria-label': ariaLabel }: StatusPillProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <span
      ref={ref}
      className={`status-pill${className ? ` ${className}` : ''}${tooltip ? ' status-pill--has-tooltip' : ''}`}
      data-status={status}
      aria-label={ariaLabel}
      onClick={tooltip ? () => setOpen((v) => !v) : undefined}
    >
      <StatusIcon status={status} />
      <span className="status-pill__label">{children}</span>
      {tooltip && (
        <span className={`status-pill__tooltip${open ? ' is-open' : ''}`} aria-hidden="true">
          {tooltip}
        </span>
      )}
    </span>
  )
}
