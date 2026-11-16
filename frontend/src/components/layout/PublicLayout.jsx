import { Footer } from './Footer.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100">
    {children}
    <div className="fixed bottom-5 left-5 z-30">
      <ThemeToggle />
    </div>
    <Footer />
  </div>
);

export { PublicLayout };
