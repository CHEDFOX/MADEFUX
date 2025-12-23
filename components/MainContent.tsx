import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

/* ===================== UTIL ===================== */

const charToBinary = (c: string) =>
  c.charCodeAt(0).toString(2).padStart(8, "0");

const wordToBinary = (word: string) =>
  word.split("").map(charToBinary).join(" ");

/* ===================== GLITCH WORD ===================== */
/* Width-locked word → ZERO layout shift */

const GlitchWord: React.FC<{
  word: string;
  active: boolean;
}> = ({ word, active }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  // Measure max width (binary vs normal)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const span = containerRef.current;
    const original = span.innerText;

    span.innerText = wordToBinary(word);
    const binaryWidth = span.getBoundingClientRect().width;

    span.innerText = word;
    const normalWidth = span.getBoundingClientRect().width;

    setWidth(Math.max(binaryWidth, normalWidth));
  }, [word]);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex justify-center items-center"
      style={{
        width: width ? `${width}px` : "auto",
        height: "1em",
      }}
    >
      <AnimatePresence>
        {active ? (
          <motion.span
            key="binary"
            initial={{ opacity: 0, x: -2 }}
            animate={{
              opacity: [0.4, 1, 0.6],
              x: [-2, 2, -1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="
              absolute inset-0 flex items-center justify-center
              text-white/70 tracking-[0.08em]
              text-[0.7em]
            "
          >
            {wordToBinary(word)}
          </motion.span>
        ) : (
          <motion.span
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {word}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

/* ===================== GLITCH LINE ===================== */

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
      setTimeout(() => setActiveIndex(null), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div
      className={`flex flex-wrap justify-center ${size} ${tracking}`}
      style={{ lineHeight: "1.15" }}
    >
      {words.map((word, i) => (
        <span key={i} className="mx-[0.35em]">
          <GlitchWord word={word} active={activeIndex === i} />
        </span>
      ))}
    </div>
  );
};

/* ===================== MAIN ===================== */

const MainContent: React.FC<{ setGlobalState?: (s: PageState) => void }> = ({
  setGlobalState,
}) => {
  const [showForm, setShowForm] = useState(false);
  const scrolled = useRef(false);

  const [l, setL] = useState<"0" | "1">("0");
  const [r, setR] = useState<"0" | "1">("1");

  useEffect(() => {
    const a = setInterval(() => setL(v => (v === "0" ? "1" : "0")), 1800);
    const b = setInterval(() => setR(v => (v === "0" ? "1" : "0")), 1100);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!scrolled.current && window.scrollY > 30) {
        scrolled.current = true;
        setGlobalState?.(PageState.SCROLL_FALL);
        setTimeout(() => setGlobalState?.(PageState.CONTENT), 900);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setGlobalState]);

  return (
    <div className="relative h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden text-white">

      {/* FIXED LOGO */}
      <header className="fixed top-6 w-full flex justify-center z-30 pointer-events-none">
        <h1 className="uppercase font-light shimmer tracking-[0.35em] text-[clamp(1rem,3.5vw,1.8rem)]">
          MADEFOX
        </h1>
      </header>

      {/* HERO */}
      <section className="h-screen snap-start flex items-center justify-center text-center px-4">
        <div className="space-y-6 max-w-[95vw]">
          <GlitchLine
            text="BUILDING MAGIC WITH"
            size="text-[clamp(1.1rem,4.5vw,2.8rem)]"
            tracking="tracking-[0.25em] md:tracking-[0.3em]"
          />

          <div className="flex items-center justify-center gap-6 md:gap-10 tracking-[0.3em] text-[clamp(1.4rem,6vw,3.2rem)] leading-none">
            <motion.span animate={{ opacity: [0, 1] }}>{l}</motion.span>
            <span>&</span>
            <motion.span animate={{ opacity: [0, 1] }}>{r}</motion.span>
          </div>
        </div>
      </section>

      {/* BELIEF */}
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

        <footer className="absolute bottom-6 text-[10px] tracking-[0.3em] uppercase opacity-50">
          <a href="mailto:hello@madefox.com">HELLO@MADEFOX.COM</a>
        </footer>
      </section>

      <AnimatePresence>
        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
