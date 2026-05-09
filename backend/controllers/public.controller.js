import { Owner } from '../models/Owner.js';
import { getAvailableSlots } from '../services/slotService.js';
import { createBooking } from '../services/bookingService.js';
import { sendBookingConfirmation } from '../services/notifyService.js';
import { generateReminder } from '../ai/reminder.js';
import { Booking } from '../models/Booking.js';

export async function getPublicOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const owner = await Owner.findById(ownerId).select('-passwordHash').lean();
    if (!owner) return res.status(404).json({ success: false, message: 'Business not found' });

    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 13);
    const slots = await getAvailableSlots(ownerId, from, to);

    return res.json({ success: true, data: { owner, slots } });
  } catch (err) { next(err); }
}

export async function publicBook(req, res, next) {
  try {
    const { ownerId, slotConfigId, bookingDate, startTime, endTime, customerName, customerPhone, customerEmail } = req.body;

    const booking = await createBooking({ ownerId, slotConfigId, bookingDate, startTime, endTime, customerName, customerPhone, customerEmail });

    // Fetch owner for businessName and email
    const owner = await Owner.findById(ownerId).lean();
    const businessName = owner?.businessName || 'Your Business';

    // Generate AI reminder message
    let reminder = '';
    try {
      reminder = await generateReminder(booking, businessName);
      await Booking.findByIdAndUpdate(booking._id, { reminderMessage: reminder });
      booking.reminderMessage = reminder;
    } catch (aiErr) {
      console.error('publicBook: reminder generation failed (non-fatal)', aiErr?.message);
    }

    // Send email notifications (non-blocking)
    sendBookingConfirmation(booking, owner?.email, businessName).catch((err) => {
      console.error('publicBook: notification failed (non-fatal)', err?.message);
    });

    return res.status(201).json({ success: true, data: { ...booking, businessName } });
  } catch (err) { next(err); }
}
