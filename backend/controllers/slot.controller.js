import { SlotConfig } from '../models/SlotConfig.js';
import { Holiday } from '../models/Holiday.js';

export async function getSlots(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const configs = await SlotConfig.find({ ownerId }).lean();
    return res.json({ success: true, data: configs });
  } catch (err) { next(err); }
}

export async function upsertSlot(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { dayOfWeek, startTime, endTime, durationMinutes, isActive } = req.body;
    const existing = await SlotConfig.findOne({ ownerId, dayOfWeek });
    if (existing) {
      existing.startTime = startTime;
      existing.endTime = endTime;
      existing.durationMinutes = durationMinutes;
      existing.isActive = isActive ?? true;
      await existing.save();
      return res.json({ success: true, data: existing });
    }
    const created = new SlotConfig({ ownerId, dayOfWeek, startTime, endTime, durationMinutes, isActive: isActive ?? true });
    await created.save();
    return res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
}

export async function addHoliday(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { date, reason } = req.body;
    const h = new Holiday({ ownerId, date: new Date(date), reason });
    await h.save();
    return res.status(201).json({ success: true, data: h });
  } catch (err) { next(err); }
}

export async function removeHoliday(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { id } = req.params;
    const found = await Holiday.findOneAndDelete({ _id: id, ownerId });
    if (!found) return res.status(404).json({ success: false, message: 'Holiday not found' });
    return res.json({ success: true, data: found });
  } catch (err) { next(err); }
}

export async function getHolidays(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const holidays = await Holiday.find({ ownerId }).lean();
    return res.json({ success: true, data: holidays });
  } catch (err) { next(err); }
}
