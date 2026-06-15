"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "./Differentials.module.css";

const COMPARISONS = [
  {
    label: "Acurácia Cognitiva",
    zynd: 99.8,
    zyndLabel: "99.8% (Visão + NLP)",
    legacy: 75.0,
    legacyLabel: "75.0% (Hardcoded)"
  },
  {
    label: "Velocidade de Setup",
    zynd: 90.0,
    zyndLabel: "3 dias (Zero Code)",
    legacy: 20.0,
    legacyLabel: "3 meses (Custom Dev)"
  },
  {
    label: "Redução de Custos",
    zynd: 85.0,
    zyndLabel: "85% economia média",
    legacy: 30.0,
    legacyLabel: "30% economia média"
  },
  {
    label: "Flexibilidade de Workflows",
    zynd: 95.0,
    zyndLabel: "Self-healing automático",
    legacy: 15.0,
    legacyLabel: "Quebra com qualquer mudança"
  }
];

export default function Differentials() {
  return (
    <section className={styles.diffSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left Side: Visual Bars */}
          <div className={styles.visualSide}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.bgZynd}`}></div>
                  <span className={styles.legendText}>Plataforma ZYND</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.bgLegacy}`}></div>
                  <span className={styles.legendText}>Sistemas Tradicionais / RPA</span>
                </div>
              </div>

              <div className={styles.barsList}>
                {COMPARISONS.map((comp, idx) => (
                  <div key={idx} className={styles.comparisonRow}>
                    <span className={styles.rowLabel}>{comp.label}</span>
                    
                    {/* ZYND Bar */}
                    <div className={styles.barContainer}>
                      <div className={styles.barLabelRow}>
                        <span className={styles.barText}>{comp.zyndLabel}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={styles.barFillZynd}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${comp.zynd}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Legacy Bar */}
                    <div className={styles.barContainer}>
                      <div className={styles.barLabelRow}>
                        <span className={`${styles.barText} ${styles.textMuted}`}>{comp.legacyLabel}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={styles.barFillLegacy}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${comp.legacy}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: idx * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Bullet point descriptions */}
          <div className={styles.textSide}>
            <span className={styles.tagline}>MÉTRICAS COMPARATIVAS</span>
            <h2 className={styles.title}>Por que Empresas Escolhem a ZYND?</h2>
            <p className={styles.desc}>
              O RPA tradicional quebra constantemente quando interfaces mudam. A ZYND utiliza inteligência artificial baseada em agentes cognitivos que se adaptam e auto-corrigem erros em tempo real.
            </p>

            <ul className={styles.bulletsList}>
              <li className={styles.bulletItem}>
                <CheckCircle2 className={styles.iconCheck} size={20} />
                <div>
                  <strong>Adaptação Dinâmica (Self-Healing):</strong> Se um sistema ERP atualizar seu layout, nossos agentes identificam os campos semanticamente, sem interromper as execuções.
                </div>
              </li>
              <li className={styles.bulletItem}>
                <CheckCircle2 className={styles.iconCheck} size={20} />
                <div>
                  <strong>Modelos Multimodais:</strong> Interpretamos e-mails, PDFs de faturas complexas, áudios e tabelas dinâmicas diretamente, convertendo dados brutos em decisões operacionais.
                </div>
              </li>
              <li className={styles.bulletItem}>
                <CheckCircle2 className={styles.iconCheck} size={20} />
                <div>
                  <strong>Arquitetura Cloud-Native Segura:</strong> Criptografia de ponta a ponta e total conformidade com a LGPD e GDPR para proteção de dados corporativos sensíveis.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
