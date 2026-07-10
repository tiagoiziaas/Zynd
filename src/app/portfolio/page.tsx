"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import Github from "@/components/ui/GithubIcon";
import Link from "next/link";
import ProjectCard, { type Project } from "@/components/Portfolio/ProjectCard";
import styles from "./page.module.css";

const ALL_LABEL = "Todos";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(ALL_LABEL);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const languages = [ALL_LABEL, ...Array.from(new Set(projects.map((p) => p.language))).sort()];

  const filtered = projects.filter((p) => {
    const matchFilter = activeFilter === ALL_LABEL || p.language === activeFilter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* Back nav */}
      <div className={styles.topNav}>
        <div className="container">
          <Link href="/" className={styles.backLink}>
            ← Voltar para o site
          </Link>
        </div>
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.badge}>
            <Github size={13} />
            <span>GitHub Portfolio</span>
          </div>
          <h1 className={styles.title}>
            Todos os{" "}
            <span className="blue-gradient">Projetos</span>
          </h1>
          <p className={styles.subtitle}>
            {projects.length} projetos • sincronizados diretamente do GitHub
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className={styles.controls}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <div className={styles.searchWrapper}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Language filters */}
          <div className={styles.filters}>
            <Filter size={14} className={styles.filterIcon} />
            {languages.map((lang) => (
              <button
                key={lang}
                className={`${styles.filterBtn} ${activeFilter === lang ? styles.filterActive : ""}`}
                onClick={() => setActiveFilter(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading && (
          <div className={styles.grid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p>Nenhum projeto encontrado para &ldquo;{search}&rdquo;.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((project, i) => (
              <ProjectCard key={project.githubId} project={project} featured={project.featured} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
