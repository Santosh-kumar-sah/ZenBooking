import { cn } from '../../utils/cn.js';
import { Spinner } from './Spinner.jsx';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm active:translate-y-[1px]',
  secondary: 'bg-atelier-50 border border-atelier-200 text-atelier-800 hover:bg-atelier-100 hover:border-atelier-300 dark:bg-atelier-800 dark:border-atelier-700 dark:text-atelier-100 dark:hover:bg-atelier-700',
  outline: 'bg-transparent border border-atelier-300 text-atelier-800 hover:bg-atelier-100/60 dark:border-atelier-700 dark:text-atelier-200 dark:hover:bg-atelier-800',
  danger: 'bg-red-50/80 border border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300',
  ghost: 'bg-transparent text-atelier-700 hover:bg-atelier-100/80 hover:text-atelier-900 dark:text-atelier-300 dark:hover:bg-atelier-800 dark:hover:text-white'
};

const sizes = {
  sm: 'h-9 px-3.5 text-xs font-medium rounded-xl',
  md: 'h-11 px-5 text-sm font-medium rounded-xl',
  lg: 'h-12 px-6 text-base font-medium rounded-xl'
};

const Button = ({ className, variant = 'primary', size = 'md', loading = false, disabled = false, children, type = 'button', ...props }) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 select-none',
      variants[variant],
      sizes[size],
      className
    )}
    disabled={loading || disabled || props.disabled}
    {...props}
  >
    {loading ? <Spinner className="h-4 w-4" /> : null}
    <span>{children}</span>
  </button>
);

export { Button };
