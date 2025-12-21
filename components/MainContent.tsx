
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ContactForm from './ContactForm';

const MainContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  // Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  // Transformations for different depths
  const textTranslateX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const textTranslateY = useTransform(sy, [-0.5, 0.5], [-20, 20]);
  const headerTranslateX = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to [-0.5, 0.5]
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const idleFloatVariants: Variants = {
    animate: {
      y: [0, -5, 0],
      rotate: [0, 0.5, 0, -0.5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const TriangleButton = () => (
    <button 
      onClick={() => setShowForm(true)}
      className="group relative flex items-center justify-center p-8 transition-all"
    >
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 100 100" 
        className="triangle-pulse stroke-white fill-transparent stroke-[0.5px] transition-all group-hover:fill-white/10 group-active:scale-90"
      >
        <path d="M50 15 L85 85 L15 85 Z" />
      </svg>
    </button>
  );

  const AnimatedText = ({ text, className }: { text: string, className: string }) => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`${className} flex flex-wrap justify-center relative`}
    >
      <motion.span 
        className="inline-block pl-[0.3em]"
        variants={idleFloatVariants}
        animate="animate"
      >
        {text.split("").map((char, i) => (
          <motion.span 
            key={i} 
            variants={letterVariants} 
            className="inline-block hover:text-white transition-colors duration-500 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </motion.div>
  );

  return (
    <div className="relative z-10 w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Persistent Header */}
      <motion.header
        style={{ x: headerTranslateX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="fixed top-12 left-0 w-full flex justify-center z-20 pointer-events-none"
      >
        <h2 className="text-xl md:text-2xl font-light tracking-[0.8em] uppercase text-white shimmer">
          MADEFOX
        </h2>
      </motion.header>

      {/* Viewport 1: MAKING MAGIC WITH */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 snap-start">
        <motion.div 
          style={{ x: textTranslateX, y: textTranslateY }}
          className="text-center w-full max-w-[100vw] overflow-hidden cursor-default"
        >
          <AnimatedText 
            text="MAKING MAGIC WITH" 
            className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-light tracking-[0.3em] uppercase leading-tight"
          />
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.5 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="h-[1px] w-16 md:w-24 bg-white mx-auto my-6 md:my-8 origin-center shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
          <AnimatedText 
            text="0 & 1" 
            className="text-xl sm:text-2xl md:text-5xl lg:text-7xl font-light tracking-[0.3em] uppercase leading-tight"
          />
        </motion.div>
      </section>

      {/* Viewport 2: You Are One Of Us */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 snap-start relative">
        <motion.div 
          style={{ x: textTranslateX, y: textTranslateY }}
          className="text-center max-w-5xl cursor-default"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-12 md:space-y-16"
          >
            <h2 className="text-lg md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-white/60">
              IF YOU DREAM OF BETTER ALGORITHMS                                                                                                                                                                                 
                          —-
            </h2>
            
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-normal tracking-[0.4em] uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              YOU ARE ONE OF US
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16 md:mt-20"
          >
            <TriangleButton />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="absolute bottom-10 w-full flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-gray-500 opacity-60">
          <a href="mailto:hello@madefox.com" className="hover:text-white transition-all hover:tracking-[0.6em]">
            HELLO@MADEFOX.COM
          </a>
        </footer>
      </section>

      <AnimatePresence>
        {showForm && (
          <ContactForm onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;
