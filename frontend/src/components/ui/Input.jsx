import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

const Input = forwardRef(({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label htmlFor={inputId} className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span> : null}
      <div className={cn('flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 shadow-sm transition-all duration-200 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-600/20 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:focus-within:border-primary-500', error ? 'border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/20' : '', className)}>
        {leftIcon ? <span className="text-slate-600 dark:text-slate-400">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className="w-full bg-transparent py-3 text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500"
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightIcon ? <span className="text-slate-600 dark:text-slate-400">{rightIcon}</span> : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </label>
  );
});

Input.displayName = 'Input';

export { Input };