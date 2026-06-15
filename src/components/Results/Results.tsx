"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import styles from "./Results.module.css";

const TESTIMONIALS = [
  {
    quote: "A ZYND revolucionou nossa conciliação de faturas. Automatizamos 95% de todo o processo financeiro em apenas 3 semanas, economizando milhares de horas de trabalho manual anual.",
    author: "Marcos Aurélio",
    role: "CTO da Vesta Corp",
    avatar: "MA",
    rating: 5
  },
  {
    quote: "A facilidade de integrar APIs de IA em nossos sistemas legados via ZYND nos permitiu lançar uma triagem de suporte ao cliente inteligente em tempo recorde com precisão incrível.",
    author: "Letícia Ribeiro",
    role: "Diretora de Operações na Nexa",
    avatar: "LR",
    rating: 5
  },
  {
    quote: "Reduzir o tempo de processamento de solicitações de 4 horas para 12 segundos mudou completamente a qualidade do serviço que entregamos e a produtividade interna.",
    author: "Roberto M. de Souza",
    role: "VP de Inovação na Hórus Logistics",
    avatar: "RS",
    rating: 5
  }
];

export default function Results() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    })
  };

  return (
    <section id="results" className={styles.resultsSection}>
      {/* Background lights */}
      <div className={styles.blueLight}></div>

      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.tagline}>CASOS DE SUCESSO</span>
          <h2 className={styles.title}>Reconhecido por Líderes</h2>
          <p className={styles.subtitle}>
            Veja o impacto direto que a arquitetura de hiperautomação da ZYND gera no dia a dia operacional de grandes corporações.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className={styles.carouselWrapper}>
          <div className={styles.slider}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.testimonialCard}
              >
                {/* Quote Icon Background */}
                <div className={styles.quoteBg}>
                  <Quote size={120} />
                </div>

                <div className={styles.cardHeader}>
                  {/* Stars */}
                  <div className={styles.starsRow}>
                    {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                    ))}
                  </div>
                </div>

                <p className={styles.quoteText}>
                  &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
                </p>

                <div className={styles.cardFooter}>
                  {/* User Profile */}
                  <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                      {TESTIMONIALS[activeIndex].avatar}
                    </div>
                    <div className={styles.userInfo}>
                      <h4 className={styles.userName}>{TESTIMONIALS[activeIndex].author}</h4>
                      <span className={styles.userRole}>{TESTIMONIALS[activeIndex].role}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className={styles.controlsRow}>
            {/* Prev/Next Buttons */}
            <div className={styles.navButtons}>
              <button onClick={slidePrev} className={styles.navBtn} aria-label="Depoimento Anterior">
                <ArrowLeft size={18} />
              </button>
              <button onClick={slideNext} className={styles.navBtn} aria-label="Próximo Depoimento">
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className={styles.dotsRow}>
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ""}`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
