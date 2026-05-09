import { cn } from '../../utils/cn.js';
import { Spinner } from './Spinner.jsx';

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90',
  secondary: 'bg-white border border-slate-300 text-slate-800 shadow-sm hover:bg-slate-50 dark:bg-white/10 dark:border-white/20 dark:text-white dark:shadow-none dark:hover:bg-white/20',
  danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
  ghost: 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
};

const Button = ({ className, variant = 'primary', size = 'md', loading = false, disabled = false, children, type = 'button', ...props }) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 disabled:cursor-not-allowed disabled:opacity-60',
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