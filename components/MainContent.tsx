import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { PageState } from "../App";

interface Props {
  setGlobalState?: (s: PageState) => void;
}

const MainContent: React.FC<Props> = ({ setGlobalState }) => {
  const [showForm, setShowForm] = useState(false);
  const hasFallenRef = useRef(false);

  // FIRST SCROLL → trigger short fall
  useEffect(() => {
    const onScroll = () => {
      if (!hasFallenRef.current && window.scrollY > 40) {
        hasFallenRef.current = true;

        setGlobalState?.(PageState.SCROLL_FALL);

        setTimeout(() => {
          setGlobalState?.(PageState.CONTENT);
        }, 900); // short, subtle fall
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setGlobalState]);

  return (
    <div className="relative z-10 w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth text-white">

      {/* HEADER – MADEFOX (KEEP SHIMMER) */}
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
      <section className="h-screen snap-start flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <h1 className="font-light uppercase tracking-[0.3em] text-[clamp(2.4rem,8vw,5.5rem)]">
            BUILDING MAGIC
          </h1>

          <h2 className="font-light uppercase tracking-[0.35em] opacity-80 text-[clamp(1.4rem,5vw,3rem)]">
            WITH 0 AND 1
          </h2>
        </motion.div>
      </section>

      {/* BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="space-y-12 max-w-4xl"
        >
          <p className="uppercase tracking-[0.3em] font-light opacity-60 text-[clamp(0.9rem,3vw,1.4rem)]">
            IF YOU DREAM OF BETTER ALGORITHMS —
          </p>

          <h2 className="uppercase tracking-[0.4em] font-light text-[clamp(1.6rem,6vw,3.5rem)]">
            YOU ARE ONE OF US
          </h2>

          {/* TRIANGLE */}
          <div className="pt-12 flex flex-col items-center">
            <button
              onClick={() => setShowForm(true)}
              className="group"
            >
              <svg
                width="90"
                height="90"
                viewBox="0 0 100 100"
                className="triangle-pulse stroke-white fill-transparent stroke-[0.6px] transition-all group-hover:fill-white/10"
              >
                <path d="M50 15 L85 85 L15 85 Z" />
              </svg>
            </button>

            <p className="mt-6 text-xs tracking-[0.4em] uppercase opacity-50">
              CROSS THE THRESHOLD
            </p>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="absolute bottom-10 w-full flex justify-center text-[10px] tracking-[0.4em] uppercase opacity-50">
          <a
            href="mailto:hello@madefox.com"
            className="hover:opacity-100 transition"
          >
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
