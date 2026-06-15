"use client";

import { MessageCircle, Send } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="20,15 80,15 85,30 15,70 20,85 80,85" stroke="url(#footerLogoGradient)" strokeWidth="8" fill="none" />
                  <path d="M30 35 H70 L30 65 H70" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0%" stopColor="#0066ff" />
                      <stop offset="100%" stopColor="#00d9ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className={styles.logoText}>ZYND</span>
              </div>
              <p className={styles.slogan}>
                Reinventando a eficiência corporativa através de sistemas de inteligência artificial autônomos e hiperautomação sob medida.
              </p>
            </div>

            {/* Links Column 1: Navegação */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Navegação</h4>
              <ul className={styles.linksList}>
                <li><button onClick={() => handleNavClick("hero")} className={styles.footerLink}>Início</button></li>
                <li><button onClick={() => handleNavClick("solutions")} className={styles.footerLink}>Soluções</button></li>
                <li><button onClick={() => handleNavClick("differentials")} className={styles.footerLink}>Diferenciais</button></li>
                <li><button onClick={() => handleNavClick("results")} className={styles.footerLink}>Resultados</button></li>
                <li><button onClick={() => handleNavClick("process")} className={styles.footerLink}>Processo</button></li>
              </ul>
            </div>

            {/* Links Column 2: Soluções */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Soluções</h4>
              <ul className={styles.linksList}>
                <li><button onClick={() => handleNavClick("solutions")} className={styles.footerLink}>Process Mining</button></li>
                <li><button onClick={() => handleNavClick("solutions")} className={styles.footerLink}>Automação Cognitiva</button></li>
                <li><button onClick={() => handleNavClick("solutions")} className={styles.footerLink}>Orquestração</button></li>
                <li><button onClick={() => handleNavClick("solutions")} className={styles.footerLink}>Integrações de API</button></li>
              </ul>
            </div>

            {/* Links Column 3: Newsletter */}
            <div className={styles.newsletterCol}>
              <h4 className={styles.colTitle}>Newsletter</h4>
              <p className={styles.newsletterDesc}>
                Receba novidades e insights semanais sobre IA corporativa diretamente no seu e-mail.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Seu e-mail corporativo"
                  required
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterBtn} aria-label="Assinar">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={styles.bottomBar}>
            <p className={styles.copy}>
              &copy; {new Date().getFullYear()} ZYND Enterprise. Todos os direitos reservados.
            </p>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>Termos de Uso</a>
              <a href="#" className={styles.legalLink}>Políticas de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/5511999999999?text=Olá%2C%20gostaria%20de%20solicitar%20um%20diagnóstico%20operacional%20da%20minha%20empresa%20com%20a%20ZYND."
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFab}
        aria-label="Fale conosco no WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}
