import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

/* ================== UTILS ================== */

const charToBinary = (c: string) =>
  c.charCodeAt(0).toString(2).padStart(8, "0");

const wordToBinary = (word: string) =>
  word.split("").map(charToBinary).join(" ");

/* ================== GLITCH WORD LINE ================== */
/* Same system used EVERYWHERE (header, hero, belief) */

const GlitchLine: React.FC<{
  text: string;
  size: string;
  tracking: string;
}> = ({ text, size, tracking }) => {
  const words = text.split(" ");
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const i = setInterval(() => {
      const idx = Math.floor(Math.random() * words.length);
      setActive(idx);
      setTimeout(() => setActive(null), 650);
    }, 3000);
    return () => clearInterval(i);
  }, [words.length]);

  return (
    <div
      className={`flex flex-wrap justify-center ${size} ${tracking}`}
      style={{ lineHeight: "1.15" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="relative mx-[0.35em] inline-flex items-center"
          style={{ height: "1em" }} // LOCK LINE HEIGHT
        >
          {active === i ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5] }}
              transition={{ duration: 0.5 }}
              className="text-white/60 tracking-[0.08em]"
              style={{ transform: "scale(0.75)" }} // SCALE, NOT FONT SIZE
            >
              {wordToBinary(word)}
            </motion.span>
          ) : (
            <span>{word}</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ================== HEADER (LETTER GLITCH) ================== */

const GlitchHeader: React.FC = () => {
  const text = "MADEFOX";
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const i = setInterval(() => {
      const idx = Math.floor(Math.random() * text.length);
      setActive(idx);
      setTimeout(() => setActive(null), 600);
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="
        flex shimmer uppercase font-light
        tracking-[0.45em] md:tracking-[0.8em]
        text-[clamp(0.9rem,3vw,1.6rem)]
      "
      style={{ lineHeight: "1.1" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="relative inline-flex items-center justify-center"
          style={{ width: "1ch", height: "1em" }}
        >
          {active === i ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              transition={{ duration: 0.5 }}
              className="text-white/60 tracking-[0.08em]"
              style={{ transform: "scale(0.7)" }}
            >
              {charToBinary(char)}
            </motion.span>
          ) : (
            <span>{char}</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ================== MAIN ================== */

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

      {/* HEADER */}
      <header className="fixed top-6 w-full flex justify-center z-20 pointer-events-none">
        <GlitchHeader />
      </header>

      {/* HERO */}
      <section className="h-screen snap-start flex items-center justify-center text-center px-4">
        <div className="space-y-6 max-w-[95vw]">
          <GlitchLine
            text="BUILDING MAGIC WITH"
            size="text-[clamp(1.2rem,6vw,4rem)]"
            tracking="tracking-[0.25em] md:tracking-[0.35em]"
          />

          {/* 0 & 1 (AMPERSAND NORMAL) */}
          <div className="flex items-center justify-center gap-6 md:gap-12 text-[clamp(1.5rem,7vw,4.8rem)] tracking-[0.35em] leading-none">
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
