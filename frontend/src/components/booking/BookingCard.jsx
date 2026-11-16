import { Calendar, Clock, Mail, Phone, MoreVertical, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Avatar, Button, Card } from '../ui/index.js';
import { BookingStatusBadge } from './BookingStatusBadge.jsx';
import { formatDate, formatTime } from '../../utils/dateUtils.js';

const BookingCard = ({ booking, onCancel, onReschedule }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card hover className="relative p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={booking.customerName} />
            <div className="min-w-0">
              <h3 className="font-editorial text-base font-bold text-atelier-900 dark:text-white truncate">
                {booking.customerName}
              </h3>
              {booking.customerPhone && (
                <p className="flex items-center gap-1 text-[11px] text-atelier-500">
                  <Phone className="h-3 w-3" /> {booking.customerPhone}
                </p>
              )}
            </div>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-4 space-y-1.5 border-t border-atelier-100 pt-3 text-xs text-atelier-600 dark:border-atelier-800 dark:text-atelier-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary-500 shrink-0" />
            <span className="font-medium text-atelier-800 dark:text-atelier-200">
              {formatDate(booking.bookingDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary-500 shrink-0" />
            <span>
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </span>
          </div>
          {booking.customerEmail && (
            <div className="flex items-center gap-2 text-atelier-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{booking.customerEmail}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-atelier-100 pt-3 dark:border-atelier-800">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs font-semibold gap-1.5 h-8"
          onClick={() => onReschedule?.(booking)}
        >
          <RefreshCw className="h-3 w-3" /> Reschedule
        </Button>

        {booking.status !== 'cancelled' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-atelier-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 px-2.5"
            onClick={() => onCancel?.(booking)}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};

export { BookingCard };
