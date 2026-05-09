import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Calendar, Bot, Zap, Bell, Smartphone } from 'lucide-react';
import { Button, Card } from '../components/ui/index.js';
import { Footer } from '../components/layout/Footer.jsx';
import { routes } from '../constants/routes.js';

const features = [
  { title: 'AI Booking Assistant', desc: 'Customers just type naturally and AI books for them', icon: Bot },
  { title: 'Smart Calendar', desc: 'Auto-manages your slots and blocks unavailable times', icon: Calendar },
  { title: 'Instant Notifications', desc: 'Email confirmations sent to customer and owner automatically', icon: Bell },
  { title: 'AI Insights', desc: 'Understand your busiest hours and booking trends in plain English', icon: Zap },
  { title: 'Zero Setup', desc: 'Go live in minutes with no technical skills needed', icon: Zap },
  { title: 'Mobile Ready', desc: 'Beautiful and fast on every screen size', icon: Smartphone }
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-surface-950 dark:text-slate-100 font-sans">
      <header className={`fixed left-0 right-0 z-50 transition-all ${scrolled ? 'backdrop-blur-xl bg-white/90 border-b border-slate-200 dark:bg-surface-950/80 dark:border-white/5' : 'bg-transparent'}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to={routes.landing} className="flex items-center gap-3">
            <span className="text-primary-300 mr-1 text-lg">⚡</span>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-xl font-extrabold text-transparent">ZenBooking</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">How It Works</a>
            <a href="#for-business" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">For Business</a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to={routes.login} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">Login</Link>
            <Link to={routes.register} className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-4 text-sm font-semibold text-white">Get Started Free</Link>
          </div>

          <button className="lg:hidden rounded-full p-2 border border-slate-300 bg-white dark:border-white/10 dark:bg-white/5" onClick={() => setMenuOpen((s) => !s)} aria-label="menu">{menuOpen ? '✕' : '☰'}</button>
        </nav>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="lg:hidden border-t border-slate-200 bg-white/95 px-4 py-4 dark:border-white/10 dark:bg-surface-900/80">
            <div className="flex flex-col gap-3">
              <a href="#features" className="py-3">Features</a>
              <a href="#how-it-works" className="py-3">How It Works</a>
              <a href="#for-business" className="py-3">For Business</a>
              <div className="flex gap-3 pt-2">
                <Link to={routes.login} className="flex-1 rounded-full border border-slate-300 bg-white py-2 text-center dark:border-white/10 dark:bg-white/5">Login</Link>
                <Link to={routes.register} className="flex-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 py-2 text-center text-white">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="pt-20">
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-slate-100 dark:from-surface-950 dark:to-surface-900">
          <div className="absolute left-[-10%] top-[-15%] h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
          <div className="absolute right-[-8%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl animate-blob" />

          <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-between gap-12 px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-3 py-1 text-xs font-semibold text-white">AI Powered Booking</div>
              <h1 className="text-5xl font-extrabold leading-tight">
                Book Smarter with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">AI</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">Your customers book in seconds, you focus on your work — let AI handle the rest.</p>
              <div className="flex gap-3">
                <Link to={routes.register} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow">Start Free Today</Link>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">See How It Works</a>
              </div>

              <div className="mt-6">
                <div className="relative inline-block animate-float">
                  <div className="w-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-glow">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold">S</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">Zen Salon</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Barbershop • 4.9⭐</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Today</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-xs">
                      {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="flex h-8 items-center justify-center rounded bg-slate-100 text-slate-700 dark:bg-white/3 dark:text-slate-200">{d}</div>)}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-white/90">10:00 AM</div>
                      <div className="rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-3 py-2 text-sm text-white">11:00 AM</div>
                      <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-white/5 dark:text-white/90">12:30 PM</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-white">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden w-1/2 shrink-0 md:block">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/6 dark:bg-surface-900 dark:shadow-glow">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick overview</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage bookings, see insights and let AI handle reminders.</p>
                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/6 dark:bg-white/[0.02]">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Bookings today</div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">⚡</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Everything you need to run your bookings</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Manage schedule, automate reminders, and get AI insights — all in one place.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} viewport={{ once: true }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white"><Icon className="h-5 w-5" /></div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Up and running in 3 steps</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Create your account, share a link, let customers book — it’s that simple.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{
              n: '1', title: 'Create your account', desc: 'Sign up as a business owner and AI instantly generates your professional booking page', icon: '👤'
            },{
              n: '2', title: 'Share your booking link', desc: 'Share your unique link on Instagram, WhatsApp or anywhere your customers are', icon: '🔗'
            },{
              n: '3', title: 'Customers book instantly', desc: 'Customers pick a slot and confirm in under 30 seconds with no account needed', icon: '📅'
            }].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-3 py-2 text-white font-bold">{s.n}</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">{s.title}</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="for-business" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your personal AI receptionist</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Automate bookings and reminders so you never miss a customer.</p>
              <ul className="mt-6 space-y-3">
                {['Never miss a booking again','AI writes personalised reminders for every customer','See which hours and days bring you the most business','Manage reschedules and cancellations in one click','Share one link and let AI do the rest'].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <div className="mt-1 text-emerald-400"><CheckCircle className="h-5 w-5" /></div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">{t}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to={routes.register} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white">Get Started Free</Link>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Today's Overview</div>
                    <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">12 bookings • 3 upcoming</div>
                  </div>
                </div>
                <div className="mt-6 h-28 w-full rounded-md bg-gradient-to-r from-primary-600 to-accent-600/30" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trusted by businesses everywhere</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Real stories from real customers.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[{
              name: 'Rahul Sharma', role: 'Barbershop • Delhi', quote: 'This completely changed how I manage my appointments; my customers love the chat booking feature.'
            },{
              name: 'Priya Mehta', role: 'Spa • Mumbai', quote: 'The AI reminder messages are so personal my no-show rate dropped by 60 percent.'
            },{
              name: 'Arjun Patel', role: 'Clinic • Bangalore', quote: 'Setup took 5 minutes and the AI insights showed me I was losing bookings on Monday mornings.'
            }].map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm italic text-slate-700 dark:text-slate-300">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-10">
            <h2 className="text-3xl font-extrabold text-white">Ready to automate your bookings?</h2>
            <p className="mt-3 text-white/90">Join businesses already using ZenBooking</p>
            <div className="mt-6">
              <Link to={routes.register} className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-white">Start Free Today</Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export { LandingPage };