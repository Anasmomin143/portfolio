'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = ''
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}