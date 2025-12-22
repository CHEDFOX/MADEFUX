import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

const swapVariants = {
  animate: {
    x: [0, 40, 0, -40, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const blinkVariants = {
  animate: {
    opacity: [1, 0.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasFallen = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!hasFallen.current && window.scrollY > 30) {
        hasFallen.current = true;
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
          className="space-y-10"
        >
          <h1 className="uppercase font-light tracking-[0.35em] text-[clamp(2.2rem,7vw,5rem)]">
            BUILDING MAGIC
          </h1>

          {/* 0 & 1 SWAP + BLINK */}
          <div className="relative flex items-center justify-center gap-10 text-[clamp(2.4rem,8vw,5.5rem)] font-light tracking-[0.4em]">
            <motion.span variants={swapVariants} animate="animate">
              <motion.span variants={blinkVariants} animate="animate">0</motion.span>
            </motion.span>

            <span>&</span>

            <motion.span variants={swapVariants} animate="animate">
              <motion.span variants={blinkVariants} animate="animate">1</motion.span>
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
