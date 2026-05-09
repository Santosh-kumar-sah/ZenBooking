import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const OwnerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessDescription: { type: String },
  phone: { type: String },
  photo: { type: String },
  timezone: { type: String }
}, { timestamps: true });

OwnerSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

export const Owner = model('Owner', OwnerSchema);
