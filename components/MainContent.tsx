import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

/* ===================== UTIL ===================== */

const charToBinary = (c: string) =>
  c.charCodeAt(0).toString(2).padStart(8, "0");

const wordToBinary = (word: string) =>
  word.split("").map(charToBinary).join(" ");

/* ===================== SHARED TEXT SYSTEM ===================== */
/* SAME SIZE, SAME ALIGNMENT EVERYWHERE */

const TEXT_SIZE =
  "text-[clamp(1rem,4.2vw,2.4rem)]"; // ONE SYSTEM
const TEXT_TRACKING =
  "tracking-[0.28em] md:tracking-[0.32em]";

/* ===================== GLITCH LINE ===================== */

const GlitchLine: React.FC<{ text: string }> = ({ text }) => {
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
      className={`flex flex-wrap justify-center ${TEXT_SIZE} ${TEXT_TRACKING}`}
      style={{
        lineHeight: "1.15",
        maxWidth: "92vw",
        marginInline: "auto",
      }}
    >
      {words.map((word, i) => {
        const reservedWidth = word.length * 8;

        return (
          <span
            key={i}
            className="relative mx-[0.35em] inline-flex items-center justify-center"
            style={{
              height: "1em",
              minWidth: `${reservedWidth}ch`,
            }}
          >
            {activeIndex === i ? (
              <span
                className="cyber-glitch text-white/70"
                style={{
                  transform: "scale(0.6)", // 🔑 ONLY CHANGE
                  transformOrigin: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {wordToBinary(word)}
              </span>
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
  const [fallOnce, setFallOnce] = useState(false);
  const hasScrolled = useRef(false);

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

  // FIRST SCROLL → FALL ONCE
  useEffect(() => {
    const onScroll = () => {
      if (!hasScrolled.current && window.scrollY > 40) {
        hasScrolled.current = true;
        setFallOnce(true);
        setGlobalState?.(PageState.SCROLL_FALL);

        setTimeout(() => {
          setFallOnce(false);
          setGlobalState?.(PageState.CONTENT);
        }, 700);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setGlobalState]);

  return (
    <>
      {/* INLINE CSS */}
      <style>{`
        @keyframes cyberGlitch {
          0% { text-shadow: none; clip-path: inset(0); }
          20% { text-shadow: 2px 0 red, -2px 0 cyan; clip-path: inset(20% 0 60% 0); }
          40% { text-shadow: -2px 0 red, 2px 0 cyan; clip-path: inset(60% 0 20% 0); }
          100% { text-shadow: none; clip-path: inset(0); }
        }
        .cyber-glitch {
          animation: cyberGlitch 0.35s steps(2, end);
        }
        @keyframes fallThrough {
          from { transform: translateY(0); filter: blur(0); }
          to { transform: translateY(120px); filter: blur(6px); }
        }
        .fall-once {
          animation: fallThrough 0.6s ease-in forwards;
        }
      `}</style>

      <div className="relative h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden text-white">

        {/* FIXED LOGO */}
        <header className="fixed top-6 left-0 w-full flex justify-center z-30 pointer-events-none">
          <h1 className="uppercase font-light shimmer tracking-[0.35em] text-[clamp(1rem,3.5vw,1.8rem)]">
            MADEFOX
          </h1>
        </header>

        {/* VIEWPORT 1 */}
        <section
          className={`h-screen snap-start flex items-center justify-center text-center px-4 ${
            fallOnce ? "fall-once" : ""
          }`}
        >
          <div className="space-y-6 w-full">
            <GlitchLine text="BUILDING MAGIC WITH" />

            <div className={`flex items-center justify-center gap-6 ${TEXT_SIZE} ${TEXT_TRACKING}`}>
              <motion.span>{left}</motion.span>
              <span>&</span>
              <motion.span>{right}</motion.span>
            </div>
          </div>
        </section>

        {/* VIEWPORT 2 */}
        <section className="h-screen snap-start flex items-center justify-center text-center px-4 relative">
          <div className="space-y-6 w-full">
            <GlitchLine text="IF YOU DREAM OF BETTER ALGORITHMS -" />
            <GlitchLine text="YOU ARE ONE OF US" />

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
    </>
  );
};

export default MainContent;
