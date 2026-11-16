import { useMemo, useState } from 'react';
import { addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '../ui/index.js';
import { isPastDate } from '../../utils/dateUtils.js';

const BookingCalendar = ({ availableSlots = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const availableDates = useMemo(() => new Set(availableSlots.map((slot) => format(new Date(slot.date), 'yyyy-MM-dd'))), [availableSlots]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">Select Date</span>
          <h3 className="font-editorial text-xl font-semibold text-atelier-900 dark:text-atelier-100">{format(currentMonth, 'MMMM yyyy')}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentMonth((value) => subMonths(value, 1))} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentMonth((value) => addMonths(value, 1))} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span key={label} className="py-1">{label}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date) => {
          const key = format(date, 'yyyy-MM-dd');
          const available = availableDates.has(key);
          const disabled = isPastDate(date) || !available || !isSameMonth(date, currentMonth);
          const selected = selectedDate ? isSameDay(new Date(selectedDate), date) : false;
          const today = isSameDay(date, new Date());

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onDateSelect?.(date)}
              className={[
                'relative flex h-10 w-full items-center justify-center rounded-xl text-xs font-medium transition-all duration-200',
                disabled ? 'cursor-not-allowed text-atelier-300 dark:text-atelier-700' : 'text-atelier-800 hover:bg-primary-50 hover:text-primary-700 dark:text-atelier-200 dark:hover:bg-atelier-800',
                selected ? '!bg-primary-500 !text-white font-semibold shadow-sm' : 'bg-transparent',
                today && !selected && !disabled ? 'border border-primary-300/80 dark:border-primary-700/80 font-semibold' : ''
              ].join(' ')}
              aria-label={format(date, 'PPP')}
            >
              <span>{format(date, 'd')}</span>
              {available && !disabled && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent-600 dark:bg-accent-400 opacity-80" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export { BookingCalendar };
