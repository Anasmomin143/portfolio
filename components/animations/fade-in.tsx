'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { getAnimationConfig, getDeviceCapabilities } from '@/lib/animation-utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration, 
  direction = 'up',
  className = ''
}: FadeInProps) {
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

  const directionVariants = {
    up: { y: deviceCapabilities.isMobile ? 20 : 30, opacity: 0 },
    down: { y: deviceCapabilities.isMobile ? -20 : -30, opacity: 0 },
    left: { x: deviceCapabilities.isMobile ? 20 : 30, opacity: 0 },
    right: { x: deviceCapabilities.isMobile ? -20 : -30, opacity: 0 }
  };

  if (deviceCapabilities.prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration: duration || animationConfig.duration,
        delay: delay,
        ease: animationConfig.ease || [0.4, 0, 0.2, 1],
        type: animationConfig.type
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}