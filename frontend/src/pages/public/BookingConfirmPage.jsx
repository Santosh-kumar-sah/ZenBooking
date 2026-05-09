import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLocation, useParams, Navigate, Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui/index.js';
import { PublicLayout } from '../../components/layout/PublicLayout.jsx';
import { formatDate, formatTime } from '../../utils/dateUtils.js';
import { routes } from '../../constants/routes.js';

const BookingConfirmPage = () => {
  const { ownerId } = useParams();
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return <Navigate to={`/${ownerId}`} replace />;
  }

  return (
    <PublicLayout>
    <div className="flex min-h-screen flex-col bg-surface-950 text-slate-100">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl p-8 text-center">
          <motion.svg viewBox="0 0 120 120" className="mx-auto h-24 w-24" initial="hidden" animate="visible">
            <motion.circle cx="60" cy="60" r="52" fill="url(#successGradient)" opacity="0.2" />
            <motion.path
              d="M38 61.5L52 75L83 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-emerald-400"
            />
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#22c55e" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </motion.svg>

          <h1 className="mt-4 text-3xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Booking Confirmed!</h1>
          <p className="mt-2 text-slate-300">See you soon, {booking.customerName}! Check your email for details.</p>

          <Card className="mt-6 p-5 text-left">
            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <p><span className="text-slate-500">Business:</span> {booking.businessName}</p>
              <p><span className="text-slate-500">Date:</span> {formatDate(booking.bookingDate)}</p>
              <p><span className="text-slate-500">Time:</span> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
              <p><span className="text-slate-500">Customer:</span> {booking.customerName}</p>
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`/${ownerId}`}><Button variant="secondary">Back to booking page</Button></Link>
            <Link to={routes.landing}><Button>Go home</Button></Link>
          </div>
        </Card>
      </main>
    </div>
    </PublicLayout>
  );
};

export { BookingConfirmPage };