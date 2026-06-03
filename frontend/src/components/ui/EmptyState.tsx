import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = HelpCircle,
  action,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-white/10 hover:border-brand-cyan/25">
      <div className="p-4 bg-slate-900/60 rounded-full border border-white/5 mb-4 text-slate-500">
        <Icon className="w-8 h-8 text-brand-cyan/70 glow-cyan" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-brand-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && <div className="relative z-20">{action}</div>}
    </Card>
  );
};
export default EmptyState;
