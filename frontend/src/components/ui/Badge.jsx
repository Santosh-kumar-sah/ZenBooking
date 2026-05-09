import { cn } from '../../utils/cn.js';

const variants = {
  confirmed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/20',
  completed: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  default: 'bg-white/10 text-slate-200 border-white/10'
};

const Badge = ({ status = 'default', className, children }) => (
  <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium capitalize', variants[status] || variants.default, className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children || status}
  </span>
);

export { Badge };