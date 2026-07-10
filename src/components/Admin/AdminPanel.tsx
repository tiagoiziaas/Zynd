"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Eye, EyeOff, Star, GitFork,
  Trash2, Edit3, Check, X, Lock, Zap, ExternalLink,
  ChevronUp, ChevronDown,
} from "lucide-react";
import Github from "@/components/ui/GithubIcon";
import styles from "./AdminPanel.module.css";

interface Project {
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  customDescription: string | null;
  url: string;
  demo: string | null;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  visible: boolean;
  featured: boolean;
  order: number;
  category: string;
}

interface AdminPanelProps {
  password: string;
}

export default function AdminPanel({ password }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [githubUser, setGithubUser] = useState("");
  const [syncMsg, setSyncMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});

  const authHeaders = useCallback(
    () => ({ "Content-Type": "application/json", "x-admin-password": password }),
    [password]
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/update", { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // GitHub Sync
  const handleSync = async () => {
    if (!githubUser.trim()) return;
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/portfolio/sync", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ username: githubUser.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg({ type: "success", text: `✅ ${data.synced} repositórios sincronizados com sucesso!` });
        await loadProjects();
      } else {
        setSyncMsg({ type: "error", text: `❌ Erro: ${data.error}` });
      }
    } catch {
      setSyncMsg({ type: "error", text: "❌ Erro de conexão" });
    } finally {
      setSyncing(false);
    }
  };

  // Toggle visibility
  const toggleVisible = async (project: Project) => {
    const updated = { ...project, visible: !project.visible };
    await fetch("/api/portfolio/update", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ githubId: project.githubId, visible: updated.visible }),
    });
    setProjects((prev) => prev.map((p) => (p.githubId === project.githubId ? updated : p)));
  };

  // Toggle featured
  const toggleFeatured = async (project: Project) => {
    const updated = { ...project, featured: !project.featured };
    await fetch("/api/portfolio/update", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ githubId: project.githubId, featured: updated.featured }),
    });
    setProjects((prev) => prev.map((p) => (p.githubId === project.githubId ? updated : p)));
  };

  // Move order
  const moveOrder = async (project: Project, direction: "up" | "down") => {
    const idx = projects.findIndex((p) => p.githubId === project.githubId);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === projects.length - 1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newProjects = [...projects];
    [newProjects[idx], newProjects[swapIdx]] = [newProjects[swapIdx], newProjects[idx]];
    // Update orders
    const updates = newProjects.map((p, i) => ({ githubId: p.githubId, order: i }));
    setProjects(newProjects.map((p, i) => ({ ...p, order: i })));
    await Promise.all(
      updates.map((u) =>
        fetch("/api/portfolio/update", {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(u),
        })
      )
    );
  };

  // Save edit
  const saveEdit = async (githubId: number) => {
    await fetch("/api/portfolio/update", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ githubId, ...editData }),
    });
    setProjects((prev) =>
      prev.map((p) => (p.githubId === githubId ? { ...p, ...editData } : p))
    );
    setEditingId(null);
    setEditData({});
  };

  // Delete
  const deleteProject = async (githubId: number) => {
    if (!confirm("Remover este projeto do portfólio?")) return;
    await fetch("/api/portfolio/update", {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ githubId }),
    });
    setProjects((prev) => prev.filter((p) => p.githubId !== githubId));
  };

  const visible = projects.filter((p) => p.visible).length;

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Zap size={18} />
          </div>
          <div>
            <h1 className={styles.panelTitle}>Portfolio Admin</h1>
            <p className={styles.panelSub}>{projects.length} projetos · {visible} visíveis</p>
          </div>
        </div>
      </div>

      {/* Sync Bar */}
      <div className={styles.syncBar}>
        <div className={styles.syncLeft}>
          <Github size={16} className={styles.syncIcon} />
          <span className={styles.syncLabel}>Sync GitHub</span>
        </div>
        <div className={styles.syncRight}>
          <input
            type="text"
            placeholder="username do GitHub"
            value={githubUser}
            onChange={(e) => setGithubUser(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSync()}
            className={styles.syncInput}
          />
          <button
            onClick={handleSync}
            disabled={syncing || !githubUser.trim()}
            className={styles.syncBtn}
          >
            <RefreshCw size={14} className={syncing ? styles.spinning : ""} />
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>
      </div>

      {/* Sync message */}
      <AnimatePresence>
        {syncMsg && (
          <motion.div
            className={`${styles.syncMsg} ${syncMsg.type === "error" ? styles.syncMsgError : ""}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {syncMsg.text}
            <button className={styles.dismissBtn} onClick={() => setSyncMsg(null)}>
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project List */}
      {loading ? (
        <div className={styles.loadingList}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonRow} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className={styles.emptyState}>
          <Github size={36} className={styles.emptyIcon} />
          <p>Nenhum projeto. Sincronize com seu GitHub acima.</p>
        </div>
      ) : (
        <div className={styles.projectList}>
          {projects.map((project) => (
            <motion.div
              key={project.githubId}
              className={`${styles.projectRow} ${!project.visible ? styles.projectHidden : ""}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {editingId === project.githubId ? (
                /* Edit Mode */
                <div className={styles.editBlock}>
                  <div className={styles.editFields}>
                    <label className={styles.editLabel}>
                      Descrição customizada
                      <textarea
                        className={styles.editTextarea}
                        defaultValue={project.customDescription || project.description}
                        onChange={(e) => setEditData((d) => ({ ...d, customDescription: e.target.value, description: e.target.value }))}
                        rows={3}
                      />
                    </label>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>
                        Categoria
                        <input
                          className={styles.editInput}
                          defaultValue={project.category}
                          onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                        />
                      </label>
                      <label className={styles.editLabel}>
                        Link Demo (URL)
                        <input
                          className={styles.editInput}
                          defaultValue={project.demo || ""}
                          placeholder="https://..."
                          onChange={(e) => setEditData((d) => ({ ...d, demo: e.target.value || null }))}
                        />
                      </label>
                    </div>
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.saveBtn} onClick={() => saveEdit(project.githubId)}>
                      <Check size={14} /> Salvar
                    </button>
                    <button className={styles.cancelBtn} onClick={() => { setEditingId(null); setEditData({}); }}>
                      <X size={14} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className={styles.rowOrder}>
                    <button className={styles.orderBtn} onClick={() => moveOrder(project, "up")} title="Mover para cima">
                      <ChevronUp size={12} />
                    </button>
                    <button className={styles.orderBtn} onClick={() => moveOrder(project, "down")} title="Mover para baixo">
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  <div className={styles.rowInfo}>
                    <div className={styles.rowTop}>
                      <span className={styles.rowName}>{project.name}</span>
                      {project.featured && <span className={styles.featuredTag}>★ Destaque</span>}
                      <span className={styles.langTag}>{project.language}</span>
                    </div>
                    <p className={styles.rowDesc}>{project.description || "Sem descrição."}</p>
                    <div className={styles.rowStats}>
                      <span className={styles.stat}><Star size={11} /> {project.stars}</span>
                      <span className={styles.stat}><GitFork size={11} /> {project.forks}</span>
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                        <ExternalLink size={11} /> GitHub
                      </a>
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <button
                      className={`${styles.actionBtn} ${project.featured ? styles.featuredActive : ""}`}
                      onClick={() => toggleFeatured(project)}
                      title="Toggle destaque"
                    >
                      ★
                    </button>
                    <button
                      className={`${styles.actionBtn} ${!project.visible ? styles.hiddenActive : ""}`}
                      onClick={() => toggleVisible(project)}
                      title={project.visible ? "Ocultar" : "Mostrar"}
                    >
                      {project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => { setEditingId(project.githubId); setEditData({}); }}
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => deleteProject(project.githubId)}
                      title="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Auth gate wrapper
export function AdminGate() {
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const tryLogin = async () => {
    setChecking(true);
    setError(false);
    // Validate against API
    const res = await fetch("/api/portfolio/update", {
      headers: { "x-admin-password": input },
    });
    if (res.ok) {
      setPassword(input);
    } else {
      setError(true);
    }
    setChecking(false);
  };

  if (password) return <AdminPanel password={password} />;

  return (
    <div className={styles.authGate}>
      <div className={styles.authBox}>
        <div className={styles.authIcon}>
          <Lock size={24} />
        </div>
        <h2 className={styles.authTitle}>Admin Access</h2>
        <p className={styles.authSub}>Digite a senha para continuar</p>
        <input
          type="password"
          placeholder="••••••••"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryLogin()}
          className={`${styles.authInput} ${error ? styles.authInputError : ""}`}
          autoFocus
        />
        {error && <p className={styles.authError}>Senha incorreta.</p>}
        <button
          className={styles.authBtn}
          onClick={tryLogin}
          disabled={checking || !input}
        >
          {checking ? "Verificando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
