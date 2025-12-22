import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasScrolledRef = useRef(false);

  // blinking values
  const [leftValue, setLeftValue] = useState<"0" | "1">("0");
  const [rightValue, setRightValue] = useState<"0" | "1">("1");
  const [andValue, setAndValue] = useState<"&" | "00100110">("&");

  // LEFT number (slower)
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftValue(v => (v === "0" ? "1" : "0"));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // RIGHT number (faster)
  useEffect(() => {
    const interval = setInterval(() => {
      setRightValue(v => (v === "0" ? "1" : "0"));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  // AMPERSAND (very slow, calm)
  useEffect(() => {
    const interval = setInterval(() => {
      setAndValue(v => (v === "&" ? "00100110" : "&"));
    }, 4200); // low frequency
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
    <div className="relative z-10 w-full h-screen overflow-y-scroll snap-y snap-mandatory text-white">

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="fixed top-12 left-0 w-full flex justify-center z-20 pointer-events-none"
      >
        <h2 className="text-xl md:text-2xl font-light tracking-[0.8em] uppercase shimmer">
          MADEFOX
        </h2>
      </motion.header>

      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
          <h1 className="uppercase font-light tracking-[0.35em] text-[clamp(2.2rem,7vw,5rem)]">
            BUILDING MAGIC WIT
          </h1>

          {/* BLINKING LINE */}
          <div className="flex items-center justify-center gap-12 text-[clamp(2.4rem,8vw,5.5rem)] font-light tracking-[0.4em]">
            <motion.span
              key={leftValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {leftValue}
            </motion.span>

            {/* AMPERSAND → BINARY */}
            <motion.span
              key={andValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-white/70 tracking-[0.25em]"
            >
              {andValue}
            </motion.span>

            <motion.span
              key={rightValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {rightValue}
            </motion.span>
          </div>
        </motion.div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <p className="uppercase tracking-[0.3em] opacity-60 text-[clamp(1rem,3vw,1.4rem)]">
            IF YOU DREAM OF BETTER ALGORITHMS -
          </p>

          <h2 className="uppercase tracking-[0.4em] font-light text-[clamp(1.8rem,6vw,3.5rem)]">
            YOU ARE ONE OF US
          </h2>

          <div className="pt-16">
            <button onClick={() => setShowForm(true)}>
              <svg
                width="90"
                height="90"
                viewBox="0 0 100 100"
                className="triangle-pulse stroke-white fill-transparent stroke-[0.6px] hover:fill-white/10 transition-all"
              >
                <path d="M50 15 L85 85 L15 85 Z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="absolute bottom-10 text-[10px] tracking-[0.4em] uppercase opacity-50">
          <a href="mailto:hello@madefox.com">
            HELLO@MADEFOX.COM
          </a>
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
