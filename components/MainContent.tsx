import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

/* Convert a single word to binary */
const wordToBinary = (word: string) =>
  word
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");

const AnimatedLine: React.FC<{
  text: string;
  fontSize: string;
  tracking: string;
  binaryInterval: number;
}> = ({ text, fontSize, tracking, binaryInterval }) => {
  const words = text.split(" ");
  const [binaryIndex, setBinaryIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBinaryIndex(Math.floor(Math.random() * words.length));
      setTimeout(() => setBinaryIndex(null), 1800);
    }, binaryInterval);

    return () => clearInterval(interval);
  }, [words.length, binaryInterval]);

  return (
    <div className={`flex flex-wrap justify-center ${tracking} ${fontSize}`}>
      {words.map((word, i) => (
        <span key={i} className="mx-[0.3em] relative">
          {binaryIndex === i ? (
            <span className="text-white/60 tracking-[0.1em] text-[0.85em] whitespace-nowrap">
              {wordToBinary(word)}
            </span>
          ) : (
            <span className="whitespace-nowrap">{word}</span>
          )}
        </span>
      ))}
    </div>
  );
};

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolledRef = useRef(false);

  // 0 / 1 blinking
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
      <header className="fixed top-8 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
        <AnimatedLine
          text="MADEFOX"
          fontSize="text-[clamp(0.9rem,3vw,1.6rem)]"
          tracking="tracking-[0.45em]"
          binaryInterval={18000}
        />
      </header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6 w-full max-w-[95vw]">
          <AnimatedLine
            text="BUILDING MAGIC WITH"
            fontSize="text-[clamp(1.4rem,6vw,4.2rem)]"
            tracking="tracking-[0.22em] md:tracking-[0.35em]"
            binaryInterval={9000}
          />

          {/* 0 & 1 */}
          <div className="flex items-center justify-center gap-3 md:gap-10 font-light tracking-[0.25em] md:tracking-[0.4em] text-[clamp(1.6rem,7vw,5rem)]">
            <motion.span animate={{ opacity: [0, 1] }}>{leftValue}</motion.span>
            <span className="inline-block w-[7ch] text-center text-white/70 tracking-[0.12em]">
              00100110
            </span>
            <motion.span animate={{ opacity: [0, 1] }}>{rightValue}</motion.span>
          </div>
        </div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4 relative">
        <div className="space-y-4 w-full max-w-[95vw]">
          <AnimatedLine
            text="IF YOU DREAM OF BETTER ALGORITHMS -"
            fontSize="text-[clamp(0.8rem,3vw,1.2rem)]"
            tracking="tracking-[0.18em] md:tracking-[0.3em]"
            binaryInterval={14000}
          />

          <AnimatedLine
            text="YOU ARE ONE OF US"
            fontSize="text-[clamp(1.3rem,6vw,3.2rem)]"
            tracking="tracking-[0.28em] md:tracking-[0.4em]"
            binaryInterval={16000}
          />

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
