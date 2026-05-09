import { Calendar, Clock3, Mail, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Badge, Button, Card } from '../ui/index.js';
import { BookingStatusBadge } from './BookingStatusBadge.jsx';
import { formatDate } from '../../utils/dateUtils.js';

const BookingCard = ({ booking, onCancel, onReschedule }) => {
  const [open, setOpen] = useState(false);

  const statusBorder = booking.status === 'cancelled' ? 'border-l-red-500' : booking.status === 'completed' ? 'border-l-sky-500' : booking.status === 'confirmed' ? 'border-l-emerald-500' : 'border-l-primary-500';

  return (
    <Card hover className={`relative rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-surface-800/50 dark:shadow-none dark:hover:bg-white/10 ${statusBorder}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={booking.customerName} />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{booking.customerName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{booking.customerPhone}</p>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-white/5">
        <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" /> {formatDate(booking.bookingDate)}</p>
        <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Clock3 className="h-4 w-4 text-primary-600 dark:text-primary-400" /> {booking.startTime} – {booking.endTime}</p>
        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Mail className="h-4 w-4 text-primary-600 dark:text-primary-400" /> {booking.customerEmail}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="secondary" size="sm" onClick={() => onReschedule?.(booking)} aria-label="Reschedule booking">Reschedule</Button>
        <div className="relative">
          <Button variant="ghost" size="sm" className="rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" onClick={() => setOpen((value) => !value)} aria-label="Open booking actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {open ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-surface-900 dark:shadow-black/30">
              <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5" onClick={() => { setOpen(false); onReschedule?.(booking); }}>
                Reschedule
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10" onClick={() => { setOpen(false); onCancel?.(booking); }}>
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export { BookingCard };