'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes, getTheme, applyTheme, type Theme } from '@/lib/themes';
import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('theme-id') || 'purple';
    const theme = getTheme(savedThemeId);
    setCurrentTheme(theme);
    applyTheme(theme);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('theme-id', theme.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:bg-white/10"
          style={{ color: 'var(--color-text)' }}
        >
          <motion.span 
            className="text-lg"
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentTheme.emoji}
          </motion.span>
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <motion.svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 w-64 bg-white/95 theme-dropdown rounded-xl shadow-strong border border-white/20 overflow-hidden"
            >
              <div className="p-2">
                <motion.div 
                  className="text-sm font-medium text-gray-600 px-3 py-2 mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Choose Theme
                </motion.div>
                {themes.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(theme)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-100/70 transition-colors ${
                      currentTheme.id === theme.id ? 'bg-gray-100/70 ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="text-lg"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {theme.emoji}
                      </motion.span>
                      <div>
                        <div className="font-medium text-gray-900">{theme.name}</div>
                        <div className="text-xs text-gray-500">{theme.description}</div>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      <motion.div
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ background: theme.colors.primary }}
                        whileHover={{ scale: 1.3 }}
                      />
                      <motion.div
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ background: theme.colors.accent }}
                        whileHover={{ scale: 1.3 }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}