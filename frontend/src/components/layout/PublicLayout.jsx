import { Footer } from './Footer.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const PublicLayout = ({ children }) => (
	<div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-surface-950 dark:text-slate-100">
		{children}
		<div className="fixed bottom-4 right-4 z-40">
			<ThemeToggle />
		</div>
		<Footer />
	</div>
);

export { PublicLayout };