import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  Check, 
  Users,
  Compass
} from 'lucide-react';
import { Button, Card } from '../components/ui/index.js';
import { Footer } from '../components/layout/Footer.jsx';
import ThemeToggle from '../components/layout/ThemeToggle.jsx';
import { routes } from '../constants/routes.js';

const features = [
  {
    title: 'Zero Client Accounts',
    desc: 'Guests book in under 30 seconds by simply providing their name and contact. No forgotten passwords or registration friction.',
    icon: Users
  },
  {
    title: 'Studio Concierge',
    desc: 'An intelligent booking concierge understands natural language requests like "Saturday at 3 PM" and secures the appointment conversationally.',
    icon: Sparkles
  },
  {
    title: 'Automated Reminders',
    desc: 'Customized notifications sent ahead of appointments to ensure clients arrive on time and no-show rates drop drastically.',
    icon: Bell
  },
  {
    title: 'Weekly Schedule & Blackouts',
    desc: 'Tailor working hours per day of the week, specify appointment durations, and easily block holidays and studio maintenance.',
    icon: Clock
  },
  {
    title: 'Executive Intelligence',
    desc: 'Actionable weekly insights detailing your busiest times, peak appointment days, and booking momentum without confusing graphs.',
    icon: Compass
  },
  {
    title: 'Mobile-Optimized Experience',
    desc: 'Engineered for smooth thumb navigation on all modern smartphones, tablets, and desktop browsers.',
    icon: Smartphone
  }
];

