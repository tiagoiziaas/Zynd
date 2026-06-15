"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Bot, Cpu, Sparkles } from "lucide-react";
import WebGLBackground from "./WebGLBackground";
import MagneticBtn from "../ui/MagneticBtn";
import styles from "./Hero.module.css";

// Dynamic Count-Up Component
function CountUp({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const end = value;
    const totalFrames = duration * 60; // 60fps
    let frame = 0;

    const counter = () => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const current = end * (progress * (2 - progress));
      
      setCount(Math.min(current, end));

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(counter);
  }, [isInView, value, duration]);

  // Formatting helper
  const formatValue = (num: number) => {
    if (num % 1 === 0) return Math.floor(num).toLocaleString("pt-BR");
    return num.toFixed(1).replace(".", ",");
  };

  return (
    <span ref={elementRef} className={styles.metricValue}>
      {formatValue(count)}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse positions for 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics smooth transformations
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Map mouse positions to 3D rotation angles
  const rotateX = useTransform(springY, [-400, 400], [15, -15]);
  const rotateY = useTransform(springX, [-400, 400], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Headline character staggering
  const titleText = "Reinventando a Eficiência Corporativa com Inteligência Artificial";
  const titleWords = titleText.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  const scrollToSolutions = () => {
    const el = document.getElementById("solutions");
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: "smooth",
      });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Mesh WebGL Background */}
      <WebGLBackground />

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.grid}>
          {/* Left Text Block */}
          <div className={styles.textBlock}>
            {/* Tagline Badge */}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles size={14} className={styles.badgeIcon} />
              <span>Plataforma Corporativa Lançada</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className={styles.headline}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {titleWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={wordVariants}
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Orquestramos fluxos de trabalho inteligentes, eliminando fricções operacionais e escalando o potencial da sua empresa através de hiperautomação sob medida.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <MagneticBtn>
                <button onClick={scrollToContact} className={styles.primaryBtn}>
                  Iniciar Transformação <ArrowRight size={16} />
                </button>
              </MagneticBtn>
              
              <button onClick={scrollToSolutions} className={styles.secondaryBtn}>
                Conhecer Soluções
              </button>
            </motion.div>
          </div>

          {/* Right Floating Cards Block */}
          <div className={styles.visualBlock}>
            <motion.div
              className={styles.perspectiveWrapper}
              style={{ rotateX, rotateY }}
            >
              {/* Primary Card */}
              <div className={`${styles.floatingCard} ${styles.mainCard}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconCircle}>
                    <Bot size={20} className={styles.iconBlue} />
                  </div>
                  <div className={styles.cardHeaderInfo}>
                    <h4>Agente ZYND-Core</h4>
                    <span className={styles.pulseTag}>ATIVO</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.keyword}>const</span> <span className={styles.variable}>agent</span> = <span className={styles.keyword}>new</span> <span className={styles.class}>ZyndWorkflow</span>();
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.variable}>agent</span>.<span className={styles.method}>run</span>({`{ task: `}<span className={styles.string}>&quot;sync_erp_and_crm&quot;</span>{` }`});
                  </div>
                  <div className={styles.statusIndicator}>
                    <div className={styles.spinner}></div>
                    <span>Executando automação inteligente...</span>
                  </div>
                </div>
              </div>

              {/* Auxiliary Overlay Card */}
              <div className={`${styles.floatingCard} ${styles.subCard}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconCircleGreen}>
                    <Cpu size={16} />
                  </div>
                  <h5>Workflows Efetuados</h5>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.subCardMetric}>12.4K</span>
                  <span className={styles.subCardChange}>+24% hoje</span>
                </div>
                <div className={styles.miniChart}>
                  <div className={styles.bar} style={{ height: "40%" }} />
                  <div className={styles.bar} style={{ height: "60%" }} />
                  <div className={styles.bar} style={{ height: "50%" }} />
                  <div className={styles.bar} style={{ height: "85%" }} />
                  <div className={styles.bar} style={{ height: "100%" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Metrics Bar */}
        <motion.div
          className={styles.metricsBar}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className={styles.metricItem}>
            <CountUp value={99.8} suffix="%" />
            <span className={styles.metricLabel}>Acurácia em Modelos de Processamento</span>
          </div>
          <div className={styles.metricItem}>
            <CountUp value={10} suffix="x" />
            <span className={styles.metricLabel}>Redução no Tempo de Execução</span>
          </div>
          <div className={styles.metricItem}>
            <CountUp value={12} suffix="M+" />
            <span className={styles.metricLabel}>Economia Gerada para Clientes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
