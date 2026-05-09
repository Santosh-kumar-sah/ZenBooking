import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, CalendarDays, CircleDollarSign, Copy, Link2, TriangleAlert } from 'lucide-react';
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { BookingTrendChart } from '../../components/charts/index.js';
import { Avatar, Badge, Button, Card, Input, Skeleton } from '../../components/ui/index.js';
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
      const progress = Math.min((time - start) / 700, 1);
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
  const bookingsQuery = useQuery({ queryKey: ['bookings', 'dashboard-home'], queryFn: () => getBookings({ page: 1, limit: 500 }) });
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      toast.success('Booking cancelled');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Could not cancel booking')
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
      { label: "Today's bookings", value: todayBookings, icon: CalendarClock },
      { label: "This week's bookings", value: thisWeekBookings, icon: CalendarDays },
      { label: 'Upcoming confirmed', value: upcoming, icon: CircleDollarSign },
      { label: 'Cancellation rate', value: cancellationRate, icon: TriangleAlert, suffix: '%' }
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
    toast.success('Link copied! 🔗');
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bookingsQuery.isLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />) : stats.map(({ label, value, icon: Icon, suffix = '' }) => (
          <Card key={label} hover className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <h2 className="mt-2 text-3xl font-bold text-white"><AnimatedNumber value={Number(value || 0)} />{suffix}</h2>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 p-3 text-white">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Share booking link</h3>
              <p className="text-sm text-slate-400">Send this link to customers so they can book instantly.</p>
            </div>
            <Link2 className="h-5 w-5 text-primary-400" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input value={bookingLink} readOnly />
            <Button onClick={copyLink} className="sm:min-w-40">
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </Card>

        <BookingTrendChart data={trendData} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Upcoming bookings</h3>
        </div>
        <div className="space-y-3">
          {bookingsQuery.isLoading ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24" />) : upcomingBookings.map((booking) => (
            <Card key={booking._id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <Avatar name={booking.customerName} />
                <div>
                  <h4 className="font-medium text-white">{booking.customerName}</h4>
                  <p className="text-sm text-slate-400">{formatDate(booking.bookingDate)} · {formatTime(booking.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={booking.status}>{booking.status}</Badge>
                <Button variant="danger" size="sm" loading={cancelMutation.isPending} onClick={() => cancelMutation.mutate(booking._id)}>
                  Cancel
                </Button>
              </div>
            </Card>
          ))}
          {!bookingsQuery.isLoading && upcomingBookings.length === 0 ? <Card className="p-8 text-center text-slate-400">No upcoming bookings found.</Card> : null}
        </div>
      </section>
    </div>
  );
};

export { DashboardHome };