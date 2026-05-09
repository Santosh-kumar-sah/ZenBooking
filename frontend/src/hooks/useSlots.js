import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addHoliday, deleteHoliday, getSlots, saveSlot } from '../api/slot.api.js';

const slotsQueryKey = ['slots'];

const useSlots = () => useQuery({
  queryKey: slotsQueryKey,
  queryFn: getSlots
});

const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => saveSlot(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slotsQueryKey });
    }
  });
};

const useAddHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => addHoliday(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slotsQueryKey });
    }
  });
};

const useDeleteHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteHoliday(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slotsQueryKey });
    }
  });
};

export { useSlots, useCreateSlot, useAddHoliday, useDeleteHoliday };