'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  scaleOnHover?: number;
  rotateOnHover?: number;
}

export function HoverCard({ 
  children, 
  className = '',
  scaleOnHover = 1.05,
  rotateOnHover = 1
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: scaleOnHover,
        rotate: rotateOnHover,
        y: -5
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}