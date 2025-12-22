import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

// text → binary (ASCII, safe spacing)
const toBinary = (text: string) =>
  text
    .split("")
    .map((c) =>
      c === " "
        ? " "
        : c.charCodeAt(0).toString(2).padStart(8, "0")
    )
    .join(" ");

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolledRef = useRef(false);

  // number blinking
  const [leftValue, setLeftValue] = useState<"0" | "1">("0");
  const [rightValue, setRightValue] = useState<"0" | "1">("1");

  // binary toggles
  const [headerBinary, setHeaderBinary] = useState(false);
  const [heroBinary, setHeroBinary] = useState(false);
  const [beliefBinary, setBeliefBinary] = useState(false);

  // blink numbers
  useEffect(() => {
    const l = setInterval(() => setLeftValue(v => (v === "0" ? "1" : "0")), 1800);
    const r = setInterval(() => setRightValue(v => (v === "0" ? "1" : "0")), 1100);
    return () => {
      clearInterval(l);
      clearInterval(r);
    };
  }, []);

  // HEADER binary (short appearance)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderBinary(true);
      setTimeout(() => setHeaderBinary(false), 1800);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // HERO binary (rare)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroBinary(true);
      setTimeout(() => setHeroBinary(false), 2500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // BELIEF binary (very rare)
  useEffect(() => {
    const interval = setInterval(() => {
      setBeliefBinary(true);
      setTimeout(() => setBeliefBinary(false), 2600);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  // FIRST SCROLL → MINI FALL
  useEffect(() => {
    const onScroll = () => {
      if (!hasScrolledRef.current && window.scrollY > 30) {
        hasScrolledRef.current = true;
        setGlobalState?.(PageState.SCROLL_FALL);
        setTimeout(() => {
          setGlobalState?.(PageState.CONTENT);
        }, 900);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setGlobalState]);

  return (
    <div className="relative z-10 w-full h-screen overflow-y-scroll snap-y snap-mandatory text-white overflow-x-hidden">

      {/* HEADER */}
      <motion.header
        className="fixed top-8 left-0 w-full flex justify-center z-20 pointer-events-none px-4"
      >
        <motion.h2
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.4 }}
          className={`
            uppercase font-light shimmer text-center
            ${headerBinary ? "tracking-[0.15em] text-white/60" : "tracking-[0.5em] md:tracking-[0.8em]"}
            text-[clamp(0.85rem,3vw,1.6rem)]
            max-w-full break-all
          `}
        >
          {headerBinary ? toBinary("MADEFOX") : "MADEFOX"}
        </motion.h2>
      </motion.header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <motion.div className="space-y-6 w-full max-w-[95vw]">
          <motion.h1
            className={`
              uppercase font-light text-center
              ${heroBinary ? "tracking-[0.12em] text-white/60" : "tracking-[0.24em] md:tracking-[0.35em]"}
              text-[clamp(1.4rem,6vw,4.2rem)]
              break-words
            `}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2 }}
          >
            {heroBinary
              ? toBinary("BUILDING MAGIC WITH")
              : "BUILDING MAGIC WITH"}
          </motion.h1>

          {/* 0 & 1 LINE */}
          <div className="flex items-center justify-center gap-3 md:gap-10 font-light tracking-[0.25em] md:tracking-[0.4em] text-[clamp(1.6rem,7vw,5rem)]">
            <motion.span animate={{ opacity: [0, 1] }}>{leftValue}</motion.span>

            <span className="inline-block w-[7ch] text-center text-white/70 tracking-[0.12em]">
              00100110
            </span>

            <motion.span animate={{ opacity: [0, 1] }}>{rightValue}</motion.span>
          </div>
        </motion.div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div className="space-y-4 w-full max-w-[95vw]">
          <motion.p
            className={`
              uppercase text-center
              ${beliefBinary ? "tracking-[0.1em] text-white/40" : "tracking-[0.2em] md:tracking-[0.3em] opacity-60"}
              text-[clamp(0.8rem,3vw,1.2rem)]
              break-words
            `}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2 }}
          >
            {beliefBinary
              ? toBinary("IF YOU DREAM OF BETTER ALGORITHMS -")
              : "IF YOU DREAM OF BETTER ALGORITHMS -"}
          </motion.p>

          <motion.h2
            className={`
              uppercase font-light text-center
              ${beliefBinary ? "tracking-[0.14em] text-white/60" : "tracking-[0.28em] md:tracking-[0.4em]"}
              text-[clamp(1.3rem,6vw,3.2rem)]
              break-words
            `}
          >
            {beliefBinary
              ? toBinary("YOU ARE ONE OF US")
              : "YOU ARE ONE OF US"}
          </motion.h2>

          <div className="pt-8">
            <button onClick={() => setShowForm(true)}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                className="triangle-pulse stroke-white fill-transparent stroke-[0.6px]"
              >
                <path d="M50 15 L85 85 L15 85 Z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="absolute bottom-6 text-[10px] tracking-[0.3em] uppercase opacity-50">
          <a href="mailto:hello@madefox.com">HELLO@MADEFOX.COM</a>
        </footer>
      </section>

      {/* CONTACT */}
      <AnimatePresence>
        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
