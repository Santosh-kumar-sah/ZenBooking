import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Search, Clock, User, Phone, Mail, X, Check, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getBookings, updateBooking, cancelBooking } from '../../api/booking.api.js';
import { getBusinessPage } from '../../api/public.api.js';
import { BookingCard } from '../../components/booking/index.js';
import { Button, Card, Input, Modal, Skeleton } from '../../components/ui/index.js';
import { SlotPicker } from '../../components/booking/SlotPicker.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { formatDate } from '../../utils/dateUtils.js';
import { toast } from 'sonner';

const tabs = [
  { id: 'all', label: 'All Appointments' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
];

const BookingsPage = () => {
  const queryClient = useQueryClient();
  const owner = useAuthStore((state) => state.owner);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const pageQuery = useQuery({
    queryKey: ['bookings', activeTab, page],
    queryFn: () => getBookings({ page, limit: 10, status: activeTab === 'all' ? undefined : activeTab })
  });

  const allCountQuery = useQuery({
    queryKey: ['bookings', activeTab, 'count'],
    queryFn: () => getBookings({ page: 1, limit: 1000, status: activeTab === 'all' ? undefined : activeTab })
  });

  const publicPageQuery = useQuery({
    queryKey: ['public-owner', owner?._id, rescheduleDate],
    queryFn: () => getBusinessPage(owner?._id),
    enabled: Boolean(owner?._id && selectedBooking && rescheduleDate)
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      toast.success('Appointment cancelled');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Failed to cancel appointment')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBooking(id, payload),
    onSuccess: async () => {
      toast.success('Appointment rescheduled successfully');
      setSelectedBooking(null);
      setRescheduleDate('');
      setSelectedSlot(null);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err) => {
      if (err?.response?.status === 409) {
        toast.error('This slot is already occupied. Please pick an alternative.');
        return;
      }
      toast.error('Failed to reschedule appointment');
    }
  });

  const bookings = pageQuery.data?.data || [];
  const filteredBookings = useMemo(
    () => bookings.filter((b) => (b.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())),
    [bookings, searchTerm]
  );
  const totalBookings = allCountQuery.data?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalBookings / 10));

  const availableSlots = useMemo(() => {
    const slots = publicPageQuery.data?.data?.slots || publicPageQuery.data?.data?.availableSlots || [];
    if (!rescheduleDate) return [];
    return slots.filter((slot) => format(new Date(slot.date), 'yyyy-MM-dd') === rescheduleDate);
  }, [publicPageQuery.data, rescheduleDate]);

  const openReschedule = (booking) => {
    setSelectedBooking(booking);
    setRescheduleDate(format(new Date(booking.bookingDate), 'yyyy-MM-dd'));
    setSelectedSlot({ startTime: booking.startTime, endTime: booking.endTime, slotConfigId: booking.slotConfigId });
  };

  const handleCancel = (booking) => {
    if (window.confirm(`Are you sure you want to cancel the appointment for ${booking.customerName}?`)) {
      cancelMutation.mutate(booking._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500">Client Management</span>
          <h1 className="font-editorial text-2xl font-bold text-atelier-900 dark:text-white">
            Appointments & Reservations
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-atelier-50 text-atelier-600 hover:bg-atelier-100 dark:bg-atelier-800 dark:text-atelier-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-atelier-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guest name..."
              className="w-full rounded-xl border border-atelier-200 bg-atelier-50 py-2 pl-9 pr-4 text-xs text-atelier-900 placeholder-atelier-400 focus:border-primary-500 focus:bg-white focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <div className="space-y-3">
        {pageQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : filteredBookings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
                onReschedule={openReschedule}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-atelier-400" />
            <h3 className="mt-3 font-editorial text-lg font-bold text-atelier-800 dark:text-white">
              No Appointments Found
            </h3>
            <p className="mt-1 text-xs text-atelier-500">
              {searchTerm ? 'Try a different search term or tab.' : 'Appointments booked by clients will appear here.'}
            </p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-atelier-200/80 pt-4 dark:border-atelier-800 text-xs text-atelier-600">
          <span>
            Page {page} of {totalPages} ({totalBookings} total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedBooking && (
        <Modal
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          title={`Reschedule: ${selectedBooking.customerName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-atelier-500">
              Select a new date and available time slot to update this appointment.
            </p>

            <Input
              type="date"
              label="New Appointment Date"
              value={rescheduleDate}
              onChange={(e) => {
                setRescheduleDate(e.target.value);
                setSelectedSlot(null);
              }}
            />

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
                Available Times
              </span>
              <SlotPicker
                slots={availableSlots}
                selectedSlot={selectedSlot?.slotConfigId || selectedSlot?.startTime}
                onSlotSelect={(slot) => setSelectedSlot(slot)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-atelier-100 dark:border-atelier-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedSlot}
                loading={updateMutation.isPending}
                onClick={() => {
                  updateMutation.mutate({
                    id: selectedBooking._id,
                    payload: {
                      bookingDate: new Date(rescheduleDate).toISOString(),
                      startTime: selectedSlot.startTime,
                      endTime: selectedSlot.endTime
                    }
                  });
                }}
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { BookingsPage };
