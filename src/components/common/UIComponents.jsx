import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';


export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-muted text-foreground hover:bg-muted/80',
    accent: 'bg-accent text-white hover:bg-accent/90',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
    ghost: 'bg-transparent hover:bg-muted text-foreground',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};


export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block text-sm font-medium text-secondary mb-1.5">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all',
          error && 'border-red-500 focus:ring-red-500'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, children, className, ...props }) => {
  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block text-sm font-medium text-secondary mb-1.5">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            'w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all appearance-none cursor-pointer pr-10',
            error && 'border-red-500 focus:ring-red-500'
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};


