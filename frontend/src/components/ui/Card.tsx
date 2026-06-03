import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'cyan' | 'emerald' | 'rose' | 'violet' | 'none';
  scanner?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glow = 'none', 
  scanner = false,
  className = '', 
  ...props 
}) => {
  const glowClasses = {
    cyan: 'hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.12)] hover:border-brand-cyan/40',
    emerald: 'hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.12)] hover:border-brand-emerald/40',
    rose: 'hover:shadow-[0_8px_32px_0_rgba(244,63,94,0.12)] hover:border-brand-rose/40',
    violet: 'hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.12)] hover:border-brand-violet/40',
    none: 'hover:border-brand-cyan/20'
  };

  return (
    <div 
      className={`glass-panel p-6 scanner-container relative ${glowClasses[glow]} ${className}`} 
      {...props}
    >
      {scanner && <div className="scanner-beam" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
export default Card;
