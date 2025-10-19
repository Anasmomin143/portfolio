'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { getAnimationConfig, getDeviceCapabilities, getEntranceVariant } from '@/lib/animation-utils';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay
}: StaggerContainerProps) {
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay || animationConfig.stagger,
        delayChildren: deviceCapabilities.isMobile ? 0.1 : 0.2
      }
    }
  };

  if (deviceCapabilities.prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function StaggerItem({ 
  children, 
  className = '',
  index = 0
}: StaggerItemProps) {
  const [animationConfig, setAnimationConfig] = useState(getAnimationConfig());
  const [deviceCapabilities, setDeviceCapabilities] = useState(getDeviceCapabilities());
  const [variant, setVariant] = useState('slideUp');
  
  useEffect(() => {
    const updateAnimations = () => {
      setAnimationConfig(getAnimationConfig());
      setDeviceCapabilities(getDeviceCapabilities());
      if (typeof window !== 'undefined') {
        setVariant(getEntranceVariant(index, window.innerWidth));
      }
    };
    
    updateAnimations();
    window.addEventListener('resize', updateAnimations);
    return () => window.removeEventListener('resize', updateAnimations);
  }, [index]);

  const variants = {
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: animationConfig
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: animationConfig
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: 30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: animationConfig
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: animationConfig
      }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -5, scale: 0.95 },
      visible: { 
        opacity: 1, 
        rotate: 0, 
        scale: 1,
        transition: animationConfig
      }
    },
    flip: {
      hidden: { opacity: 0, rotateY: -45 },
      visible: { 
        opacity: 1, 
        rotateY: 0,
        transition: animationConfig
      }
    },
    bounce: {
      hidden: { opacity: 0, y: -20, scale: 0.8 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          ...animationConfig, 
          type: 'spring',
          stiffness: 400,
          damping: 15
        }
      }
    },
    elastic: {
      hidden: { opacity: 0, scale: 0.5, rotate: 45 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: { 
          ...animationConfig, 
          type: 'spring',
          stiffness: 300,
          damping: 10
        }
      }
    }
  };

  if (deviceCapabilities.prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variants[variant as keyof typeof variants]}
      className={className}
    >
      {children}
    </motion.div>
  );
}