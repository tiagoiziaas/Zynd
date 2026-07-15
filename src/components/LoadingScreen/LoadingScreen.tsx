"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // 1. Simulate progress that starts fast, slows down at 85%
    let interval: NodeJS.Timeout;
    
    const startProgress = () => {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Speed curves: slower as we go higher
          const diff = prev < 50 ? 5 : prev < 85 ? 2 : 0.5;
          const next = prev + diff;
          return next > 99 ? 99 : next;
        });
      }, 30);
    };

    startProgress();

    // 2. Wait for page/client hydration and window load event to hit 100%
    const handlePageLoad = () => {
      clearInterval(interval);
      setProgress(100);
    };

    if (document.readyState === "complete") {
      // If already loaded, give a short grace period so animations can be seen
      const timeout = setTimeout(() => {
        setProgress(100);
      }, 800);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => {
        window.removeEventListener("load", handlePageLoad);
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsDone(true);
        // Call parent completion after the curtain reveal begins
        const exitTimeout = setTimeout(() => {
          onComplete();
        }, 850); // Matches exit animation duration
        return () => clearTimeout(exitTimeout);
      }, 500); // Wait 500ms at 100% for smooth UI
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className={styles.overlay}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ 
            clipPath: "circle(0% at 50% 50%)",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className={styles.content}>
            {/* SVG Logo - Drawing Stroke Animation */}
            <div className={styles.logoWrapper}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svgLogo}
              >
                {/* Outer tech polygon */}
                <motion.polygon
                  points="20,15 80,15 85,30 15,70 20,85 80,85"
                  stroke="url(#logoGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {/* Inner futuristic "Z" diagonal core */}
                <motion.path
                  d="M30 35 H70 L30 65 H70"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#63e04a" />
                    <stop offset="100%" stopColor="#8cff6b" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Logo Glow Ring */}
              <div className={styles.glowRing}></div>
            </div>

            {/* ZYND Name */}
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              ZYND
            </motion.h1>
            
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6 }}
            >
              HYPERAUTOMATION & AI ARCHITECTURE
            </motion.p>

            {/* Progress Bar & Percentage */}
            <div className={styles.progressSection}>
              <div className={styles.progressBarBg}>
                <motion.div
                  className={styles.progressBarFill}
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
              <div className={styles.progressText}>
                <span className={styles.number}>{Math.floor(progress)}</span>
                <span className={styles.percent}>%</span>
              </div>
            </div>
          </div>
          
          {/* Futuristic Grid Overlay for tech texture */}
          <div className={styles.gridOverlay}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
