import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

/* ---------- UTILITIES ---------- */

// convert single character to binary
const charToBinary = (char: string) =>
  char.charCodeAt(0).toString(2).padStart(8, "0");

// convert word to binary
const wordToBinary = (word: string) =>
  word
    .split("")
    .map((c) => charToBinary(c))
    .join(" ");

/* ---------- COMPONENTS ---------- */

// COMPANY NAME WITH LETTER-LEVEL GLITCH
const GlitchHeader: React.FC = () => {
  const text = "MADEFOX";
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * text.length);
      setGlitchIndex(index);
      setTimeout(() => setGlitchIndex(null), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <h2 className="uppercase font-light shimmer tracking-[0.5em] md:tracking-[0.8em] text-[clamp(0.8rem,3vw,1.6rem)] flex">
      {text.split("").map((char, i) => (
        <span key={i} className="relative mx-[0.12em]">
          {glitchIndex === i ? (
            <motion.span
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.4] }}
              transition={{ duration: 0.5 }}
              className="text-white/60 text-[0.75em] tracking-[0.1em]"
            >
              {charToBinary(char)}
            </motion.span>
          ) : (
            char
          )}
        </span>
      ))}
    </h2>
  );
};

// WORD-LEVEL BINARY GLITCH LINE
const GlitchLine: React.FC<{
  text: string;
  fontSize: string;
  tracking: string;
}> = ({ text, fontSize, tracking }) => {
  const words = text.split(" ");
  const [glitchWord, setGlitchWord] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * words.length);
      setGlitchWord(index);
      setTimeout(() => setGlitchWord(null), 700);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div
      className={`flex flex-wrap justify-center ${fontSize} ${tracking} leading-tight max-w-[92vw]`}
    >
      {words.map((word, i) => (
        <span key={i} className="mx-[0.3em] whitespace-nowrap">
          {glitchWord === i ? (
            <motion.span
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.5] }}
              transition={{ duration: 0.5 }}
              className="text-white/60 text-[0.75em] tracking-[0.1em]"
            >
              {wordToBinary(word)}
            </motion.span>
          ) : (
            word
          )}
        </span>
      ))}
    </div>
  );
};

/* ---------- MAIN ---------- */

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolledRef = useRef(false);

  // blinking numbers
  const [leftValue, setLeftValue] = useState<"0" | "1">("0");
  const [rightValue, setRightValue] = useState<"0" | "1">("1");

  useEffect(() => {
    const l = setInterval(() => setLeftValue(v => (v === "0" ? "1" : "0")), 1800);
    const r = setInterval(() => setRightValue(v => (v === "0" ? "1" : "0")), 1100);
    return () => {
      clearInterval(l);
      clearInterval(r);
    };
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
      <header className="fixed top-6 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
        <GlitchHeader />
      </header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6">
          <GlitchLine
            text="BUILDING MAGIC WITH"
            fontSize="text-[clamp(1.2rem,6vw,4rem)]"
            tracking="tracking-[0.22em] md:tracking-[0.35em]"
          />

          {/* 0 & 1 */}
          <div className="flex items-center justify-center gap-4 md:gap-10 font-light tracking-[0.25em] md:tracking-[0.4em] text-[clamp(1.5rem,7vw,4.8rem)]">
            <motion.span animate={{ opacity: [0, 1] }}>{leftValue}</motion.span>

            {/* fixed-width binary & */}
            <span className="inline-block w-[6ch] text-center text-white/60 tracking-[0.12em] text-[0.7em]">
              00100110
            </span>

            <motion.span animate={{ opacity: [0, 1] }}>{rightValue}</motion.span>
          </div>
        </div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4 relative">
        <div className="space-y-4">
          <GlitchLine
            text="IF YOU DREAM OF BETTER ALGORITHMS -"
            fontSize="text-[clamp(0.75rem,3vw,1.2rem)]"
            tracking="tracking-[0.18em] md:tracking-[0.3em]"
          />

          <GlitchLine
            text="YOU ARE ONE OF US"
            fontSize="text-[clamp(1.2rem,6vw,3rem)]"
            tracking="tracking-[0.28em] md:tracking-[0.4em]"
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

      {/* CONTACT */}
      <AnimatePresence>
        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
