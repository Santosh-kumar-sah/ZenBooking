import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RefreshCw, Sparkles, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { BookingTrendChart, PeakHoursChart } from '../../components/charts/index.js';
import { Button, Card, Skeleton } from '../../components/ui/index.js';
import { getBookings } from '../../api/booking.api.js';
import { getInsights } from '../../api/ai.api.js';
import { toast } from 'sonner';

const InsightsPage = () => {
  const [insightsText, setInsightsText] = useState('');
  const bookingsQuery = useQuery({ queryKey: ['bookings', 'insights'], queryFn: () => getBookings({ page: 1, limit: 500 }) });

  const bookings = bookingsQuery.data?.data || [];

  const analytics = useMemo(() => {
    const bookingsByDay = bookings.reduce((accumulator, booking) => {
      const day = format(parseISO(String(booking.bookingDate)), 'EEEE');
      accumulator[day] = (accumulator[day] || 0) + 1;
      return accumulator;
    }, {});

    const bookingsByHour = bookings.reduce((accumulator, booking) => {
      const hour = Number(String(booking.startTime || '00:00').split(':')[0]);
      accumulator[hour] = (accumulator[hour] || 0) + 1;
      return accumulator;
    }, {});

    const cancellationRate = bookings.length ? ((bookings.filter((booking) => booking.status === 'cancelled').length / bookings.length) * 100) : 0;
    const busiestDay = Object.entries(bookingsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const busiestHour = Object.entries(bookingsByHour).sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

    return {
      totalBookings: bookings.length,
      bookingsByDay,
      bookingsByHour,
      cancellationRate,
      busiestDay,
      busiestHour,
      trendData: Array.from({ length: 30 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));
        const key = format(date, 'yyyy-MM-dd');
        return { date: format(date, 'MMM d'), count: bookings.filter((booking) => format(parseISO(String(booking.bookingDate)), 'yyyy-MM-dd') === key).length };
      }),
      hoursData: Array.from({ length: 24 }, (_, hour) => ({ hour: `${String(hour).padStart(2, '0')}:00`, count: bookings.filter((booking) => Number(String(booking.startTime || '00:00').split(':')[0]) === hour).length }))
    };
  }, [bookings]);

  const insightsMutation = useMutation({
    mutationFn: getInsights,
    onSuccess: (response) => {
      const text = response?.data || response;
      setInsightsText(String(text || ''));
    },
    onError: () => toast.error('Could not reach AI. Try again.')
  });

  const insightLines = useMemo(() => insightsText
    .split(/\n|\r\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean), [insightsText]);

  const statCards = [
    { label: 'Total', value: analytics.totalBookings },
    { label: 'Busiest Day', value: analytics.busiestDay },
    { label: 'Busiest Hour', value: `${analytics.busiestHour}:00` },
    { label: 'Cancellation Rate', value: `${analytics.cancellationRate.toFixed(1)}%` }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bookingsQuery.isLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />) : statCards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-sm text-slate-400">{card.label}</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{card.value}</h3>
          </Card>
        ))}
      </section>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
            <p className="mt-1 text-sm text-slate-400">Generate Groq-powered analysis from your live bookings.</p>
          </div>
          <Button onClick={() => insightsMutation.mutate()} loading={insightsMutation.isPending}>
            {insightsText ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} {insightsText ? 'Regenerate' : 'Generate AI Insights'}
          </Button>
        </div>

        {insightsMutation.isPending ? (
          <div className="mt-5 rounded-2xl border border-primary-500/20 bg-primary-500/10 p-5">
            <p className="font-medium text-white">🤖 Groq AI is analysing your bookings...</p>
            <div className="mt-3 flex gap-2 text-primary-300">
              <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
            </div>
          </div>
        ) : null}

        {!insightsMutation.isPending && insightsText ? (
          <div className="mt-5 space-y-3">
            {insightLines.map((line, index) => (
              <div key={`${line}-${index}`} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                <p className="text-sm leading-6 text-slate-200">{line}</p>
              </div>
            ))}
          </div>
        ) : null}

        {!insightsMutation.isPending && insightsMutation.isError ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            Could not reach AI. Try again.
          </div>
        ) : null}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <BookingTrendChart data={analytics.trendData} />
        <PeakHoursChart data={analytics.hoursData} />
      </div>
    </div>
  );
};

export { InsightsPage };