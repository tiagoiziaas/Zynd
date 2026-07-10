"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MagneticBtn from "../ui/MagneticBtn";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { id: "hero", label: "Início" },
  { id: "solutions", label: "Soluções" },
  { id: "differentials", label: "Diferenciais" },
  { id: "results", label: "Resultados" },
  { id: "portfolio", label: "Portfólio" },
  { id: "process", label: "Processo" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Monitor scroll to change navbar background style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Active Section Tracker using IntersectionObserver
  useEffect(() => {
    const observers = NAV_ITEMS.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        {
          rootMargin: "-45% 0px -45% 0px", // Detect when section is in the middle of viewport
          threshold: 0.1,
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.navContainer}`}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => handleNavClick("hero")}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="20,15 80,15 85,30 15,70 20,85 80,85" stroke="url(#navLogoGradient)" strokeWidth="8" fill="none" />
              <path d="M30 35 H70 L30 65 H70" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navLogoGradient" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#0066ff" />
                  <stop offset="100%" stopColor="#00d9ff" />
                </linearGradient>
              </defs>
            </svg>
            <span className={styles.logoText}>ZYND</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className={styles.desktopNav}>
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id} className={styles.navItem}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="activePill"
                          className={styles.activePill}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className={styles.ctaWrapper}>
            <MagneticBtn>
              <button onClick={() => handleNavClick("contact")} className={styles.ctaBtn}>
                Fale Conosco
              </button>
            </MagneticBtn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileDrawer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobileDrawerContent}>
              <ul className={styles.mobileNavList}>
                {NAV_ITEMS.map((item) => (
                  <li key={item.id} className={styles.mobileNavItem}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`${styles.mobileNavLink} ${
                        activeSection === item.id ? styles.mobileActive : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleNavClick("contact")}
                className={styles.mobileCtaBtn}
              >
                Fale Conosco
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
