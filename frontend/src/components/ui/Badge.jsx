import { cn } from '../../utils/cn.js';

const variants = {
  confirmed: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-700/40',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/40',
  completed: 'bg-atelier-100 text-atelier-700 border-atelier-200 dark:bg-atelier-800 dark:text-atelier-300 dark:border-atelier-700',
  pending: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/40',
  default: 'bg-atelier-50 text-atelier-700 border-atelier-200 dark:bg-atelier-850 dark:text-atelier-300 dark:border-atelier-700'
};

const Badge = ({ status = 'default', className, children }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight capitalize select-none', variants[status] || variants.default, className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {children || status}
  </span>
);

export { Badge };
