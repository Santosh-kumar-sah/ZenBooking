import { motion } from 'framer-motion';
import { Check, Calendar, Clock, MapPin, ArrowRight, Share2, Download } from 'lucide-react';
import { useLocation, useParams, Navigate, Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui/index.js';
import { PublicLayout } from '../../components/layout/PublicLayout.jsx';
import { formatDate, formatTime } from '../../utils/dateUtils.js';
import { routes } from '../../constants/routes.js';
import { toast } from 'sonner';

const BookingConfirmPage = () => {
  const { ownerId } = useParams();
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return <Navigate to={`/${ownerId}`} replace />;
  }

  const handleAddToCalendar = () => {
    try {
      const datePart = booking.bookingDate.split('T')[0];
      const startDateTime = new Date(`${datePart}T${booking.startTime}:00`);
      const endDateTime = new Date(`${datePart}T${booking.endTime}:00`);

      const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const title = encodeURIComponent(`Appointment at ${booking.businessName}`);
      const details = encodeURIComponent(`Appointment reserved for ${booking.customerName}.`);
      const dates = `${formatCalDate(startDateTime)}/${formatCalDate(endDateTime)}`;

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast.success('Calendar link opened');
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-16 bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          {/* Physical Style Ticket Card */}
          <Card className="overflow-hidden border border-atelier-200 bg-white p-0 shadow-card dark:border-atelier-800 dark:bg-atelier-900">
            {/* Header stamp */}
            <div className="border-b border-atelier-200 bg-atelier-100/60 p-8 text-center dark:border-atelier-800 dark:bg-atelier-850">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700 shadow-sm dark:bg-accent-950/60 dark:text-accent-300">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-400">
                Reservation Confirmed
              </span>
              <h1 className="mt-1 font-editorial text-3xl font-bold tracking-tight text-atelier-900 dark:text-white">
                We look forward to seeing you
              </h1>
              <p className="mt-2 text-xs text-atelier-600 dark:text-atelier-400">
                A confirmation has been sent to your contact details with full appointment instructions.
              </p>
            </div>

            {/* Ticket details */}
            <div className="space-y-4 p-7 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-atelier-100 pb-5 dark:border-atelier-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Studio</span>
                  <p className="mt-0.5 font-medium text-atelier-900 dark:text-atelier-100">{booking.businessName}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Guest</span>
                  <p className="mt-0.5 font-medium text-atelier-900 dark:text-atelier-100">{booking.customerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Date</span>
                    <p className="mt-0.5 font-medium text-atelier-900 dark:text-atelier-100">{formatDate(booking.bookingDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Time</span>
                    <p className="mt-0.5 font-medium text-atelier-900 dark:text-atelier-100">
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="rounded-xl border border-atelier-200/80 bg-atelier-50/70 p-3.5 text-xs text-atelier-600 dark:border-atelier-800 dark:bg-atelier-850 dark:text-atelier-400">
                <p className="font-semibold text-atelier-800 dark:text-atelier-200">Helpful Studio Note:</p>
                <p className="mt-1 leading-relaxed">
                  Please arrive 5 minutes before your scheduled appointment time. If you need to make any changes, you can do so directly from your confirmation message.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  variant="primary"
                  className="w-full gap-2 text-xs font-semibold"
                  onClick={handleAddToCalendar}
                >
                  <Calendar className="h-4 w-4" /> Add to Google Calendar
                </Button>
                <Link to={`/${ownerId}`} className="w-full">
                  <Button variant="secondary" className="w-full text-xs">
                    Book Another Slot
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export { BookingConfirmPage };
