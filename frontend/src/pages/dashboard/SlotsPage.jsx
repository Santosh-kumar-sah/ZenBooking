import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Clock, Plus, X } from 'lucide-react';
import { getHolidays, getSlots, addHoliday, deleteHoliday, saveSlot } from '../../api/slot.api.js';
import { Button, Card, Input, Skeleton } from '../../components/ui/index.js';
import { formatDate } from '../../utils/dateUtils.js';
import { toast } from 'sonner';

// IMPORTANT: must match SlotConfig model enum exactly (capitalized full names)
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultRow = (dayOfWeek) => ({ dayOfWeek, startTime: '09:00', endTime: '18:00', durationMinutes: 30, isActive: true });

const PageHeader = () => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <Clock className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Slot Configuration</h1>
        <p className="text-sm text-slate-400">Set your weekly working hours and block days off.</p>
      </div>
    </div>
  </div>
);

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
      toast.success('Weekly schedule saved!');
      await queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: () => toast.error('Failed to save schedule')
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
      <PageHeader />

      {/* Weekly Schedule */}
      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Weekly Availability</h2>
          </div>
          <span className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300">
            {activeCount} of {DAYS.length} days active
          </span>
        </div>

        {slotsQuery.isLoading ? (
          <div className="space-y-3">
            {DAYS.map((d) => <Skeleton key={d} className="h-16" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS.map((day) => {
              const row = rows[day];
              return (
                <div
                  key={day}
                  className={`grid items-center gap-3 rounded-2xl border p-4 transition-all md:grid-cols-[160px_1fr_1fr_140px_48px] ${
                    row.isActive
                      ? 'border-white/10 bg-white/[0.03]'
                      : 'border-white/5 bg-white/[0.01] opacity-50'
                  }`}
                >
                  {/* Day toggle */}
                  <label className="flex cursor-pointer items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.isActive}
                      onClick={() => setRows((c) => ({ ...c, [day]: { ...c[day], isActive: !c[day].isActive } }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${row.isActive ? 'bg-primary-500' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${row.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm font-medium text-white">{day}</span>
                  </label>

                  {/* Start time */}
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">Start time</label>
                    <input
                      type="time"
                      value={row.startTime}
                      disabled={!row.isActive}
                      onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], startTime: e.target.value } }))}
                      className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-40"
                    />
                  </div>

                  {/* End time */}
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">End time</label>
                    <input
                      type="time"
                      value={row.endTime}
                      disabled={!row.isActive}
                      onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], endTime: e.target.value } }))}
                      className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-40"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">Slot duration</label>
                    <select
                      value={row.durationMinutes}
                      disabled={!row.isActive}
                      onChange={(e) => setRows((c) => ({ ...c, [day]: { ...c[day], durationMinutes: Number(e.target.value) } }))}
                      className="h-10 w-full rounded-xl border border-white/10 bg-surface-900 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-40"
                    >
                      {[15, 20, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${row.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
            Save Schedule
          </Button>
        </div>
      </Card>

      {/* Blocked Dates */}
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <X className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-white">Blocked Dates</h2>
        </div>
        <p className="mb-5 text-sm text-slate-400">Block specific dates for holidays, training, or vacations. Customers will not be able to book on these days.</p>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <Input type="date" label="Date to block" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} />
          <Input label="Reason (optional)" value={holidayReason} onChange={(e) => setHolidayReason(e.target.value)} placeholder="Holiday, staff training, etc." />
          <div className="flex items-end">
            <Button
              loading={addHolidayMutation.isPending}
              disabled={!holidayDate}
              onClick={() => addHolidayMutation.mutate({ date: holidayDate, reason: holidayReason })}
            >
              <Plus className="h-4 w-4" /> Block Date
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {holidaysQuery.isLoading ? (
            <Skeleton className="h-16" />
          ) : holidayList.length > 0 ? (
            holidayList.map((holiday) => (
              <div key={holiday._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{formatDate(holiday.date)}</p>
                  <p className="text-xs text-slate-400">{holiday.reason || 'Blocked date'}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => deleteHolidayMutation.mutate(holiday._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-slate-500">No blocked dates yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export { SlotsPage };