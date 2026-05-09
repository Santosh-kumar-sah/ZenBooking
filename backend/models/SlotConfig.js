import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const SlotConfigSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'Owner', required: true },
  dayOfWeek: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export const SlotConfig = model('SlotConfig', SlotConfigSchema);
