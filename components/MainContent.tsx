import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";

const heroText = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const float = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MainContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="fixed top-10 left-0 w-full text-center z-20 pointer-events-none"
      >
        <h1 className="text-sm md:text-base tracking-[0.6em] font-light uppercase opacity-80">
          MADEFOX
        </h1>
      </motion.header>

      {/* SECTION 1 – HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={float}
          animate="animate"
          className="space-y-6"
        >
          <motion.h2
            variants={heroText}
            initial="hidden"
            animate="visible"
            className="font-light uppercase tracking-[0.25em]
            text-[clamp(2.4rem,8vw,5.5rem)] leading-tight"
          >
            BUILDING MAGIC
          </motion.h2>

          <motion.h3
            variants={heroText}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="font-light uppercase tracking-[0.35em] opacity-80
            text-[clamp(1.4rem,5vw,3rem)]"
          >
            WITH 0 AND 1
          </motion.h3>
        </motion.div>
      </section>

      {/* SECTION 2 – BELIEF */}
      <section className="h-screen snap-start flex flex-col items-center justify-center px-6 text-center">
        <motion.div className="space-y-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.3em] font-light
            text-[clamp(0.9rem,3vw,1.4rem)]"
          >
            IF YOU DREAM OF BETTER ALGORITHMS —
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.35em] font-light
            text-[clamp(1.6rem,6vw,3.5rem)]"
          >
            YOU ARE ONE OF US
          </motion.h2>

          {/* TRIANGLE BUTTON */}
          <div className="pt-12">
            <button
              onClick={() => setShowForm(true)}
              className="group mx-auto flex items-center justify-center"
            >
              <svg
                width="90"
                height="90"
                viewBox="0 0 100 100"
                className="stroke-white fill-transparent stroke-[0.6px]
                transition-all group-hover:fill-white/10"
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
        <footer className="absolute bottom-10 text-[10px] tracking-[0.4em] uppercase opacity-50">
          <a
            href="mailto:hello@madefox.com"
            className="hover:opacity-100 transition"
          >
            HELLO@MADEFOX.COM
          </a>
        </footer>
      </section>

      {/* CONTACT FORM */}
      <AnimatePresence>
        {showForm && <ContactForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
