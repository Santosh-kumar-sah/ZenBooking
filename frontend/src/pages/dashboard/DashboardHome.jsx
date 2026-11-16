import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Copy, Link2, Check, ExternalLink, X, AlertCircle } from 'lucide-react';
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { BookingTrendChart } from '../../components/charts/index.js';
import { Avatar, Badge, Button, Card, Skeleton } from '../../components/ui/index.js';
import { cancelBooking, getBookings } from '../../api/booking.api.js';
import { useAuthStore } from '../../store/authStore.js';
import { isPastDate, formatDate, formatTime } from '../../utils/dateUtils.js';
import { formatNumber } from '../../utils/formatters.js';
import { toast } from 'sonner';

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let animationFrame;
    const start = performance.now();
    const animate = (time) => {
      const progress = Math.min((time - start) / 600, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{formatNumber(display)}</span>;
};

const DashboardHome = () => {
  const owner = useAuthStore((state) => state.owner);
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const bookingsQuery = useQuery({
    queryKey: ['bookings', 'dashboard-home'],
    queryFn: () => getBookings({ page: 1, limit: 500 })
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      toast.success('Appointment cancelled');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Could not cancel appointment')
  });

  const bookings = bookingsQuery.data?.data || [];
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });

  const stats = useMemo(() => {
    const todayBookings = bookings.filter((booking) => format(new Date(booking.bookingDate), 'yyyy-MM-dd') === todayKey).length;
    const thisWeekBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= start && bookingDate <= end;
    }).length;
    const upcoming = bookings.filter((booking) => booking.status === 'confirmed' && !isPastDate(booking.bookingDate)).length;
    const cancelled = bookings.filter((booking) => booking.status === 'cancelled').length;
    const cancellationRate = bookings.length ? (cancelled / bookings.length) * 100 : 0;

    return [
      { label: "Today's Appointments", value: todayBookings, icon: Clock, note: 'Scheduled for today' },
      { label: "This Week's Volume", value: thisWeekBookings, icon: Calendar, note: 'Mon through Sun' },
      { label: 'Upcoming Confirmed', value: upcoming, icon: Check, note: 'Active future visits' },
      { label: 'Cancellation Rate', value: cancellationRate, suffix: '%', icon: AlertCircle, note: 'Last 90 days ratio' }
    ];
  }, [bookings, todayKey, start, end]);

  const trendData = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const date = addDays(new Date(), -13 + index);
      const count = bookings.filter((booking) => format(new Date(booking.bookingDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')).length;
      return { date: format(date, 'MMM d'), count };
    });
  }, [bookings]);

  const upcomingBookings = useMemo(
    () => bookings
      .filter((booking) => booking.status === 'confirmed' && !isPastDate(booking.bookingDate))
      .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
      .slice(0, 5),
    [bookings]
  );

  const bookingLink = `${window.location.origin}/${owner?._id || ''}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    toast.success('Studio booking link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Shareable Studio Booking Link Card */}
      <Card className="overflow-hidden border border-atelier-200 bg-white p-5 shadow-tactile dark:border-atelier-800 dark:bg-atelier-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Shareable Studio Link
            </span>
            <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
              Your Public Booking Page is Live
            </h2>
            <p className="text-xs text-atelier-500">
              Share this link in your Instagram bio, Google Business profile, or text it directly to guests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block rounded-xl border border-atelier-200 bg-atelier-50 px-3.5 py-2 font-mono text-xs text-atelier-700 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-300 max-w-xs truncate">
              {bookingLink}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={copyLink}
              className="gap-2 text-xs font-semibold"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <a href={bookingLink} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="p-2.5">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {bookingsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : stats.map(({ label, value, icon: Icon, suffix = '', note }) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">
                      {label}
                    </span>
                    <h3 className="mt-2 font-editorial text-3xl font-bold text-atelier-900 dark:text-white">
                      <AnimatedNumber value={Number(value || 0)} />{suffix}
                    </h3>
                    <p className="mt-1 text-[11px] text-atelier-400">{note}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-atelier-100 text-atelier-700 dark:bg-atelier-800 dark:text-atelier-300">
                    <Icon className="h-4 w-4 text-primary-500" />
                  </div>
                </div>
              </Card>
            ))}
      </section>

      {/* Trend Chart & Upcoming Bookings Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Booking Volume Trend */}
        <Card className="p-5">
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Activity Overview</span>
            <h3 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
              14-Day Appointment Volume
            </h3>
          </div>
          <div className="h-64">
            <BookingTrendChart data={trendData} />
          </div>
        </Card>

        {/* Upcoming Appointments Feed */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Schedule</span>
                <h3 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
                  Next Upcoming Visits
                </h3>
              </div>
              <span className="text-xs font-medium text-atelier-400">
                {upcomingBookings.length} confirmed
              </span>
            </div>

            <div className="space-y-3">
              {bookingsQuery.isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between rounded-xl border border-atelier-200 bg-atelier-50/60 p-3 text-xs dark:border-atelier-800 dark:bg-atelier-850"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={booking.customerName} />
                      <div className="min-w-0">
                        <p className="font-semibold text-atelier-900 dark:text-white truncate">
                          {booking.customerName}
                        </p>
                        <p className="text-[11px] text-atelier-500 truncate">
                          {formatDate(booking.bookingDate)} · {formatTime(booking.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={booking.status} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-atelier-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Cancel appointment"
                        onClick={() => {
                          if (window.confirm(`Cancel appointment for ${booking.customerName}?`)) {
                            cancelMutation.mutate(booking._id);
                          }
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-atelier-500">
                  No upcoming appointments scheduled yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-atelier-100 pt-3 dark:border-atelier-800 text-center">
            <a
              href="/dashboard/bookings"
              className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              View All Appointments &rarr;
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { DashboardHome };
