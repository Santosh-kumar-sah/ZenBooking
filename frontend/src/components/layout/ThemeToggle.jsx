import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore.js';
import { cn } from '../../utils/cn.js';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore((state) => ({ theme: state.theme, toggleTheme: state.toggleTheme }));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle light or dark theme"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-atelier-200 bg-atelier-50 text-atelier-700 transition-all hover:bg-atelier-100 hover:text-atelier-900 active:scale-95 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-200 dark:hover:bg-atelier-700 dark:hover:text-white',
        className
      )}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
