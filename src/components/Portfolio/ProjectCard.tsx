"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, GitFork, ExternalLink, Github, Clock } from "lucide-react";
import styles from "./ProjectCard.module.css";

export interface Project {
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  demo: string | null;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  featured: boolean;
  category: string;
  coverImage: string | null;
  visible: boolean;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#ed8b00",
  "C#": "#239120",
  CSS: "#1572b6",
  HTML: "#e34c26",
  Shell: "#89e051",
  Other: "#8b949e",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 30) return `${days}d atrás`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m atrás`;
  return `${Math.floor(months / 12)}a atrás`;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  index: number;
}

export default function ProjectCard({ project, featured = false, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(springY, [-150, 150], [8, -8]);
  const rotateY = useTransform(springX, [-150, 150], [-8, 8]);
  const glowX = useTransform(springX, [-150, 150], [0, 100]);
  const glowY = useTransform(springY, [-150, 150], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const langColor = LANG_COLORS[project.language] || LANG_COLORS.Other;

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {/* Dynamic glow that follows the mouse */}
      <motion.div
        className={styles.mouseGlow}
        style={{
          background: `radial-gradient(400px circle at ${glowX}% ${glowY}%, rgba(0,102,255,0.12), transparent 70%)`,
        }}
      />

      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Top bar */}
      <div className={styles.cardTop}>
        <div className={styles.langBadge} style={{ "--lang-color": langColor } as React.CSSProperties}>
          <span className={styles.langDot} />
          <span>{project.language}</span>
        </div>
        {project.featured && (
          <span className={styles.featuredBadge}>★ Destaque</span>
        )}
        <div className={styles.cardLinks}>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Demo">
              <ExternalLink size={14} />
            </a>
          )}
          <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="GitHub">
            <Github size={14} />
          </a>
        </div>
      </div>

      {/* Project Name */}
      <h3 className={styles.projectName}>{project.name}</h3>

      {/* Description */}
      <p className={styles.projectDesc}>
        {project.description || "Sem descrição disponível."}
      </p>

      {/* Topics */}
      {project.topics.length > 0 && (
        <div className={styles.topics}>
          {project.topics.slice(0, 4).map((t) => (
            <span key={t} className={styles.topic}>{t}</span>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className={styles.cardFooter}>
        <div className={styles.stat}>
          <Star size={12} />
          <span>{project.stars.toLocaleString("pt-BR")}</span>
        </div>
        <div className={styles.stat}>
          <GitFork size={12} />
          <span>{project.forks.toLocaleString("pt-BR")}</span>
        </div>
        <div className={`${styles.stat} ${styles.statMuted}`}>
          <Clock size={12} />
          <span>{timeAgo(project.pushedAt)}</span>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className={styles.bottomGlow} />
    </motion.div>
  );
}
