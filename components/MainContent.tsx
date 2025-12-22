import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

/* ===== UTIL ===== */
const charToBinary = (c: string) =>
  c.charCodeAt(0).toString(2).padStart(8, "0");

const wordToBinary = (word: string) =>
  word.split("").map(charToBinary).join(" ");

/* ===== HEADER (LETTER GLITCH, NO LAYOUT SHIFT) ===== */
const GlitchHeader: React.FC = () => {
  const text = "MADEFOX";
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const i = setInterval(() => {
      const rand = Math.floor(Math.random() * text.length);
      setIndex(rand);
      setTimeout(() => setIndex(null), 600);
    }, 3000);
    return () => clearInterval(i);
  }, [text.length]);

  return (
    <div className="relative flex shimmer tracking-[0.6em] md:tracking-[0.8em] text-[clamp(0.9rem,3vw,1.6rem)] leading-none">
      {text.split("").map((char, i) => (
        <span key={i} className="relative w-[1ch] text-center">
          {/* original letter */}
          <span className="opacity-100">{char}</span>

          {/* binary overlay */}
          {index === i && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              transition={{ duration: 0.6 }}
              className="
                absolute inset-0
                text-white/60
                text-[0.6em]
                tracking-[0.1em]
                scale-[0.85]
              "
            >
              {charToBinary(char)}
            </motion.span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ===== WORD GLITCH LINE (NO HEIGHT CHANGE) ===== */
const GlitchLine: React.FC<{
  text: string;
  fontSize: string;
  tracking: string;
}> = ({ text, fontSize, tracking }) => {
  const words = text.split(" ");
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex(Math.floor(Math.random() * words.length));
      setTimeout(() => setIndex(null), 700);
    }, 3000);
    return () => clearInterval(i);
  }, [words.length]);

  return (
    <div
      className={`flex justify-center flex-wrap ${fontSize} ${tracking}`}
      style={{ lineHeight: "1.1" }} // LOCKED
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="relative mx-[0.35em] inline-flex items-center"
          style={{ height: "1em" }} // RESERVE SPACE
        >
          {/* original word */}
          <span className="opacity-100">{word}</span>

          {/* binary overlay */}
          {index === i && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              transition={{ duration: 0.6 }}
              className="
                absolute inset-0
                flex items-center justify-center
                text-white/60
                tracking-[0.1em]
                scale-[0.75]
              "
            >
              {wordToBinary(word)}
            </motion.span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ===== MAIN ===== */
const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolled = useRef(false);

  // blinking numbers
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

  // first scroll → mini fall
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
    <div className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory text-white overflow-x-hidden">

      {/* HEADER */}
      <header className="fixed top-6 w-full flex justify-center z-20 pointer-events-none">
        <GlitchHeader />
      </header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6 max-w-[95vw]">
          <GlitchLine
            text="BUILDING MAGIC WITH"
            fontSize="text-[clamp(1.2rem,6vw,4rem)]"
            tracking="tracking-[0.25em] md:tracking-[0.35em]"
          />

          {/* 0 & 1 — NO OVERLAP */}
          <div className="flex items-center justify-center gap-6 md:gap-12 text-[clamp(1.5rem,7vw,4.8rem)] tracking-[0.35em] leading-none">
            <motion.span animate={{ opacity: [0, 1] }}>{l}</motion.span>

            {/* fixed width ampersand */}
            <span className="inline-flex items-center justify-center w-[7ch]">
              <span className="text-[0.6em] tracking-[0.12em] text-white/60">
                00100110
              </span>
            </span>

            <motion.span animate={{ opacity: [0, 1] }}>{r}</motion.span>
          </div>
        </div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4 relative">
        <div className="space-y-4 max-w-[95vw]">
          <GlitchLine
            text="IF YOU DREAM OF BETTER ALGORITHMS -"
            fontSize="text-[clamp(0.8rem,3vw,1.2rem)]"
            tracking="tracking-[0.2em] md:tracking-[0.3em]"
          />

          <GlitchLine
            text="YOU ARE ONE OF US"
            fontSize="text-[clamp(1.2rem,6vw,3rem)]"
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
