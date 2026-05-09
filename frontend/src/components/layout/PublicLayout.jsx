import { Footer } from './Footer.jsx';

const PublicLayout = ({ children }) => (
	<div className="min-h-screen bg-surface-950 text-slate-100">
		{children}
		<Footer />
	</div>
);

export { PublicLayout };