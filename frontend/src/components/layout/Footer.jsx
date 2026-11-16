import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { routes } from '../../constants/routes.js';

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Studio Concierge', href: '#features' },
  { label: 'Pricing', href: '#' }
];

const businessLinks = [
  { label: 'Create Studio Account', to: routes.register },
  { label: 'Owner Sign In', to: routes.login },
  { label: 'Studio Dashboard', to: routes.dashboardHome },
  { label: 'Schedule Configuration', to: routes.slots }
];

const supportLinks = [
  { label: 'Help Center', to: '/help' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' }
];

const socials = [
  { icon: Twitter, url: '#', label: 'Twitter' },
  { icon: Instagram, url: '#', label: 'Instagram' },
  { icon: Linkedin, url: 'https://www.linkedin.com/in/santosh-kumar-sah-45a9b6328/', label: 'LinkedIn' }
];

const Footer = ({ className = '' }) => (
  <footer className={cn('border-t border-atelier-200 bg-white dark:border-atelier-800 dark:bg-atelier-950', className)}>
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div className="space-y-4">
        <Link to={routes.landing} className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-atelier-900 font-editorial text-base font-semibold text-white dark:bg-white dark:text-atelier-950">
            B
          </span>
          <span className="font-editorial text-xl font-bold tracking-tight text-atelier-900 dark:text-atelier-100">
            BookAI
          </span>
        </Link>
        <p className="max-w-xs text-xs leading-relaxed text-atelier-600 dark:text-atelier-400">
          Refined appointment booking & scheduling designed for salons, barber ateliers, spas, and wellness clinics.
        </p>
        <div className="flex items-center gap-2 pt-2">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-atelier-200 bg-atelier-50 text-atelier-600 transition-colors hover:border-atelier-300 hover:text-atelier-900 dark:border-atelier-800 dark:bg-atelier-900 dark:text-atelier-400 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>

      <FooterColumn title="Platform" links={productLinks} />
      <FooterColumn title="For Owners" links={businessLinks} />
      <FooterColumn title="Studio Support" links={supportLinks} />
    </div>

    <div className="border-t border-atelier-200/80 dark:border-atelier-850">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-atelier-500 dark:text-atelier-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} BookAI Studio. All rights reserved.</span>
        <span>Crafted for frictionless appointment management</span>
      </div>
    </div>
  </footer>
);

const MiniFooter = ({ className = '' }) => (
  <footer className={cn('border-t border-atelier-200 px-6 py-3.5 dark:border-atelier-800/80', className)}>
    <div className="flex items-center justify-between gap-4 text-xs text-atelier-500 dark:text-atelier-400">
      <span>© {new Date().getFullYear()} BookAI</span>
      <span className="font-mono text-[11px]">v2.0 · Atelier Edition</span>
    </div>
  </footer>
);

const FooterColumn = ({ title, links }) => (
  <div className="space-y-3.5">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-atelier-900 dark:text-atelier-200">{title}</h3>
    <ul className="space-y-2.5 text-xs text-atelier-600 dark:text-atelier-400">
      {links.map((link) => (
        <li key={link.label}>
          {link.to ? (
            <Link to={link.to} className="transition-colors hover:text-atelier-900 dark:hover:text-atelier-100">
              {link.label}
            </Link>
          ) : (
            <a href={link.href} className="transition-colors hover:text-atelier-900 dark:hover:text-atelier-100">
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export { Footer, MiniFooter };
