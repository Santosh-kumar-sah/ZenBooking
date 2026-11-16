import { format } from 'date-fns';
import { CheckCircle2, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';
import { formatDate, formatTime } from '../../utils/dateUtils.js';

const ChatBubble = ({ message, isTyping = false }) => {
  if (isTyping) {
    return (
      <div className="flex justify-start">
        <div className="rounded-2xl rounded-tl-sm border border-atelier-200 bg-atelier-50 px-4 py-3 text-atelier-600 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-300">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.14 }}
                className="h-1.5 w-1.5 rounded-full bg-atelier-400 dark:bg-atelier-500"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';
  const booking = message.bookingCreated;

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div className={cn(
        'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm select-text',
        isUser
          ? 'rounded-tr-sm bg-primary-500 text-white'
          : 'rounded-tl-sm border border-atelier-200 bg-atelier-50 text-atelier-800 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-100'
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Embedded Booking Confirmation Card */}
        {booking && (
          <div className="mt-3 overflow-hidden rounded-xl border border-accent-200 bg-white p-3.5 text-xs text-atelier-800 shadow-sm dark:border-accent-800 dark:bg-atelier-900 dark:text-atelier-100">
            <div className="flex items-center gap-1.5 font-semibold text-accent-700 dark:text-accent-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Appointment Confirmed</span>
            </div>
            <div className="mt-2.5 space-y-1.5 border-t border-atelier-100 pt-2 dark:border-atelier-800 text-[11px]">
              <div className="flex items-center gap-1.5 text-atelier-600 dark:text-atelier-400">
                <Calendar className="h-3 w-3 text-primary-500" />
                <span>{formatDate(booking.bookingDate || new Date())}</span>
              </div>
              <div className="flex items-center gap-1.5 text-atelier-600 dark:text-atelier-400">
                <Clock className="h-3 w-3 text-primary-500" />
                <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
              </div>
              <p className="pt-1 font-medium text-atelier-900 dark:text-atelier-100">Guest: {booking.customerName}</p>
            </div>
          </div>
        )}

        <p className={cn('mt-1.5 text-[10px]', isUser ? 'text-primary-100' : 'text-atelier-400 dark:text-atelier-500')}>
          {format(new Date(message.timestamp || Date.now()), 'p')}
        </p>
      </div>
    </div>
  );
};

export { ChatBubble };
