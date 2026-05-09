import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const HolidaySchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'Owner', required: true },
  date: { type: Date, required: true },
  reason: { type: String }
});

export const Holiday = model('Holiday', HolidaySchema);