const demoSlots = [
  { id: '1', time: '10:00 AM', end: '10:45 AM', duration: '45 min' },
  { id: '2', time: '11:15 AM', end: '12:00 PM', duration: '45 min' },
  { id: '3', time: '1:30 PM', end: '2:15 PM', duration: '45 min' },
  { id: '4', time: '2:45 PM', end: '3:30 PM', duration: '45 min' },
  { id: '5', time: '4:00 PM', end: '4:45 PM', duration: '45 min' },
  { id: '6', time: '5:15 PM', end: '6:00 PM', duration: '45 min' }
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(demoSlots[3]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100 font-sans">
      {/* Top Navigation */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-atelier-200/80 bg-white/90 backdrop-blur-md dark:border-atelier-800 dark:bg-atelier-950/90 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={routes.landing} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-atelier-900 font-editorial text-base font-bold text-white dark:bg-white dark:text-atelier-950">
              B
            </span>
            <span className="font-editorial text-xl font-bold tracking-tight text-atelier-900 dark:text-white">
              BookAI
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
            <a href="#features" className="hover:text-atelier-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-atelier-900 dark:hover:text-white transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              to={routes.login}
              className="inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-xs font-medium text-atelier-700 hover:text-atelier-900 dark:text-atelier-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to={routes.register}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-4 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 active:translate-y-[1px] transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 sm:pt-28">
        {/* Editorial Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* Left Column: Editorial Value Proposition */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-atelier-300 bg-white/70 px-3.5 py-1 text-xs font-medium text-atelier-700 dark:border-atelier-700 dark:bg-atelier-900/60 dark:text-atelier-300 shadow-tactile">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-600" />
                  Appointment Management for Boutique Studios
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-atelier-900 dark:text-white leading-[1.15]">
                  Effortless appointment booking, crafted for real studios.
                </h1>

                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-atelier-600 dark:text-atelier-300">
                  Give your salon, barbershop, spa, or clinic a refined booking experience. Customers book directly without creating an account, while automated schedules and intelligent reminders handle the rest.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                  <Link to={routes.register}>
                    <Button size="lg" className="w-full sm:w-auto text-sm font-semibold gap-2 shadow-tactile">
                      Start Your Studio Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm">
                      How It Works
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-6 pt-4 text-xs text-atelier-500 dark:text-atelier-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-accent-600" /> No client sign-up required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-accent-600" /> Live instant confirmation
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Tactile Live Studio Card */}
              <div className="perspective-container flex justify-center">
                <div className="card-3d-tilted w-full max-w-md">
                  <Card className="overflow-hidden border border-atelier-200 bg-white p-0 shadow-card-hover dark:border-atelier-800 dark:bg-atelier-900">
                    {/* Header */}
                    <div className="border-b border-atelier-200 bg-atelier-100/70 p-5 dark:border-atelier-800 dark:bg-atelier-850">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Live Studio Preview</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700 border border-accent-200">
                          Open Today
                        </span>
                      </div>
                      <h3 className="mt-2 font-editorial text-2xl font-bold text-atelier-900 dark:text-white">
                        Atelier Lumière
                      </h3>
                      <p className="text-xs text-atelier-500">Hair Design & Wellness · Soho, London</p>
                    </div>

                    {/* Interactive mock slots */}
                    <div className="p-5 space-y-4">
                      {/* Service header */}
                      <div className="flex items-center justify-between rounded-xl border border-atelier-200/80 bg-atelier-50/70 p-3 text-xs dark:border-atelier-800 dark:bg-atelier-850">
                        <div>
                          <p className="font-semibold text-atelier-900 dark:text-white">Signature Cut & Styling</p>
                          <p className="text-[11px] text-atelier-500">45 minutes · Master Stylist</p>
                        </div>
                        <span className="font-editorial text-sm font-bold text-primary-600 dark:text-primary-400">$65</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-atelier-500">
                          <span>Select Available Time</span>
                          <span className="text-primary-600 dark:text-primary-400 font-medium">Tomorrow</span>
                        </div>

                        {/* Balanced 3x2 grid with clear start and end times */}
                        <div className="mt-2.5 grid grid-cols-3 gap-2">
                          {demoSlots.map((slot) => {
                            const isSelected = selectedSlot.id === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`rounded-xl border py-2 px-1 text-center transition-all ${
                                  isSelected
                                    ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                                    : 'border-atelier-200 bg-atelier-50 text-atelier-800 hover:border-atelier-300 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-200'
                                }`}
                              >
                                <p className="text-xs font-bold leading-none">{slot.time}</p>
                                <p className={`mt-1 text-[10px] leading-none ${isSelected ? 'text-primary-100' : 'text-atelier-400'}`}>
                                  to {slot.end}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Clear appointment summary */}
                      <div className="rounded-xl border border-atelier-200 bg-atelier-50/70 p-3.5 text-xs dark:border-atelier-800 dark:bg-atelier-850 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-atelier-500">Reserved Visit:</span>
                          <span className="font-semibold text-atelier-900 dark:text-white">
                            Tomorrow · {selectedSlot.time} – {selectedSlot.end}
                          </span>
                        </div>
                        <p className="text-[11px] text-atelier-500">
                          Duration: {selectedSlot.duration} · Zero client account needed
                        </p>
                      </div>

                      <div className="pt-1">
                        <Link to={routes.register} className="block">
                          <Button className="w-full text-xs font-semibold">
                            Create Your Studio Like This
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="border-t border-atelier-200/80 bg-white py-20 dark:border-atelier-850 dark:bg-atelier-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Thoughtfully Engineered
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-atelier-900 dark:text-white">
                Everything your business needs to manage appointments.
              </h2>
              <p className="text-sm text-atelier-600 dark:text-atelier-400">
                Built from the ground up for real owners who want reliable scheduling without complicated software.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <Card key={feat.title} hover className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-atelier-100 text-atelier-800 dark:bg-atelier-800 dark:text-atelier-200">
                      <Icon className="h-5 w-5 text-primary-500" />
                    </div>
                    <h3 className="mt-4 font-editorial text-lg font-bold text-atelier-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-atelier-600 dark:text-atelier-400">
                      {feat.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3-Step Walkthrough */}
        <section id="how-it-works" className="border-t border-atelier-200/80 bg-atelier-50/60 py-20 dark:border-atelier-850 dark:bg-atelier-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Frictionless Setup
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-atelier-900 dark:text-white">
                Ready to take bookings in under 5 minutes.
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Configure Your Hours',
                  desc: 'Specify your working hours per day, slot duration (15 to 120 minutes), and any upcoming holiday blackout periods.'
                },
                {
                  step: '02',
                  title: 'Share Your Studio Link',
                  desc: 'Publish your personalized link across your Instagram bio, Google Maps, WhatsApp business profile, or website.'
                },
                {
                  step: '03',
                  title: 'Clients Book Instantly',
                  desc: 'Guests pick an available time in 30 seconds. Automatic email notifications confirm the appointment for both of you.'
                }
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-atelier-200 bg-white p-7 shadow-tactile dark:border-atelier-800 dark:bg-atelier-900">
                  <span className="font-editorial text-2xl font-bold text-primary-500">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-editorial text-xl font-bold text-atelier-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-atelier-600 dark:text-atelier-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 bg-atelier-100/70 dark:bg-atelier-900/60 border-t border-atelier-200/80 dark:border-atelier-850">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-5">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-atelier-900 dark:text-white">
              Give your studio the appointment system it deserves.
            </h2>
            <p className="mx-auto max-w-lg text-sm text-atelier-600 dark:text-atelier-400">
              Join salons, barbershops, wellness clinics, and independent artists simplifying their bookings today.
            </p>
            <div className="pt-2">
              <Link to={routes.register}>
                <Button size="lg" className="text-sm font-semibold px-8 shadow-tactile">
                  Create Your Free Account Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export { LandingPage };
