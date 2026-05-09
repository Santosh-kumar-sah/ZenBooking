import { cn } from '../../utils/cn.js';

const Card = ({ className, hover = false, onClick, children }) => (
  <div
    onClick={onClick}
    className={cn('rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl', hover && 'cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20', className)}
  >
    {children}
  </div>
);

export { Card };