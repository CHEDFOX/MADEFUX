import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

/* ===================== UTIL ===================== */

const charToBinary = (c: string) =>
  c.charCodeAt(0).toString(2).padStart(8, "0");

const wordToBinary = (word: string) =>
  word.split("").map(charToBinary).join(" ");

/* ===================== GLITCH LINE (WIDTH-STABLE) ===================== */

const GlitchLine: React.FC<{
  text: string;
  size: string;
  tracking: string;
}> = ({ text, size, tracking }) => {
  const words = text.split(" ");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * words.length);
      setActiveIndex(idx);
      setTimeout(() => setActiveIndex(null), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div
      className={`flex justify-center flex-wrap ${size} ${tracking}`}
      style={{ lineHeight: "1.15" }}
    >
      {words.map((word, i) => {
        // Reserve enough width so binary never expands line
        const reservedWidthCh = Math.max(word.length * 8, word.length * 1.2);

        return (
          <span
            key={i}
            className="relative mx-[0.35em] inline-flex items-center justify-center"
            style={{
              height: "1em",
              minWidth: `${reservedWidthCh}ch`,
            }}
          >
            {activeIndex === i ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{ duration: 0.5 }}
                className="text-white/60 tracking-[0.08em]"
                style={{
                  transform: "scale(0.7)",
                  whiteSpace: "nowrap",
                }}
              >
                {wordToBinary(word)}
              </motion.span>
            ) : (
              <span style={{ whiteSpace: "nowrap" }}>{word}</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

/* ===================== MAIN ===================== */

const MainContent: React.FC<{ setGlobalState?: (s: PageState) => void }> = ({
  setGlobalState,
}) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolled = useRef(false);

  // blinking numbers
  const [left, setLeft] = useState<"0" | "1">("0");
  const [right, setRight] = useState<"0" | "1">("1");

  useEffect(() => {
    const l = setInterval(() => setLeft(v => (v === "0" ? "1" : "0")), 1800);
    const r = setInterval(() => setRight(v => (v === "0" ? "1" : "0")), 1100);
    return () => {
      clearInterval(l);
      clearInterval(r);
    };
  }, []);

  // first scroll → threshold animation
  useEffect(() => {
    const onScroll = () => {
      if (!hasScrolled.current && window.scrollY > 30) {
        hasScrolled.current = true;
        setGlobalState?.(PageState.SCROLL_FALL);
        setTimeout(() => setGlobalState?.(PageState.CONTENT), 900);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setGlobalState]);

  return (
    <div className="relative h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden text-white">

      {/* ===================== FIXED LOGO ===================== */}
      <header className="fixed top-6 left-0 w-full flex justify-center z-30 pointer-events-none">
        <h1
          className="
            uppercase font-light shimmer
            text-[clamp(1rem,3.5vw,1.8rem)]
            tracking-[0.35em]
            text-white
          "
        >
          MADEFOX
        </h1>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="h-screen snap-start flex items-center justify-center text-center px-4">
        <div className="space-y-6 max-w-[95vw]">
          <GlitchLine
            text="BUILDING MAGIC WITH"
            size="text-[clamp(1.1rem,4.5vw,2.8rem)]"
            tracking="tracking-[0.25em] md:tracking-[0.3em]"
          />

          {/* 0 & 1 — NORMAL AMPERSAND */}
          <div className="flex items-center justify-center gap-6 md:gap-10 tracking-[0.3em] text-[clamp(1.4rem,6vw,3.2rem)] leading-none">
            <motion.span animate={{ opacity: [0, 1] }}>{left}</motion.span>
            <span>&</span>
            <motion.span animate={{ opacity: [0, 1] }}>{right}</motion.span>
          </div>
        </div>
      </section>

      {/* ===================== BELIEF ===================== */}
      <section className="h-screen snap-start flex items-center justify-center text-center px-4 relative">
        <div className="space-y-4 max-w-[95vw]">
          <GlitchLine
            text="IF YOU DREAM OF BETTER ALGORITHMS -"
            size="text-[clamp(0.85rem,3vw,1.2rem)]"
            tracking="tracking-[0.2em] md:tracking-[0.3em]"
          />

          <GlitchLine
            text="YOU ARE ONE OF US"
            size="text-[clamp(1.2rem,6vw,3rem)]"
            tracking="tracking-[0.3em] md:tracking-[0.4em]"
          />

          <div className="pt-8">
            <button onClick={() => setShowForm(true)}>
              <svg
                width="76"
                height="76"
                viewBox="0 0 100 100"
                className="triangle-pulse stroke-white fill-transparent stroke-[0.6px]"
              >
                <path d="M50 15 L85 85 L15 85 Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="absolute bottom-6 text-[10px] tracking-[0.3em] uppercase opacity-50">
          <a href="mailto:hello@madefox.com">HELLO@MADEFOX.COM</a>
        </footer>
      </section>

      {/* ===================== CONTACT ===================== */}
      <AnimatePresence>
        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
