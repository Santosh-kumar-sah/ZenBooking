import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const BookingSchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'Owner', required: true },
  slotConfigId: { type: Types.ObjectId, ref: 'SlotConfig', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerEmail: { type: String },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['confirmed','cancelled','completed'], default: 'confirmed' },
  reminderMessage: { type: String },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt' } });

BookingSchema.index({ ownerId: 1, bookingDate: 1, startTime: 1 }, { unique: true });

export const Booking = model('Booking', BookingSchema);
