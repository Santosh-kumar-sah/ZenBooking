import { Calendar, Clock3, EllipsisVertical, Mail, MoreVertical, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Badge, Button, Card } from '../ui/index.js';
import { BookingStatusBadge } from './BookingStatusBadge.jsx';
import { formatDate } from '../../utils/dateUtils.js';

const BookingCard = ({ booking, onCancel, onReschedule }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card hover className="relative p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={booking.customerName} />
          <div>
            <h3 className="font-medium text-white">{booking.customerName}</h3>
            <p className="text-sm text-slate-400">{booking.customerPhone}</p>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary-400" /> {formatDate(booking.bookingDate)}</p>
        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary-400" /> {booking.startTime} – {booking.endTime}</p>
        <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-400" /> {booking.customerEmail}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="secondary" size="sm" onClick={() => onReschedule?.(booking)} aria-label="Reschedule booking">Reschedule</Button>
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setOpen((value) => !value)} aria-label="Open booking actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {open ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-2xl border border-white/10 bg-surface-900 p-2 shadow-2xl shadow-black/30">
              <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/5" onClick={() => { setOpen(false); onReschedule?.(booking); }}>
                Reschedule
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10" onClick={() => { setOpen(false); onCancel?.(booking); }}>
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