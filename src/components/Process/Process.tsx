"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Process.module.css";

const STEPS = [
  {
    num: "01",
    title: "Mapeamento & Diagnóstico",
    desc: "Analisamos seus workflows manuais e faturas de tempo operacionais para desenhar um mapa completo de automação viável.",
    details: ["Auditoria de processos manuais", "Estudo de viabilidade de ROI", "Mapeamento de integrações de API"]
  },
  {
    num: "02",
    title: "Arquitetura & Design",
    desc: "Desenhamos a infraestrutura e os prompts dos agentes de IA, integrando-os com seus bancos de dados e ferramentas internas.",
    details: ["Arquitetura de prompts de IA", "Modelagem de banco de dados", "Segurança e permissões de dados"]
  },
  {
    num: "03",
    title: "Desenvolvimento & Testes",
    desc: "Construímos as conexões e colocamos os agentes para rodar em modo sandbox, simulando dados reais em testes rigorosos.",
    details: ["Codificação de pipelines de dados", "Homologação em ambiente seguro", "Ajustes finos de precisão de IA"]
  },
  {
    num: "04",
    title: "Implementação & Escala",
    desc: "Fazemos o deploy e iniciamos o monitoramento das execuções em tempo real com relatórios de performance e auditoria.",
    details: ["Deploy contínuo e escalável", "Monitoramento em tempo real", "Suporte e melhoria contínua"]
  }
];

export default function Process() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Shift horizontal layout left as vertical scroll progresses
  // -75% covers 4 slides of 25vw or card layout width
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={targetRef} id="process" className={styles.scrollSection}>
      {/* Sticky container for locking page vertical scrolling */}
      <div className={styles.stickyContainer}>
        {/* Section header always visible or scrolls out */}
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.header}>
            <span className={styles.tagline}>NOSSO FLUXO</span>
            <h2 className={styles.title}>Processo de Implementação</h2>
            <p className={styles.subtitle}>
              Como levamos sua empresa do mapeamento manual à autonomia cognitiva total em 4 etapas estruturadas.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className={styles.scrollTrack}>
          <motion.div style={{ x }} className={styles.horizontalTrack}>
            {STEPS.map((step, idx) => (
              <div key={idx} className={styles.stepCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <div className={styles.stepDivider}></div>
                </div>
                
                <h3 className={styles.stepTitle}>{step.title}</h3>
                
                <p className={styles.stepDesc}>{step.desc}</p>
                
                <ul className={styles.stepDetails}>
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className={styles.detailItem}>
                      <span className={styles.bullet}></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
