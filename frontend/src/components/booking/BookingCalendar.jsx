import { useMemo, useState } from 'react';
import { addMonths, endOfMonth, endOfWeek, format, getDay, isBefore, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
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
    <Card className="border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((value) => subMonths(value, 1))} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{format(currentMonth, 'MMMM yyyy')}</h3>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth((value) => addMonths(value, 1))} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span key={label}>{label}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
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
                'flex h-11 items-center justify-center rounded-full text-sm transition-all duration-300',
                disabled ? 'cursor-not-allowed text-slate-300 dark:text-slate-700' : 'text-slate-900 hover:bg-primary-50 hover:text-primary-700 dark:text-white dark:hover:bg-primary-500/20 dark:hover:text-white',
                selected ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white ring-2 ring-primary-500/40' : 'bg-transparent',
                today && !selected ? 'ring-1 ring-slate-300 dark:ring-white/20' : ''
              ].join(' ')}
              aria-label={format(date, 'PPP')}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export { BookingCalendar };