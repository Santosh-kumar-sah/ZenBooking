import { cn } from '../../utils/cn.js';

const Skeleton = ({ className }) => <div className={cn('animate-pulse rounded-xl bg-white/5', className)} aria-hidden="true" />;

export { Skeleton };