import { cn } from '../../utils/cn.js';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-[3px]'
};

const colors = {
  primary: 'border-primary-500 border-t-transparent',
  slate: 'border-slate-300 border-t-transparent',
  white: 'border-white border-t-transparent'
};

const Spinner = ({ size = 'md', color = 'primary', className }) => (
  <span aria-hidden="true" className={cn('inline-block animate-spin rounded-full border-solid', sizes[size] || sizes.md, colors[color] || colors.primary, className)} />
);

export { Spinner };