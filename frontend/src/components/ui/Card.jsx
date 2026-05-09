import { cn } from '../../utils/cn.js';

const Card = ({ className, hover = false, onClick, children }) => (
  <div
    onClick={onClick}
    className={cn('rounded-2xl border border-slate-200 bg-white backdrop-blur-xl dark:border-white/10 dark:bg-white/5', hover && 'cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:hover:bg-white/10 dark:hover:border-white/20', className)}
  >
    {children}
  </div>
);

export { Card };