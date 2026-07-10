"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import Github from "@/components/ui/GithubIcon";
import Link from "next/link";
import ProjectCard, { type Project } from "./ProjectCard";
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data.slice(0, 6)); // show max 6 on home
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const hasProjects = !loading && projects.length > 0;
  const isEmpty = !loading && projects.length === 0;

  return (
    <section id="portfolio" ref={sectionRef} className={styles.section}>
      {/* Ambient background orbs */}
      <div className={styles.orbLeft} />
      <div className={styles.orbRight} />

      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.badge}>
            <Github size={13} />
            <span>Open Source & Projetos</span>
          </div>
          <h2 className={styles.title}>
            O que{" "}
            <span className="blue-gradient">construímos</span>
          </h2>
          <p className={styles.subtitle}>
            Cada projeto é uma demonstração real de tecnologia aplicada —
            desde automações cognitivas até interfaces de alta performance.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className={styles.bentoGrid}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Layers size={40} className={styles.emptyIcon} />
            <p>Nenhum projeto publicado ainda.</p>
            <Link href="/admin" className={styles.emptyLink}>
              Adicionar via Admin →
            </Link>
          </motion.div>
        )}

        {/* Bento Grid */}
        {hasProjects && (
          <div className={styles.bentoGrid}>
            {projects.map((project, i) => (
              <div
                key={project.githubId}
                className={`${styles.bentoItem} ${
                  i === 0 ? styles.bentoLarge :
                  i === 3 ? styles.bentoWide : ""
                }`}
              >
                <ProjectCard project={project} featured={project.featured} index={i} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {hasProjects && (
          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/portfolio" className={styles.ctaBtn}>
              Ver todos os projetos
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
