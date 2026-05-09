import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { getBookings, updateBooking, cancelBooking } from '../../api/booking.api.js';
import { getBusinessPage } from '../../api/public.api.js';
import { BookingCard } from '../../components/booking/index.js';
import { Button, Card, Input, Modal, Skeleton } from '../../components/ui/index.js';
import { SlotPicker } from '../../components/booking/SlotPicker.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { formatDate } from '../../utils/dateUtils.js';
import { toast } from 'sonner';

const tabs = ['all', 'confirmed', 'cancelled', 'completed'];

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
      toast.success('Booking cancelled');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Failed to cancel booking')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBooking(id, payload),
    onSuccess: async () => {
      toast.success('Booking updated');
      setSelectedBooking(null);
      setRescheduleDate('');
      setSelectedSlot(null);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Failed to update booking')
  });

  const bookings = pageQuery.data?.data || [];
  const filteredBookings = useMemo(
    () => bookings.filter((booking) => booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
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
    if (window.confirm('Cancel this booking?')) {
      cancelMutation.mutate(booking._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Input label="Search" placeholder="Search by customer name" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button key={tab} variant={activeTab === tab ? 'primary' : 'secondary'} size="sm" onClick={() => { setActiveTab(tab); setPage(1); }}>
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pageQuery.isLoading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-56" />) : filteredBookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} onReschedule={openReschedule} onCancel={handleCancel} />
        ))}
      </div>

      {!pageQuery.isLoading && filteredBookings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center text-slate-400">
          <Calendar className="h-10 w-10 text-slate-500" />
          <p>No bookings found</p>
        </Card>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</Button>
        <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
      </div>

      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `Reschedule ${selectedBooking.customerName}` : 'Reschedule booking'}
      >
        <div className="space-y-4">
          <Input
            type="date"
            label="Booking date"
            value={rescheduleDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(event) => {
              setRescheduleDate(event.target.value);
              setSelectedSlot(null);
            }}
          />
          <div>
            <p className="mb-2 text-sm text-slate-400">Available slots for {rescheduleDate || 'selected date'}</p>
            <SlotPicker
              slots={availableSlots}
              selectedSlot={selectedSlot?.slotConfigId || selectedSlot?.startTime}
              onSlotSelect={setSelectedSlot}
            />
          </div>
          {selectedBooking ? <p className="text-sm text-slate-400">Current booking: {formatDate(selectedBooking.bookingDate)} · {selectedBooking.startTime}</p> : null}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedBooking(null)}>Close</Button>
            <Button
              loading={updateMutation.isPending}
              onClick={() => updateMutation.mutate({
                id: selectedBooking._id,
                payload: {
                  bookingDate: rescheduleDate,
                  startTime: selectedSlot?.startTime || selectedBooking.startTime,
                  endTime: selectedSlot?.endTime || selectedBooking.endTime
                }
              })}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { BookingsPage };