import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Tabs({ tabs, defaultTab, onChange, className }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  const handleTabClick = (value) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex border-b border-border mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={cn(
                'relative py-3.5 px-6 text-xs font-bold tracking-widest uppercase transition-colors focus:outline-none cursor-pointer',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div>
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}
