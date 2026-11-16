import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { Card, Button } from '../components/ui/index.js';
import { Link } from 'react-router-dom';
import { routes } from '../constants/routes.js';

const faqItems = [
  {
    category: 'Getting Started',
    question: 'How do I create my studio account?',
    answer: 'Click "Get Started Free" on the homepage, enter your name, email, password, studio name, and category. An initial studio description will be tailored for you, and your booking page goes live in seconds.'
  },
  {
    category: 'Getting Started',
    question: 'How do I share my booking page with clients?',
    answer: 'After logging in, go to your Overview or Settings page to find your custom booking link. You can easily share it on Instagram, WhatsApp, Google Business, or your website.'
  },
  {
    category: 'Getting Started',
    question: 'Do my clients need to create an account or remember passwords to book?',
    answer: 'No. Clients never need to create an account or remember passwords. They simply select an available date and time, provide their contact details, and receive an instant confirmation.'
  },
  {
    category: 'Studio Schedule',
    question: 'How do I customize my working hours and appointment durations?',
    answer: 'Visit the "Schedule & Slots" page in your dashboard. You can enable or disable specific days of the week, define your opening and closing times, and set slot lengths ranging from 15 to 120 minutes.'
  },
  {
    category: 'Studio Schedule',
    question: 'How do I block off holidays or studio maintenance days?',
    answer: 'On the "Schedule & Slots" page, scroll to "Studio Blackout Dates & Holidays". Select any calendar date and reason to prevent clients from booking on that day.'
  },
  {
    category: 'Studio Schedule',
    question: 'Can I reschedule or cancel an appointment?',
    answer: 'Yes. On the Appointments page, click "Reschedule" to select a new date and available time, or click "Cancel" to remove the appointment.'
  },
  {
    category: 'Client Experience',
    question: 'Will clients receive an instant booking confirmation?',
    answer: 'Yes. As soon as an appointment is confirmed, both you and your client receive an email confirmation containing the reservation details and studio notes.'
  },
  {
    category: 'Client Experience',
    question: 'How do automated reminders work?',
    answer: 'BookAI automatically prepares personalized appointment reminders and delivers them ahead of the visit to ensure high attendance and low no-show rates.'
  },
  {
    category: 'Client Experience',
    question: 'How does the system prevent double-bookings?',
    answer: 'The scheduling engine reserves each slot in real time with conflict prevention. Once a time is chosen, it is instantly blocked from all other clients.'
  }
];

const categories = ['All', 'Getting Started', 'Studio Schedule', 'Client Experience'];

const HelpPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (idx) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100 pt-20">
        {/* Hero Section */}
        <section className="py-16 text-center border-b border-atelier-200/80 dark:border-atelier-850">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Help Center
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-atelier-900 dark:text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-atelier-600 dark:text-atelier-400 leading-relaxed">
              Find quick answers to common questions about setting up your studio, scheduling, and client management.
            </p>

            {/* Search Bar */}
            <div className="pt-4 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-atelier-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles and questions..."
                  className="w-full rounded-xl border border-atelier-200 bg-white py-2.5 pl-10 pr-4 text-xs text-atelier-900 placeholder-atelier-400 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-900 dark:text-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-white border border-atelier-200 text-atelier-700 hover:bg-atelier-100 dark:bg-atelier-900 dark:border-atelier-800 dark:text-atelier-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openItems[index];
                return (
                  <Card key={index} className="overflow-hidden border border-atelier-200 dark:border-atelier-800">
                    <button
                      type="button"
                      onClick={() => toggleItem(index)}
                      className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-atelier-50/50 dark:hover:bg-atelier-850/50"
                    >
                      <span className="font-editorial text-base font-bold text-atelier-900 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-atelier-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary-500' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-atelier-100 px-5 pb-5 pt-3 dark:border-atelier-800 text-xs text-atelier-600 dark:text-atelier-300 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center text-xs text-atelier-500">
                No matching questions found for "{searchQuery}".
              </Card>
            )}
          </div>

          {/* Support Callout */}
          <div className="mt-14 rounded-2xl border border-atelier-200 bg-atelier-100/60 p-8 text-center dark:border-atelier-800 dark:bg-atelier-900/50 space-y-3">
            <h3 className="font-editorial text-xl font-bold text-atelier-900 dark:text-white">
              Still have questions?
            </h3>
            <p className="text-xs text-atelier-600 dark:text-atelier-400">
              Our studio support team is here to assist with any questions or custom configuration needs.
            </p>
            <div className="pt-1">
              <Link to="/contact">
                <Button size="sm" className="text-xs font-semibold gap-1.5">
                  Contact Studio Support <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export { HelpPage };
