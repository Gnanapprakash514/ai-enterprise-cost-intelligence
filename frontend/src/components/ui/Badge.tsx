import React from 'react';

interface BadgeProps {
  variant?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'slate' | 'violet';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'slate',
  className = '' 
}) => {
  const variantClasses = {
    cyan: 'bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan glow-cyan',
    emerald: 'bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald glow-emerald',
    rose: 'bg-brand-rose/10 border border-brand-rose/30 text-brand-rose glow-rose',
    amber: 'bg-brand-amber/10 border border-brand-amber/30 text-brand-amber',
    violet: 'bg-brand-violet/10 border border-brand-violet/30 text-brand-violet glow-violet',
    slate: 'bg-slate-800 border border-slate-700 text-slate-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold tracking-wider uppercase ${variantClasses[variant]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse-slow" />
      {children}
    </span>
  );
};
export default Badge;
