import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card } from '../ui/index.js';
import { formatTime } from '../../utils/dateUtils.js';

const normalizeSlot = (slot) => (typeof slot === 'string' ? { startTime: slot, endTime: slot, slotConfigId: slot } : slot);

const SlotPicker = ({ slots = [], selectedSlot, onSlotSelect }) => (
  <Card className="border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {slots.map((slot) => {
        const normalized = normalizeSlot(slot);
        const value = normalized.slotConfigId || normalized.startTime;
        const selected = selectedSlot === value;
        return (
          <motion.button
            key={`${value}-${normalized.endTime || ''}`}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onSlotSelect?.(normalized)}
            className={[
              'flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition-all duration-300',
              selected ? 'border-transparent bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'border-2 border-slate-200 bg-white text-slate-800 font-medium hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-primary-500 dark:hover:bg-primary-500/20 dark:hover:text-white'
            ].join(' ')}
          >
            {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
            <span>{formatTime(normalized.startTime)}</span>
          </motion.button>
        );
      })}
    </div>
  </Card>
);

export { SlotPicker };