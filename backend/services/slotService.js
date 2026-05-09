import { SlotConfig } from '../models/SlotConfig.js';
import { Holiday } from '../models/Holiday.js';
import { Booking } from '../models/Booking.js';
import mongoose from 'mongoose';

function timeToMinutes(t) {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + mm;
}

function minutesToTime(min) {
  const hh = Math.floor(min / 60).toString().padStart(2, '0');
  const mm = (min % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Generate available slots for owner between dates (inclusive)
 * @returns {Promise<Array<{date:string,startTime:string,endTime:string,slotConfigId:string}>>}
 */
export async function getAvailableSlots(ownerId, fromDate, toDate) {
  const slotConfigs = await SlotConfig.find({ ownerId, isActive: true }).lean();
  const holidays = await Holiday.find({ ownerId, date: { $gte: fromDate, $lte: toDate } }).lean();
  const holidaysSet = new Set(holidays.map(h => new Date(h.date).toDateString()));

  const bookings = await Booking.find({ ownerId, bookingDate: { $gte: fromDate, $lte: toDate }, status: 'confirmed' }).lean();
  const bookedSet = new Set(bookings.map(b => `${new Date(b.bookingDate).toDateString()}|${b.startTime}`));

  const days = [];
  for (let dt = new Date(fromDate); dt <= toDate; dt.setDate(dt.getDate() + 1)) {
    days.push(new Date(dt));
  }

  const dayNameMap = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const result = [];
  for (const day of days) {
    const dateStr = day.toDateString();
    if (holidaysSet.has(dateStr)) continue;
    const dow = dayNameMap[day.getDay()];
    for (const cfg of slotConfigs) {
      if (cfg.dayOfWeek !== dow) continue;
      const startMin = timeToMinutes(cfg.startTime);
      const endMin = timeToMinutes(cfg.endTime);
      for (let m = startMin; m + cfg.durationMinutes <= endMin; m += cfg.durationMinutes) {
        const s = minutesToTime(m);
        const e = minutesToTime(m + cfg.durationMinutes);
        if (bookedSet.has(`${dateStr}|${s}`)) continue;
        // exclude past times for today
        const now = new Date();
        const slotDateTime = new Date(day);
        const [hh, mm] = s.split(':').map(Number);
        slotDateTime.setHours(hh, mm, 0, 0);
        if (slotDateTime < now) continue;
        result.push({ date: new Date(day), startTime: s, endTime: e, slotConfigId: cfg._id.toString() });
      }
    }
  }
  return result;
}
