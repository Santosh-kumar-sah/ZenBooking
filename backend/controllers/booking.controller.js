import { Booking } from '../models/Booking.js';
import { createBooking } from '../services/bookingService.js';

export async function listBookings(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { date, status, page = 1, limit = 20 } = req.query;
    const q = { ownerId };
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      q.bookingDate = { $gte: d, $lt: next };
    }
    if (status) q.status = status;
    const docs = await Booking.find(q).sort({ bookingDate: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean();
    return res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}

export async function rescheduleBooking(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { id } = req.params;
    const { bookingDate, startTime, endTime } = req.body;
    // conflict check
    const conflict = await Booking.findOne({ ownerId, bookingDate: new Date(bookingDate), startTime, status: 'confirmed' });
    if (conflict) return res.status(409).json({ success: false, message: 'Slot already taken' });
    const updated = await Booking.findOneAndUpdate({ _id: id, ownerId }, { bookingDate: new Date(bookingDate), startTime, endTime }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function cancelBooking(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { id } = req.params;
    const updated = await Booking.findOneAndUpdate({ _id: id, ownerId }, { status: 'cancelled' }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function createBookingController(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { slotConfigId, bookingDate, startTime, endTime, customerName, customerPhone, customerEmail } = req.body;
    const booking = await createBooking({ ownerId, slotConfigId, bookingDate, startTime, endTime, customerName, customerPhone, customerEmail });
    return res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
}
