import { cn } from '../../utils/cn.js';
import { getAvatarColor, getInitials } from '../../utils/formatters.js';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
};

const Avatar = ({ name = '', size = 'md', className }) => (
  <div className={cn('flex items-center justify-center rounded-full font-semibold text-white', sizes[size] || sizes.md, getAvatarColor(name), className)} aria-hidden="true">
    {getInitials(name)}
  </div>
);

export { Avatar };