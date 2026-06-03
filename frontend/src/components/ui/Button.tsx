import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'rose' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-brand-cyan/15 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    secondary: 'bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700/80',
    outline: 'bg-transparent border border-white/10 text-slate-300 hover:border-brand-cyan/40 hover:text-white',
    ghost: 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white',
    rose: 'bg-brand-rose/15 border border-brand-rose text-brand-rose hover:bg-brand-rose/30 shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    emerald: 'bg-brand-emerald/15 border border-brand-emerald text-brand-emerald hover:bg-brand-emerald/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
export default Button;
