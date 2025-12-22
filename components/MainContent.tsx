import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

// text → binary (ASCII)
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

  // blinking values
  const [leftValue, setLeftValue] = useState<"0" | "1">("0");
  const [rightValue, setRightValue] = useState<"0" | "1">("1");
  const [andValue] = useState<"00100110">("00100110");

  // binary toggles (LOW frequency)
  const [headerBinary, setHeaderBinary] = useState(false);
  const [heroBinary, setHeroBinary] = useState(false);
  const [beliefBinary, setBeliefBinary] = useState(false);

  // number blinking
  useEffect(() => {
    const l = setInterval(() => setLeftValue(v => (v === "0" ? "1" : "0")), 1800);
    const r = setInterval(() => setRightValue(v => (v === "0" ? "1" : "0")), 1100);
    return () => {
      clearInterval(l);
      clearInterval(r);
    };
  }, []);

  // HEADER binary (very rare)
  useEffect(() => {
    const i = setInterval(() => {
      setHeaderBinary(v => !v);
    }, 16000);
    return () => clearInterval(i);
  }, []);

  // HERO binary
  useEffect(() => {
    const i = setInterval(() => {
      setHeroBinary(v => !v);
    }, 9000);
    return () => clearInterval(i);
  }, []);

  // BELIEF binary (even slower)
  useEffect(() => {
    const i = setInterval(() => {
      setBeliefBinary(v => !v);
    }, 12000);
    return () => clearInterval(i);
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

      {/* HEADER — MADEFOX */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.6 }}
        className="fixed top-10 left-0 w-full flex justify-center z-20 pointer-events-none"
      >
        <h2
          className={`
            uppercase font-light whitespace-nowrap shimmer
            ${headerBinary ? "text-white/60 tracking-[0.18em]" : "tracking-[0.6em] md:tracking-[0.8em]"}
            text-[clamp(0.9rem,3vw,1.6rem)]
          `}
        >
          {headerBinary ? toBinary("MADEFOX") : "MADEFOX"}
        </h2>
      </motion.header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2 }}
          className="space-y-8 w-full"
        >
          {/* HERO LINE */}
          <motion.h1
            className={`
              uppercase font-light whitespace-nowrap
              ${heroBinary ? "text-white/60 tracking-[0.15em]" : "tracking-[0.26em] md:tracking-[0.35em]"}
              text-[clamp(1.6rem,6vw,4.5rem)]
            `}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2 }}
          >
            {heroBinary
              ? toBinary("BUILDING MAGIC WITH")
              : "BUILDING MAGIC WITH"}
          </motion.h1>

          {/* 0 & 1 LINE */}
          <div
            className="
              flex items-center justify-center
              gap-4 md:gap-12
              font-light
              tracking-[0.28em] md:tracking-[0.4em]
              text-[clamp(1.8rem,7vw,5.2rem)]
              whitespace-nowrap
            "
          >
            <motion.span key={leftValue} animate={{ opacity: [0, 1] }}>
              {leftValue}
            </motion.span>

            <span className="inline-block w-[7ch] md:w-[8ch] text-center text-white/70 tracking-[0.15em]">
              {andValue}
            </span>

            <motion.span key={rightValue} animate={{ opacity: [0, 1] }}>
              {rightValue}
            </motion.span>
          </div>
        </motion.div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div className="space-y-6 w-full">
          <motion.p
            className={`
              uppercase whitespace-nowrap
              ${beliefBinary ? "text-white/40 tracking-[0.12em]" : "tracking-[0.22em] md:tracking-[0.3em] opacity-60"}
              text-[clamp(0.85rem,3vw,1.3rem)]
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
              uppercase whitespace-nowrap font-light
              ${beliefBinary ? "text-white/60 tracking-[0.18em]" : "tracking-[0.32em] md:tracking-[0.4em]"}
              text-[clamp(1.5rem,6vw,3.3rem)]
            `}
          >
            {beliefBinary
              ? toBinary("YOU ARE ONE OF US")
              : "YOU ARE ONE OF US"}
          </motion.h2>

          <div className="pt-10">
            <button onClick={() => setShowForm(true)}>
              <svg
                width="90"
                height="90"
                viewBox="0 0 100 100"
                className="triangle-pulse stroke-white fill-transparent stroke-[0.6px]"
              >
                <path d="M50 15 L85 85 L15 85 Z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="absolute bottom-8 text-[10px] tracking-[0.35em] uppercase opacity-50">
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
