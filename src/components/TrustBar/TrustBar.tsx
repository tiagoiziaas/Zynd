"use client";

import styles from "./TrustBar.module.css";

const CLIENT_LOGOS = [
  // 1. GLOBEX
  {
    name: "Globex",
    svg: (
      <svg width="110" height="28" viewBox="0 0 110 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 5L2 14L10 23H22L30 14L22 5H10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="16" cy="14" r="3" fill="currentColor" />
        <text x="38" y="19" fontFamily="var(--font-display)" fontSize="14" fontWeight="bold" fill="currentColor" letterSpacing="0.05em">GLOBEX</text>
      </svg>
    )
  },
  // 2. VERTEX
  {
    name: "Vertex",
    svg: (
      <svg width="110" height="28" viewBox="0 0 110 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 22L14 6L24 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <text x="34" y="19" fontFamily="var(--font-display)" fontSize="14" fontWeight="bold" fill="currentColor" letterSpacing="0.1em">VERTEX</text>
      </svg>
    )
  },
  // 3. HOOLI
  {
    name: "Hooli",
    svg: (
      <svg width="95" height="28" viewBox="0 0 95 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="14" cy="14" r="4" fill="currentColor" />
        <text x="32" y="19" fontFamily="var(--font-display)" fontSize="15" fontWeight="bold" fill="currentColor" letterSpacing="0.05em">hooli</text>
      </svg>
    )
  },
  // 4. SIRIUS
  {
    name: "Sirius",
    svg: (
      <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="14,2 17,10 26,10 19,15 22,23 14,18 6,23 9,15 2,10 11,10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <text x="34" y="19" fontFamily="var(--font-display)" fontSize="14" fontWeight="bold" fill="currentColor" letterSpacing="0.1em">SIRIUS</text>
      </svg>
    )
  },
  // 5. INITECH
  {
    name: "Initech",
    svg: (
      <svg width="115" height="28" viewBox="0 0 115 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 6V22" stroke="currentColor" strokeWidth="2" />
        <text x="28" y="19" fontFamily="var(--font-display)" fontSize="13" fontWeight="bold" fill="currentColor" letterSpacing="0.05em">INITECH</text>
      </svg>
    )
  },
  // 6. ACME CORP
  {
    name: "Acme",
    svg: (
      <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 22V6H14L20 16L26 6H36V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="44" y="19" fontFamily="var(--font-display)" fontSize="14" fontWeight="bold" fill="currentColor" letterSpacing="0.05em">ACME</text>
      </svg>
    )
  }
];

export default function TrustBar() {
  return (
    <section className={styles.trustSection}>
      <div className="container">
        <p className={styles.title}>EMPRESA DE CONFIANÇA PARA LÍDERES GLOBAIS DE TECNOLOGIA</p>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.sliderTrack}>
          {/* First loop of logos */}
          <div className={styles.logoGroup}>
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={`logo-1-${idx}`} className={styles.logoItem} aria-label={logo.name}>
                {logo.svg}
              </div>
            ))}
          </div>
          
          {/* Duplicate loop of logos for seamless infinite scrolling */}
          <div className={styles.logoGroup} aria-hidden="true">
            {CLIENT_LOGOS.map((logo, idx) => (
              <div key={`logo-2-${idx}`} className={styles.logoItem} aria-label={logo.name}>
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
