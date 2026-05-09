import 'dotenv/config';
import { sendBookingConfirmation, sendReminder } from '../services/notifyService.js';
import { logger } from '../services/logger.js';

// Enable test mode to avoid real sends
process.env.NOTIFY_TEST_MODE = '1';

async function run() {
  logger.info('Starting notifyService smoke test (TEST MODE)');
  const dummyBooking = {
    _id: 'test-booking-1',
    ownerId: 'owner-test-1',
    slotConfigId: 'slot-test-1',
    customerName: 'Test User',
    customerPhone: '+1234567890',
    customerEmail: 'test@example.com',
    bookingDate: new Date().toISOString(),
    startTime: '10:00',
    endTime: '10:30',
    reminderMessage: 'This is a test reminder'
  };

  try {
    await sendBookingConfirmation(dummyBooking, process.env.EMAIL_USER || 'owner@example.com');
    logger.info('sendBookingConfirmation completed (TEST MODE)');
  } catch (err) {
    logger.error('sendBookingConfirmation error', String(err));
  }

  try {
    await sendReminder(dummyBooking);
    logger.info('sendReminder completed (TEST MODE)');
  } catch (err) {
    logger.error('sendReminder error', String(err));
  }

  logger.info('notifyService smoke test finished');
}

run().catch((e) => {
  logger.error('Smoke test unexpected error', String(e));
  process.exit(1);
});
