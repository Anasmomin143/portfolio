'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { getAnimationConfig, getDeviceCapabilities } from '@/lib/animation-utils';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  duration,
  className = ''
}: ScaleInProps) {
  const [animationConfig, setAnimationConfig] = useState(getAnimationConfig());
  const [deviceCapabilities, setDeviceCapabilities] = useState(getDeviceCapabilities());
  
  useEffect(() => {
    const updateAnimations = () => {
      setAnimationConfig(getAnimationConfig());
      setDeviceCapabilities(getDeviceCapabilities());
    };
    
    updateAnimations();
    window.addEventListener('resize', updateAnimations);
    return () => window.removeEventListener('resize', updateAnimations);
  }, []);

  if (deviceCapabilities.prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ scale: deviceCapabilities.isMobile ? 0.9 : 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration: duration || animationConfig.duration,
        delay,
        ease: animationConfig.ease || [0.4, 0, 0.2, 1],
        type: animationConfig.type || "spring",
        stiffness: animationConfig.stiffness || 300,
        damping: animationConfig.damping || 25
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}