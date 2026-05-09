import { useState } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { Card, Button } from '../components/ui/index.js';
import { cn } from '../utils/cn.js';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'information-collect',
    title: 'Information We Collect',
    content: 'We collect information you provide directly such as your name, email address, business name, and business type when you register. For customers booking appointments we collect name, phone number, and optionally email address. We also collect usage data including pages visited, features used, and booking activity to improve our service.'
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: 'We use your information to provide and improve the ZenBooking platform, send booking confirmations and reminders via email, generate AI powered insights about your booking patterns, communicate important updates about the service, and respond to support requests. We do not sell your personal information to third parties.'
  },
  {
    id: 'ai-third-party',
    title: 'AI and Third Party Services',
    content: 'ZenBooking uses Groq AI to process certain text inputs and generate business descriptions, reminder messages, and insights. Text sent to AI services is used only for generating the requested output and is not stored by us beyond what is needed to display results. We use Nodemailer for email delivery. All third party services are governed by their own privacy policies.'
  },
  {
    id: 'data-storage',
    title: 'Data Storage and Security',
    content: 'Your data is stored in MongoDB Atlas with encryption at rest. We use JWT tokens with short expiry for authentication and store sensitive values in environment variables. While we implement industry standard security measures no system can be completely secure and we cannot guarantee absolute security of your data.'
  },
  {
    id: 'cookies',
    title: 'Cookies and Local Storage',
    content: 'ZenBooking uses browser localStorage to store your authentication token and theme preference. We do not use tracking cookies or advertising cookies. You can clear localStorage at any time through your browser settings which will log you out of the application.'
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: 'We retain your account data for as long as your account is active. Booking records are retained for 12 months after the booking date. You can request deletion of your account and associated data by contacting us at privacy@zenbooking.app and we will process your request within 30 days.'
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: 'Depending on your location you may have rights to access the personal data we hold about you, correct inaccurate data, request deletion of your data, object to certain processing, and request data portability. To exercise these rights please contact us at privacy@zenbooking.app.'
  },
  {
    id: 'children-privacy',
    title: 'Children\'s Privacy',
    content: 'ZenBooking is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information we will delete it immediately.'
  },
  {
    id: 'changes-policy',
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending an email to registered users. The date at the top of this page indicates when the policy was last revised.'
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: 'For privacy related questions or requests please contact us at privacy@zenbooking.app or write to us using the contact form on our website.'
  }
];

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-100 pt-20 dark:bg-surface-950">
        {/* Header */}
        <section className="border-b border-slate-200 bg-white/80 py-12 dark:border-white/10 dark:bg-surface-900/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <h1 className="mt-4 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Last updated May 2026</p>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Table of Contents - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-sm font-semibold uppercase text-slate-900 dark:text-white">Contents</h3>
              <nav className="space-y-1">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'block w-full text-left px-3 py-2 rounded text-sm transition-colors',
                      activeSection === section.id
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                    )}
                  >
                    <span className="font-medium">{idx + 1}.</span> {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-l-4 border-gradient-to-b from-primary-500 to-accent-500 pl-4">
                  {section.title}
                </h2>
                <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* CTA Card */}
            <div className="mt-12 rounded-2xl border border-gradient-to-r from-primary-500/50 to-accent-500/50 bg-gradient-to-br from-primary-500/10 to-accent-500/10 p-8">
              <h3 className="text-2xl font-bold text-white">Have questions about our privacy practices?</h3>
              <p className="mt-2 text-slate-300">Contact our team</p>
              <Link to="/contact">
                <Button className="mt-6">
                  Get in Touch
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export { PrivacyPage };
