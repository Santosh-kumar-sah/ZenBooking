import { addDays, format, isBefore, isValid, parse, parseISO } from 'date-fns';

const safeDate = (value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && value.includes('T')) {
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
  }
  if (typeof value === 'string') {
    const parsed = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(value);
  return isValid(fallback) ? fallback : new Date();
};

const formatDate = (value) => format(safeDate(value), 'EEEE, d MMMM yyyy');
const formatTime = (value) => {
  if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
    return format(parse(value, 'HH:mm', new Date()), 'hh:mm a');
  }
  return format(safeDate(value), 'hh:mm a');
};
const isPastDate = (value) => isBefore(safeDate(value), new Date(new Date().setHours(0, 0, 0, 0)));
const getDatesInRange = (startDate, endDate) => {
  const start = safeDate(startDate);
  const end = safeDate(endDate);
  const dates = [];
  for (let date = start; date <= end; date = addDays(date, 1)) {
    dates.push(new Date(date));
  }
  return dates;
};

const formatDateTime = (value, pattern = 'PPP p') => format(safeDate(value), pattern);
const formatShortDate = (value) => format(safeDate(value), 'EEE, MMM d');
const isTodayRange = (value) => format(safeDate(value), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
const isUpcoming = (value) => !isPastDate(value);
const isPast = (value) => isPastDate(value);
const addDaysSafe = (value, amount) => addDays(safeDate(value), amount);
const rangeEnd = (value) => addDaysSafe(value, 1);
const sinceNow = (value) => format(safeDate(value), 'PP');

export { formatDate, formatTime, isPastDate, getDatesInRange, formatDateTime, formatShortDate, isTodayRange, isUpcoming, isPast, addDaysSafe, rangeEnd, sinceNow };