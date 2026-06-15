"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Layers, Zap } from "lucide-react";
import styles from "./ValueProps.module.css";

const VALUE_PROPS = [
  {
    num: "01",
    icon: <BrainCircuit size={24} className={styles.propIcon} />,
    title: "Orquestração Autónoma",
    desc: "Nossos agentes de IA executam fluxos de trabalho complexos ponta a ponta sem supervisão constante. Eles tomam decisões contextuais e resolvem exceções autonomamente.",
    metric: "99.8% de autonomia operacional"
  },
  {
    num: "02",
    icon: <Zap size={24} className={styles.propIcon} />,
    title: "Hiperautomação de Processos",
    desc: "Conectamos seus sistemas legados, ERPs modernos, CRMs e APIs de IA em um ecossistema unificado. Eliminamos gargalos manuais e retrabalho em minutos.",
    metric: "Redução de até 10x no tempo de execução"
  },
  {
    num: "03",
    icon: <Layers size={24} className={styles.propIcon} />,
    title: "Escalabilidade Sem Atrito",
    desc: "Arquitetura serverless de alta performance projetada para suportar milhões de execuções simultâneas. Escalabilidade instantânea para acompanhar o ritmo do seu negócio.",
    metric: "Segurança de nível enterprise"
  }
];

export default function ValueProps() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
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
    <section id="differentials" className={styles.valueSection}>
      {/* Background radial glow */}
      <div className={styles.radialGlow}></div>

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
            DIFERENCIAIS ZYND
          </motion.span>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A Próxima Geração de Eficiência
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Desenhamos soluções que integram inteligência cognitiva com execução operacional, entregando automações que superam os limites do software tradicional.
          </motion.p>
        </div>

        {/* Value Cards Grid */}
        <motion.div
          className={`grid-cols-3 ${styles.grid}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {VALUE_PROPS.map((prop, idx) => (
            <motion.div
              key={idx}
              className={styles.valueCard}
              onMouseMove={handleMouseMove}
              variants={cardVariants}
            >
              {/* Double Border Glow Overlay */}
              <div className={styles.spotlightGlow}></div>
              
              {/* Card Contents */}
              <div className={styles.cardContent}>
                {/* Index Counter */}
                <div className={styles.cardHeaderRow}>
                  <div className={styles.iconCircle}>
                    {prop.icon}
                  </div>
                  <span className={styles.propNum}>{prop.num}</span>
                </div>
                
                <h3 className={styles.propTitle}>{prop.title}</h3>
                
                <p className={styles.propDesc}>{prop.desc}</p>
                
                {/* Metric Footer inside the Card */}
                <div className={styles.propFooter}>
                  <div className={styles.indicatorPulse}></div>
                  <span className={styles.propMetric}>{prop.metric}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
