"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import styles from "./Solutions.module.css";

const SOLUTIONS = [
  {
    title: "Process Mining & Discovery",
    desc: "Mapeamento algorítmico automático de processos corporativos. Descubra gargalos em tempo real analisando logs de eventos dos seus sistemas atuais.",
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgIllustration}>
        <rect x="4" y="6" width="14" height="14" rx="3" stroke="#63e04a" strokeWidth="2.5" />
        <rect x="42" y="6" width="14" height="14" rx="3" stroke="#adadad" strokeWidth="2" />
        <rect x="23" y="38" width="14" height="14" rx="3" stroke="#adadad" strokeWidth="2" />
        {/* Animated Connecting Paths */}
        <path d="M18 13 H42" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="6 4" className={styles.flowPath1} />
        <path d="M11 20 V45 H23" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="6 4" className={styles.flowPath2} />
        <defs>
          <linearGradient id="lineGrad1" x1="18" y1="13" x2="42" y2="13" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#63e04a" />
            <stop offset="100%" stopColor="#8cff6b" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="11" y1="20" x2="23" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#63e04a" />
            <stop offset="100%" stopColor="#8cff6b" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    title: "Automação Cognitiva",
    desc: "Robôs inteligentes equipados com Visão Computacional e Processamento de Linguagem Natural (NLP) para ler relatórios, validar documentos e responder e-mails.",
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgIllustration}>
        <circle cx="30" cy="30" r="14" stroke="#63e04a" strokeWidth="2.5" />
        {/* Inner scanning ring */}
        <circle cx="30" cy="30" r="8" stroke="#8cff6b" strokeWidth="1.5" strokeDasharray="4 2" className={styles.scanningRing} />
        {/* Outer Tech Shapes */}
        <path d="M10 10 L18 10 V18" stroke="#adadad" strokeWidth="2" />
        <path d="M50 10 L42 10 V18" stroke="#adadad" strokeWidth="2" />
        <path d="M10 50 L18 50 V42" stroke="#adadad" strokeWidth="2" />
        <path d="M50 50 L42 50 V42" stroke="#adadad" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: "Orquestração de Agentes",
    desc: "Sincronize múltiplos agentes de IA de forma centralizada. Garanta que tarefas fluam entre setores de compras, financeiro e RH com auditoria transparente.",
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgIllustration}>
        <circle cx="30" cy="14" r="6" stroke="#63e04a" strokeWidth="2.5" />
        <circle cx="16" cy="42" r="6" stroke="#adadad" strokeWidth="2" />
        <circle cx="44" cy="42" r="6" stroke="#adadad" strokeWidth="2" />
        {/* Connectors */}
        <line x1="26" y1="19" x2="19" y2="37" stroke="url(#nodeGrad1)" strokeWidth="2" className={styles.nodeLine1} />
        <line x1="34" y1="19" x2="41" y2="37" stroke="url(#nodeGrad2)" strokeWidth="2" className={styles.nodeLine2} />
        <defs>
          <linearGradient id="nodeGrad1" x1="26" y1="19" x2="19" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#63e04a" />
            <stop offset="100%" stopColor="#8cff6b" />
          </linearGradient>
          <linearGradient id="nodeGrad2" x1="34" y1="19" x2="41" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#63e04a" />
            <stop offset="100%" stopColor="#8cff6b" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    title: "Integrações via APIs de IA",
    desc: "Conectamos sua infraestrutura interna diretamente a LLMs como GPT-4, Claude e Gemini de forma segura, criando pipelines de dados ultrarrápidos.",
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgIllustration}>
        <path d="M12 20 H48" stroke="#adadad" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 40 H48" stroke="#adadad" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 10 L38 50" stroke="#63e04a" strokeWidth="2.5" strokeLinecap="round" className={styles.slashLine} />
        {/* Glow dots */}
        <circle cx="22" cy="20" r="3" fill="#8cff6b" className={styles.glowDot1} />
        <circle cx="38" cy="40" r="3" fill="#8cff6b" className={styles.glowDot2} />
      </svg>
    )
  }
];

export default function Solutions() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <section id="solutions" className={styles.solutionsSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <motion.span
            className={styles.tagline}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            NOSSAS SOLUÇÕES
          </motion.span>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Automação Focada em Resultados
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Implementamos sistemas autônomos que reduzem erros operacionais, cortam custos administrativos e liberam sua equipe para focar no crescimento estratégico.
          </motion.p>
        </div>

        {/* Solutions Grid */}
        <motion.div
          className={`grid-cols-2 ${styles.grid}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {SOLUTIONS.map((sol, idx) => (
            <motion.div
              key={idx}
              className={styles.solCard}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Outer Border Animating Gradient Frame */}
              <div className={styles.borderFrame}></div>

              <div className={styles.cardContent}>
                {/* SVG Illustration Column */}
                <div className={styles.illustrationWrapper}>
                  {sol.svg}
                </div>
                
                {/* Text Block Column */}
                <div className={styles.infoWrapper}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.solTitle}>{sol.title}</h3>
                    <ArrowUpRight size={18} className={styles.arrowIcon} />
                  </div>
                  <p className={styles.solDesc}>{sol.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
