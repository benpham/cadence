import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__inner">
        <div className="site-footer__col">
          <p className="site-footer__brand">Cadence</p>
          <p className="site-footer__tagline">
            Track your return-to-office rhythm, week by week.
          </p>
        </div>
        <div className="site-footer__col">
          <h4 className="site-footer__heading">Compliance rules</h4>
          <ul className="site-footer__list">
            <li>3 badge-ins per week (Sun–Sat) = compliant week</li>
            <li>8 of last 12 weeks compliant = In Alignment</li>
          </ul>
        </div>
        <p className="site-footer__copy">© {new Date().getFullYear()} Cadence. Local data — never leaves your browser.</p>
      </div>
    </footer>
  )
}
