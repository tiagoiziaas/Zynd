"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import GithubIcon from "../ui/GithubIcon";
import MagneticBtn from "../ui/MagneticBtn";
import styles from "./About.module.css";

const HIGHLIGHTS = [
  {
    title: "Full-stack, ponta a ponta",
    desc: "Da arquitetura de dados à interface final, cada camada da ZYND foi desenhada e implementada por mim.",
  },
  {
    title: "IA aplicada a processos reais",
    desc: "Especialista em transformar automação genérica em agentes cognitivos que resolvem problemas específicos de cada operação.",
  },
  {
    title: "Obsessão por resultado mensurável",
    desc: "Cada funcionalidade que construo nasce de uma métrica que precisa melhorar — não de tecnologia por tecnologia.",
  },
];

export default function About() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [loadPoster, setLoadPoster] = useState(false);

  // Only mount the (heavy) original SVG once the poster is close to viewport
  useEffect(() => {
    const el = posterRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadPoster(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Original "Alvo Localizado" artwork, embedded as-is */}
          <motion.div
            className={styles.posterWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div ref={posterRef} className={styles.posterFrame}>
              {loadPoster ? (
                <object
                  data="/about/alvo-localizado.svg"
                  type="image/svg+xml"
                  aria-label="Alvo Localizado — Tiago Izaias, Desenvolvedor"
                  className={styles.posterObject}
                />
              ) : (
                <div className={styles.posterSkeleton} />
              )}
            </div>
          </motion.div>

          {/* Text Content */}
          <div className={styles.textSide}>
            <motion.span
              className={styles.tagline}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              SOBRE
            </motion.span>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              O Desenvolvedor Por Trás da ZYND
            </motion.h2>

            <motion.div
              className={styles.nameRow}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className={styles.name}>Tiago Izaias</span>
              <span className={styles.handle}>@tiagoizaias</span>
            </motion.div>

            {/* Bio placeholder — revisar/personalizar antes de publicar */}
            <motion.p
              className={styles.desc}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Sou o fundador e desenvolvedor por trás da ZYND. Construí a plataforma do zero — do desenho da
              arquitetura de agentes de IA até cada linha de interface — com um objetivo direto: eliminar trabalho
              manual repetitivo em empresas através de automação inteligente e sob medida.
            </motion.p>

            <motion.ul
              className={styles.bulletsList}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {HIGHLIGHTS.map((item, idx) => (
                <li key={idx} className={styles.bulletItem}>
                  <CheckCircle2 className={styles.iconCheck} size={20} />
                  <div>
                    <strong>{item.title}:</strong> {item.desc}
                  </div>
                </li>
              ))}
            </motion.ul>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MagneticBtn>
                <a
                  href="https://github.com/tiagoiziaas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubBtn}
                >
                  <GithubIcon size={18} /> Ver GitHub
                </a>
              </MagneticBtn>
              <button onClick={scrollToContact} className={styles.contactBtn}>
                Falar Comigo
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
