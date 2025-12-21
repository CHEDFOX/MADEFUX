
import React from 'react';
import { motion } from 'framer-motion';

interface ThresholdProps {
  onEnter: () => void;
}

const Threshold: React.FC<ThresholdProps> = ({ onEnter }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.2, 
        filter: 'blur(20px)',
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 flex items-center justify-center z-50 bg-black"
    >
      <button
        onClick={onEnter}
        className="breathe-btn w-32 h-32 md:w-40 md:h-40 rounded-full bg-white transition-all hover:bg-opacity-95 active:scale-90"
        aria-label="Initialize"
      />
    </motion.div>
  );
};

export default Threshold;
