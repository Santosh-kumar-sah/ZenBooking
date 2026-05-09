import { useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { Card, Button } from '../components/ui/index.js';
import { cn } from '../utils/cn.js';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: 'By accessing or using ZenBooking you confirm that you are at least 18 years old and have the legal authority to enter into these terms on behalf of yourself or your business. If you are using ZenBooking on behalf of a business you represent that you have authority to bind that business to these terms. Continued use of the platform after any changes to these terms constitutes your acceptance of the revised terms.'
  },
  {
    id: 'service',
    title: 'Description of Service',
    content: 'ZenBooking is an AI powered appointment booking platform that enables business owners to create booking pages and allows their customers to schedule appointments. We provide tools for managing slots, viewing bookings, sending notifications, and accessing AI generated insights. ZenBooking is not responsible for the quality or delivery of services provided by businesses using our platform.'
  },
  {
    id: 'registration',
    title: 'Account Registration',
    content: 'Business owners must register with accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.'
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: 'You agree not to use ZenBooking for any unlawful purpose or in any way that could harm the platform or other users. You must not attempt to gain unauthorized access to any part of the system, transmit malicious code, scrape data without permission, or use the platform to send spam or unsolicited communications. Violations may result in immediate account termination.'
  },
  {
    id: 'ai-features',
    title: 'AI Features and Data',
    content: 'ZenBooking uses third party AI services including Groq to generate business descriptions, reminder messages, and insights. AI generated content is provided as a convenience and may not always be accurate or appropriate. You are responsible for reviewing AI generated content before publishing it. We do not guarantee the accuracy of AI insights or recommendations.'
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: 'Your use of ZenBooking is also governed by our Privacy Policy which is incorporated into these terms by reference. By using ZenBooking you consent to the collection and use of your information as described in our Privacy Policy.'
  },
  {
    id: 'billing',
    title: 'Payments and Billing',
    content: 'ZenBooking currently offers a free tier for individual business owners. Premium features if introduced in the future will be clearly disclosed before any charges are applied. All fees are non-refundable unless required by applicable law.'
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: 'ZenBooking is provided on an as-is and as-available basis without warranties of any kind. To the fullest extent permitted by law ZenBooking shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform including lost profits, lost data, or business interruption.'
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. We will notify registered users of significant changes via email. Your continued use of ZenBooking after changes are posted constitutes your acceptance.'
  },
  {
    id: 'contact',
    title: 'Contact',
    content: 'If you have questions about these terms please contact us at legal@zenbooking.app or use the contact form on our website.'
  }
];

const TermsPage = () => {
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
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <h1 className="mt-4 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Terms and Conditions
              </span>
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Last updated May 2026</p>
            <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
              By using ZenBooking you agree to these terms, please read them carefully.
            </p>
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
              <h3 className="text-2xl font-bold text-white">Have questions about our terms?</h3>
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

export { TermsPage };
