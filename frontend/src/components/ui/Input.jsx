import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

const Input = forwardRef(({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label htmlFor={inputId} className="block text-left">
      {label ? <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">{label}</span> : null}
      <div className={cn(
        'flex items-center gap-2.5 rounded-xl border border-atelier-200 bg-white px-3.5 shadow-sm transition-all duration-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-atelier-700 dark:bg-atelier-800/90 dark:focus-within:border-primary-400',
        error ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20' : '',
        className
      )}>
        {leftIcon ? <span className="text-atelier-400 dark:text-atelier-500">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className="w-full bg-transparent py-2.5 text-sm text-atelier-900 placeholder-atelier-400 focus:outline-none dark:text-atelier-100 dark:placeholder-atelier-500"
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightIcon ? <span className="text-atelier-400 dark:text-atelier-500">{rightIcon}</span> : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </label>
  );
});

Input.displayName = 'Input';

export { Input };
