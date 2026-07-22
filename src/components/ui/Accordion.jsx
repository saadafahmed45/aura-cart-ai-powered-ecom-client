import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Accordion({ children, className }) {
  return <div className={cn('divide-y divide-border border-y border-border', className)}>{children}</div>;
}

export function AccordionItem({ title, children, defaultOpen = false, className }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('py-3.5', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-medium text-foreground py-1 cursor-pointer focus:outline-none"
      >
        <span className="text-xs font-bold tracking-widest uppercase font-sans text-foreground/90">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 text-xs text-muted-foreground leading-relaxed font-sans">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
