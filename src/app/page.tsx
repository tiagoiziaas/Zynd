"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import TrustBar from "@/components/TrustBar/TrustBar";
import ValueProps from "@/components/ValueProps/ValueProps";
import Solutions from "@/components/Solutions/Solutions";
import Differentials from "@/components/Differentials/Differentials";
import Results from "@/components/Results/Results";
import Process from "@/components/Process/Process";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Portfolio from "@/components/Portfolio/Portfolio";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    // Dynamic scroll tracking link event listeners mapping
    const handleAnchorClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.hash.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash) as HTMLElement;
        if (element) {
          lenis.scrollTo(element, {
            offset: -80,
            duration: 1.5
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClicks);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClicks);
    };
  }, [isLoading]);

  return (
    <>
      {/* 1. Loading Curtain Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* 2. Main Page Sections */}
      {!isLoading && (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Hero />
            <TrustBar />
            <Solutions />
            <ValueProps />
            <Differentials />
            <Results />
            <Portfolio />
            <Process />
            <About />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
