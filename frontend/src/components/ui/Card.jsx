import { cn } from '../../utils/cn.js';

const Card = ({ className, hover = false, onClick, children }) => (
  <div
    onClick={onClick}
    className={cn(
      'rounded-2xl border border-atelier-200 bg-white shadow-tactile dark:border-atelier-800/80 dark:bg-atelier-900',
      hover && 'card-tactile cursor-pointer',
      className
    )}
  >
    {children}
  </div>
);

export { Card };
