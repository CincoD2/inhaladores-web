export default function Escalas() {
  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <h1>Escalas clínicas</h1>

      <div className="escala-links">
        <a className="escala-link-btn" href="/escalas/anion-gap">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20" />
              <path d="M5 8h14" />
            </svg>
          </span>
          Anion GAP
        </a>
        <a className="escala-link-btn" href="/escalas/chads2vasc">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-7 10-7 10z" />
            </svg>
          </span>
          CHA2DS2-VASc
        </a>
        <a className="escala-link-btn" href="/escalas/wells-tvp">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18" />
              <path d="M12 8l-4 4 4 4" />
              <path d="M12 8l4 4-4 4" />
            </svg>
          </span>
          Wells – TVP
        </a>
        <a className="escala-link-btn" href="/escalas/curb65">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="12" r="4" />
              <circle cx="16" cy="12" r="4" />
              <path d="M12 3v6" />
              <path d="M12 15v6" />
            </svg>
          </span>
          CURB-65
        </a>
        <a className="escala-link-btn" href="/escalas/glasgow">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 10h.01" />
              <path d="M16 10h.01" />
              <path d="M9 16h6" />
            </svg>
          </span>
          Glasgow
        </a>
        <a className="escala-link-btn" href="/escalas/gradiente-aa-o2">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
              <path d="M9 14h6" />
            </svg>
          </span>
          Gradiente A-a O2
        </a>
        <a className="escala-link-btn" href="/escalas/hasbled">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-7 10-7 10z" />
              <path d="M12 7v6" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          HAS-BLED
        </a>
        <a className="escala-link-btn" href="/escalas/idsa">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 5h8" />
              <path d="M9 3h6v4H9z" />
              <path d="M6 7h12v12H6z" />
              <path d="M9 11h6" />
              <path d="M12 8v6" />
            </svg>
          </span>
          IDSA/ATS
        </a>
        <a className="escala-link-btn" href="/escalas/psi">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h10" />
            </svg>
          </span>
          PSI
        </a>
        <a className="escala-link-btn" href="/escalas/hiperNa">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
            </svg>
          </span>
          Hipernatremia
        </a>
        <a className="escala-link-btn" href="/escalas/hiponatremia">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
              <path d="M7 14h10" />
            </svg>
          </span>
          Hiponatremia
        </a>
        <a className="escala-link-btn" href="/escalas/pafi">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16" />
              <path d="M12 4v16" />
            </svg>
          </span>
          PaFi
        </a>
        <a className="escala-link-btn" href="/escalas/safi">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16" />
              <path d="M12 6v12" />
            </svg>
          </span>
          SaFi
        </a>
        <a className="escala-link-btn" href="/escalas/tam">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18V6" />
              <path d="M18 18V6" />
              <path d="M6 12h12" />
            </svg>
          </span>
          TAm (PAM)
        </a>
        <a className="escala-link-btn" href="/escalas/timi-scacest">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-7 10-7 10z" />
              <path d="M7 12h10" />
              <path d="M12 7v10" />
            </svg>
          </span>
          TIMI SCACEST
        </a>
        <a className="escala-link-btn" href="/escalas/timi-scasest">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-7 10-7 10z" />
              <path d="M7 12h10" />
            </svg>
          </span>
          TIMI SCASEST
        </a>
        <a className="escala-link-btn" href="/escalas/qsofa">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
              <path d="M12 9v6" />
            </svg>
          </span>
          qSOFA
        </a>
        <a className="escala-link-btn" href="/escalas/depuradorTtos">
          <span className="escala-link-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 7l-4 5 4 5" />
              <path d="M17 7l4 5-4 5" />
              <path d="M10 19l4-14" />
            </svg>
          </span>
          Depurador de tratamiento
        </a>
      </div>
    </main>
  );
}
