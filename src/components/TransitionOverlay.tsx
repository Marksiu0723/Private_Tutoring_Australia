import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface TransitionOverlayProps {
  isTransitioning: boolean;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isTransitioning }) => {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFCF8] dark:bg-[#171714]"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40] dark:text-[#A3B18A]" />
          <p className="mt-4 text-sm font-semibold text-[#8A8575] dark:text-[#A6A295] tracking-widest uppercase">
            Loading...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
