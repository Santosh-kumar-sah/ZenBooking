import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { getHolidays, getSlots, addHoliday, deleteHoliday, saveSlot } from '../../api/slot.api.js';
import { Button, Card, Input, Skeleton } from '../../components/ui/index.js';
import { formatDate } from '../../utils/dateUtils.js';
import { toast } from 'sonner';

// Must match SlotConfig model enum exactly
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultRow = (dayOfWeek) => ({
  dayOfWeek,
  startTime: '09:00',
  endTime: '18:00',
  durationMinutes: 30,
  isActive: true
});

const SlotsPage = () => {
  const queryClient = useQueryClient();
  const slotsQuery = useQuery({ queryKey: ['slots'], queryFn: getSlots });
  const holidaysQuery = useQuery({ queryKey: ['holidays'], queryFn: getHolidays });

  const [rows, setRows] = useState(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: defaultRow(day) }), {})
  );
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  useEffect(() => {
    const existing = slotsQuery.data?.data || [];
    if (!existing.length) return;
    setRows(
      DAYS.reduce((acc, day) => {
        const match = existing.find((s) => s.dayOfWeek === day);
        acc[day] = match || defaultRow(day);
        return acc;
      }, {})
    );
  }, [slotsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => Promise.all(DAYS.map((day) => saveSlot(rows[day]))),
    onSuccess: async () => {
      toast.success('Weekly schedule updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: () => toast.error('Failed to save schedule changes')
  });

  const addHolidayMutation = useMutation({
    mutationFn: addHoliday,
    onSuccess: async () => {
      toast.success('Date blocked successfully');
      setHolidayDate('');
      setHolidayReason('');
      await queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: () => toast.error('Failed to block date')
  });

  const deleteHolidayMutation = useMutation({
    mutationFn: deleteHoliday,
    onSuccess: async () => {
      toast.success('Blocked date removed');
      await queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: () => toast.error('Failed to remove blocked date')
  });

  const holidayList = useMemo(() => holidaysQuery.data?.data || [], [holidaysQuery.data]);
  const activeCount = Object.values(rows).filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500">Operating Hours</span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-atelier-900 dark:text-white">
          Schedule & Blackout Dates
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-atelier-500">
          Set your working hours for each day of the week and block holidays or vacations.
        </p>
      </div>

      {/* Weekly Schedule Card */}
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-atelier-100 pb-4 dark:border-atelier-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-500" />
            <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
              Weekly Availability
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-atelier-200 bg-atelier-50 px-3 py-1 text-xs font-medium text-atelier-700 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent-600" /> {activeCount} of {DAYS.length} days active
          </span>
        </div>

        {slotsQuery.isLoading ? (
          <div className="space-y-3">
            {DAYS.map((d) => <Skeleton key={d} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS.map((day) => {
              const row = rows[day];
              return (
                <div
                  key={day}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                    row.isActive
                      ? 'border-atelier-200 bg-white dark:border-atelier-800 dark:bg-atelier-850'
                      : 'border-atelier-100 bg-atelier-50/50 opacity-60 dark:border-atelier-850 dark:bg-atelier-900/50'
                  }`}
                >
                  {/* Day Toggle Switch */}
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.isActive}
                      onClick={() => setRows((c) => ({ ...c, [day]: { ...c[day], isActive: !c[day].isActive } }))}
                      className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${row.isActive ? 'bg-primary-500' : 'bg-atelier-300 dark:bg-atelier-700'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${row.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-xs font-semibold text-atelier-900 dark:text-white">{day}</span>
                  </div>

                  {/* Time and Duration Controls */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 flex-1 md:justify-end">
                    {/* Start Time */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-atelier-500 shrink-0">From</span>
                      <input
                        type="time"
                        value={row.startTime}
                        disabled={!row.isActive}
                        onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], startTime: e.target.value } }))}
                        className="h-9 w-28 rounded-lg border border-atelier-200 bg-atelier-50 px-2 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white disabled:opacity-40"
                      />
                    </div>

                    {/* End Time */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-atelier-500 shrink-0">To</span>
                      <input
                        type="time"
                        value={row.endTime}
                        disabled={!row.isActive}
                        onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], endTime: e.target.value } }))}
                        className="h-9 w-28 rounded-lg border border-atelier-200 bg-atelier-50 px-2 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white disabled:opacity-40"
                      />
                    </div>

                    {/* Slot Duration */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-atelier-500 shrink-0">Every</span>
                      <select
                        value={row.durationMinutes}
                        disabled={!row.isActive}
                        onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], durationMinutes: Number(e.target.value) } }))}
                        className="h-9 w-24 rounded-lg border border-atelier-200 bg-atelier-50 px-2 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white disabled:opacity-40"
                      >
                        {[15, 20, 30, 45, 60, 90, 120].map((d) => (
                          <option key={d} value={d}>{d} mins</option>
                        ))}
                      </select>
                    </div>

                    {/* Active Status Dot */}
                    <div className="hidden sm:flex items-center pl-1">
                      <span className={`h-2 w-2 rounded-full ${row.isActive ? 'bg-accent-600' : 'bg-atelier-300 dark:bg-atelier-700'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="text-xs font-semibold px-6"
          >
            Save Weekly Schedule
          </Button>
        </div>
      </Card>

      {/* Blackout / Holiday Dates Card */}
      <Card className="p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
            Studio Blackout Dates & Holidays
          </h2>
          <p className="mt-1 text-xs text-atelier-500">
            Block specific dates for studio maintenance, vacations, or holidays. Clients cannot book on blocked dates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
          <Input
            type="date"
            label="Date to block"
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
          />
          <Input
            label="Reason (optional)"
            value={holidayReason}
            onChange={(e) => setHolidayReason(e.target.value)}
            placeholder="Studio cleaning, holiday, etc."
          />
          <div>
            <Button
              loading={addHolidayMutation.isPending}
              disabled={!holidayDate}
              onClick={() => addHolidayMutation.mutate({ date: holidayDate, reason: holidayReason })}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5 h-10"
            >
              <Plus className="h-4 w-4" /> Block Date
            </Button>
          </div>
        </div>

        {/* List of blocked dates */}
        <div className="mt-5 space-y-2">
          {holidaysQuery.isLoading ? (
            <Skeleton className="h-14 rounded-xl" />
          ) : holidayList.length > 0 ? (
            holidayList.map((holiday) => (
              <div
                key={holiday._id}
                className="flex items-center justify-between rounded-xl border border-atelier-200 bg-atelier-50/70 px-4 py-2.5 text-xs dark:border-atelier-800 dark:bg-atelier-850"
              >
                <div>
                  <span className="font-semibold text-atelier-900 dark:text-white">
                    {formatDate(holiday.date)}
                  </span>
                  <span className="ml-2 text-atelier-500">
                    — {holiday.reason || 'Studio closed'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-atelier-400 hover:text-red-600 dark:hover:text-red-400"
                  onClick={() => deleteHolidayMutation.mutate(holiday._id)}
                  title="Remove blocked date"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-xs text-atelier-400">
              No blocked dates scheduled. Your regular weekly hours apply.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export { SlotsPage };
