import { useMemo } from 'react';
import { Check, Sun, Sunset, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/dateUtils.js';

const normalizeSlot = (slot) => (typeof slot === 'string' ? { startTime: slot, endTime: slot, slotConfigId: slot } : slot);

const SlotPicker = ({ slots = [], selectedSlot, onSlotSelect }) => {
  const normalizedSlots = useMemo(() => slots.map(normalizeSlot), [slots]);

  const groups = useMemo(() => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    for (const slot of normalizedSlots) {
      const hour = parseInt(slot.startTime.split(':')[0], 10);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    }

    return [
      { label: 'Morning', icon: Sun, slots: morning },
      { label: 'Afternoon', icon: Sunset, slots: afternoon },
      { label: 'Evening', icon: Moon, slots: evening }
    ].filter(g => g.slots.length > 0);
  }, [normalizedSlots]);

  if (!normalizedSlots.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-atelier-500 dark:text-atelier-400">No available appointments on this date. Please pick another day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(({ label, icon: Icon, slots: groupSlots }) => (
        <div key={label} className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">
            <Icon className="h-3.5 w-3.5 text-primary-500" />
            <span>{label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {groupSlots.map((slot) => {
              const value = slot.slotConfigId || slot.startTime;
              const isSelected = selectedSlot === value || (typeof selectedSlot === 'object' && selectedSlot?.slotConfigId === value);

              return (
                <motion.button
                  key={`${value}-${slot.startTime}-${slot.endTime || ''}`}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSlotSelect?.(slot)}
                  className={[
                    'group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-200 select-none',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                      : 'border-atelier-200 bg-white text-atelier-800 hover:border-primary-300 hover:bg-atelier-50 dark:border-atelier-800 dark:bg-atelier-850 dark:text-atelier-200 dark:hover:border-primary-600'
                  ].join(' ')}
                >
                  <span className="font-semibold">{formatTime(slot.startTime)}</span>
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] text-atelier-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Available
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export { SlotPicker };
