import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, getBookings, updateBooking } from '../api/booking.api.js';

const bookingsQueryKey = ['bookings'];

const useBookings = (params = {}) => useQuery({
  queryKey: [...bookingsQueryKey, params],
  queryFn: () => getBookings(params)
});

const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateBooking(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingsQueryKey });
    }
  });
};

const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cancelBooking(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingsQueryKey });
    }
  });
};

export { useBookings, useUpdateBooking, useCancelBooking };