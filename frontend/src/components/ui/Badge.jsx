import { cn } from '../../utils/cn.js';

const variants = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
  completed: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
  pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/10'
};

const Badge = ({ status = 'default', className, children }) => (
  <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium capitalize', variants[status] || variants.default, className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children || status}
  </span>
);

export { Badge };