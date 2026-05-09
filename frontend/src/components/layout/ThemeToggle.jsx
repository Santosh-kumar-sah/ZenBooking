import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore.js';

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
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center rounded-md p-2 bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 transition-colors dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20 ${className}`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
