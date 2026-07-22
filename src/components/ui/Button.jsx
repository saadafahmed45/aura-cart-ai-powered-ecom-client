import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent text-foreground hover:bg-secondary hover:border-foreground/20',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-secondary',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90'
  };

  const sizes = {
    default: 'h-11 px-6 py-3 text-sm rounded-xs',
    sm: 'h-9 px-4 text-xs rounded-xs',
    lg: 'h-13 px-8 text-base rounded-xs',
    icon: 'h-10 w-10 p-2 rounded-full'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
