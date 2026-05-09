import { Booking } from '../models/Booking.js';
import mongoose from 'mongoose';

/**
 * Create a booking atomically using findOneAndUpdate upsert
 * @param {Object} params - booking params
 * @returns {Promise<Booking>} created booking
 */
export async function createBooking({ ownerId, slotConfigId, bookingDate, startTime, endTime, customerName, customerPhone, customerEmail }) {
  const filter = { ownerId: new mongoose.Types.ObjectId(ownerId), bookingDate: new Date(bookingDate), startTime };
  const insertDoc = {
    ownerId: new mongoose.Types.ObjectId(ownerId),
    slotConfigId: new mongoose.Types.ObjectId(slotConfigId),
    customerName,
    customerPhone,
    customerEmail,
    bookingDate: new Date(bookingDate),
    startTime,
    endTime,
    status: 'confirmed',
    reminderSent: false
  };

  const update = { $setOnInsert: insertDoc };
  const opts = { upsert: true, returnDocument: 'after' };

  // Quick conflict check (best-effort). If a booking already exists, reject.
  const existing = await Booking.findOne(filter).lean();
  if (existing) {
    const err = new Error('Slot already booked');
    err.statusCode = 409;
    throw err;
  }

  const result = await Booking.collection.findOneAndUpdate(filter, update, opts);

  // Try to resolve the created document robustly regardless of driver shape
  let created = null;
  if (result && result.value && result.value._id) {
    created = await Booking.findById(result.value._id).lean();
  } else if (result && result.lastErrorObject && result.lastErrorObject.upserted) {
    // driver may return upserted id here
    const upsertedId = result.lastErrorObject.upserted;
    try {
      created = await Booking.findById(upsertedId).lean();
    } catch (e) {
      created = null;
    }
  }

  // fallback: try to find by the filter (ownerId, bookingDate, startTime)
  if (!created) {
    created = await Booking.findOne(filter).lean();
  }

  if (!created) {
    const err = new Error('Failed to create booking');
    err.statusCode = 500;
    throw err;
  }

  return created;
}
