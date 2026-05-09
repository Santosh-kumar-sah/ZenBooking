import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { routes } from '../../constants/routes.js';

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#' },
  { label: 'Changelog', href: '#' }
];

const businessLinks = [
  { label: 'Create account', to: routes.register },
  { label: 'Owner login', to: routes.login },
  { label: 'Dashboard', to: routes.dashboardHome },
  { label: 'API docs', href: '#' }
];

const supportLinks = [
  { label: 'Help center', to: '/help' },
  { label: 'Contact us', to: '/contact' },
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of service', to: '/terms' }
];

const socials = [
  { icon: Twitter, url: '#', label: 'Twitter' },
  { icon: Instagram, url: '#', label: 'Instagram' },
  { icon: Linkedin, url: 'https://www.linkedin.com/in/santosh-kumar-sah-45a9b6328/', label: 'Linkedin' }
];

const Footer = ({ className = '' }) => (
  <footer className={cn('border-t border-white/10 bg-surface-900', className)}>
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div className="space-y-5">
        <Link to={routes.landing} className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 font-black text-white">Z</span>
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-2xl font-black text-transparent">ZenBooking</span>
        </Link>
        <p className="max-w-xs text-sm leading-6 text-slate-400">Your AI receptionist for appointments</p>
        <div className="flex items-center gap-3">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>

      <FooterColumn title="Product" links={productLinks} />
      <FooterColumn title="For Business" links={businessLinks} />
      <FooterColumn title="Support" links={supportLinks} />
    </div>
    <div className="border-t border-white/5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© 2026 ZenBooking. All rights reserved.</span>
        <span>Made with love for modern businesses</span>
      </div>
    </div>
  </footer>
);

const MiniFooter = ({ className = '' }) => (
  <footer className={cn('border-t border-white/5 px-6 py-3', className)}>
    <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
      <span>© 2026 BookAI</span>
      <span>v1.0.0</span>
    </div>
  </footer>
);

const FooterColumn = ({ title, links }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{title}</h3>
    <ul className="space-y-3 text-sm text-slate-400">
      {links.map((link) => (
        <li key={link.label}>
          {link.to ? <Link to={link.to} className="transition-colors duration-300 hover:text-white">{link.label}</Link> : <a href={link.href} className="transition-colors duration-300 hover:text-white">{link.label}</a>}
        </li>
      ))}
    </ul>
  </div>
);

export { Footer, MiniFooter };