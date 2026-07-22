import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Drawer({ isOpen, onClose, title, children, className, side = 'right' }) {
  const sideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      className: 'left-0 h-full w-80 max-w-full border-r'
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      className: 'right-0 h-full w-[450px] max-w-full border-l'
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      className: 'bottom-0 left-0 right-0 h-[60vh] border-t'
    }
  };

  const currentSide = sideVariants[side] || sideVariants.right;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/45 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={currentSide.initial}
            animate={currentSide.animate}
            exit={currentSide.exit}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={cn(
              'fixed bg-card p-6 shadow-2xl flex flex-col border-border z-10',
              currentSide.className,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-md font-bold text-foreground uppercase tracking-widest font-sans">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content (Scrolling body) */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
