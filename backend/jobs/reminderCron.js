import cron from 'node-cron';
import { Booking } from '../models/Booking.js';
import { Owner } from '../models/Owner.js';
import { sendReminder } from '../services/notifyService.js';

export function startReminderJob() {
  // Runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

      const bookings = await Booking.find({
        reminderSent: false,
        status: 'confirmed',
        bookingDate: { $gte: now, $lte: nextHour }
      }).lean();

      for (const booking of bookings) {
        try {
          const owner = await Owner.findById(booking.ownerId).lean();
          const businessName = owner?.businessName || 'Your Business';
          await sendReminder(booking, businessName);
          await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });
        } catch (err) {
          console.error('reminderCron: failed for booking', booking._id, err?.message);
        }
      }
    } catch (err) {
      console.error('reminderCron: job error', err?.message);
    }
  });
}
