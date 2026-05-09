import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

const Input = forwardRef(({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label ? <span className="mb-1 block text-sm text-slate-400">{label}</span> : null}
      <div className={cn('flex items-center gap-2 rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary-500', error ? 'border-red-500/50 focus-within:ring-red-500' : 'border-white/10', className)}>
        {leftIcon ? <span className="text-slate-400">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className="w-full bg-transparent py-3 text-white placeholder-slate-500 focus:outline-none"
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightIcon ? <span className="text-slate-400">{rightIcon}</span> : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </label>
  );
});

Input.displayName = 'Input';

export { Input };