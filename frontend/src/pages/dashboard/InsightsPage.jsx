import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RefreshCw, Sparkles, TrendingUp, Clock, Calendar, BarChart2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { BookingTrendChart, PeakHoursChart } from '../../components/charts/index.js';
import { Button, Card, Skeleton } from '../../components/ui/index.js';
import { getBookings } from '../../api/booking.api.js';
import { getInsights } from '../../api/ai.api.js';
import { toast } from 'sonner';

const InsightsPage = () => {
  const [insightsText, setInsightsText] = useState('');
  const bookingsQuery = useQuery({
    queryKey: ['bookings', 'insights'],
    queryFn: () => getBookings({ page: 1, limit: 500 })
  });

  const bookings = bookingsQuery.data?.data || [];

  const analytics = useMemo(() => {
    const bookingsByDay = bookings.reduce((acc, b) => {
      try {
        const day = format(parseISO(String(b.bookingDate)), 'EEEE');
        acc[day] = (acc[day] || 0) + 1;
      } catch {}
      return acc;
    }, {});

    const bookingsByHour = bookings.reduce((acc, b) => {
      try {
        const hour = Number(String(b.startTime || '00:00').split(':')[0]);
        acc[hour] = (acc[hour] || 0) + 1;
      } catch {}
      return acc;
    }, {});

    const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
    const cancellationRate = bookings.length ? (cancelledCount / bookings.length) * 100 : 0;
    const busiestDay = Object.entries(bookingsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const busiestHour = Object.entries(bookingsByHour).sort((a, b) => b[1] - a[1])[0]?.[0] || '10';

    return {
      totalBookings: bookings.length,
      busiestDay,
      busiestHour,
      cancellationRate,
      trendData: Array.from({ length: 14 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - index));
        const key = format(date, 'yyyy-MM-dd');
        return {
          date: format(date, 'MMM d'),
          count: bookings.filter((b) => {
            try {
              return format(parseISO(String(b.bookingDate)), 'yyyy-MM-dd') === key;
            } catch {
              return false;
            }
          }).length
        };
      }),
      hoursData: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => ({
        hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`,
        count: bookings.filter((b) => {
          try {
            return Number(String(b.startTime || '00:00').split(':')[0]) === hour;
          } catch {
            return false;
          }
        }).length
      }))
    };
  }, [bookings]);

  const insightsMutation = useMutation({
    mutationFn: getInsights,
    onSuccess: (response) => {
      const text = response?.data || response;
      setInsightsText(String(text || ''));
      toast.success('Executive intelligence updated');
    },
    onError: () => toast.error('Could not synthesize studio insights. Please try again.')
  });

  const insightLines = useMemo(() => {
    return insightsText
      .split(/\n|\r\n/)
      .map((line) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((line) => line.length > 0 && !line.toLowerCase().includes('here are') && !line.toLowerCase().includes('insights:'));
  }, [insightsText]);

  const statCards = [
    { label: 'Total Volume', value: analytics.totalBookings, note: 'All-time appointments', icon: BarChart2 },
    { label: 'Peak Booking Day', value: analytics.busiestDay, note: 'Highest customer demand', icon: Calendar },
    { label: 'Busiest Arrival Hour', value: `${analytics.busiestHour}:00`, note: 'Peak studio traffic', icon: Clock },
    { label: 'Cancellation Ratio', value: `${analytics.cancellationRate.toFixed(1)}%`, note: 'Retention benchmark', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500">Business Analytics</span>
          <h1 className="font-editorial text-2xl font-bold text-atelier-900 dark:text-white">
            Studio Intelligence & Booking Trends
          </h1>
          <p className="mt-1 text-xs text-atelier-500">
            Synthesized pattern recognition to help you optimize studio capacity and client retention.
          </p>
        </div>

        <Button
          onClick={() => insightsMutation.mutate()}
          loading={insightsMutation.isPending}
          size="sm"
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          {insightsText ? <RefreshCw className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          {insightsText ? 'Refresh Analysis' : 'Synthesize Insights'}
        </Button>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {bookingsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">
                        {card.label}
                      </span>
                      <h3 className="mt-2 font-editorial text-3xl font-bold text-atelier-900 dark:text-white">
                        {card.value}
                      </h3>
                      <p className="mt-1 text-[11px] text-atelier-400">{card.note}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-atelier-100 text-atelier-700 dark:bg-atelier-800 dark:text-atelier-300">
                      <Icon className="h-4 w-4 text-primary-500" />
                    </div>
                  </div>
                </Card>
              );
            })}
      </section>

      {/* Executive Intelligence Synthesis Box */}
      <Card className="p-6">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Executive Synthesis
          </span>
          <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
            Studio Trends & Operational Recommendations
          </h2>
        </div>

        {insightsMutation.isPending ? (
          <div className="rounded-xl border border-atelier-200 bg-atelier-50/70 p-6 text-center text-xs text-atelier-600 dark:border-atelier-800 dark:bg-atelier-850 dark:text-atelier-400">
            Synthesizing appointment records from the past 90 days...
          </div>
        ) : insightLines.length > 0 ? (
          <div className="space-y-3">
            {insightLines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-atelier-100 bg-atelier-50/60 p-3.5 text-xs text-atelier-700 dark:border-atelier-800 dark:bg-atelier-850 dark:text-atelier-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-atelier-200 p-8 text-center text-xs text-atelier-500 dark:border-atelier-800">
            Click <strong>"Synthesize Insights"</strong> above to generate tailored business recommendations from your live booking history.
          </div>
        )}
      </Card>

      {/* Dual Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Volume</span>
            <h3 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
              14-Day Booking Trajectory
            </h3>
          </div>
          <div className="h-64">
            <BookingTrendChart data={analytics.trendData} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500">Hourly Distribution</span>
            <h3 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
              Busiest Studio Hours
            </h3>
          </div>
          <div className="h-64">
            <PeakHoursChart data={analytics.hoursData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export { InsightsPage };
