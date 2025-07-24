import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
}

const PageTransition = ({ children, pageKey }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ 
          opacity: 0, 
          y: 20,
          scale: 0.95,
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          scale: 1.05,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic-bezier
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;