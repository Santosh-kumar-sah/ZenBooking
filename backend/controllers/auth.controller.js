import { Owner } from '../models/Owner.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateBusinessBio } from '../ai/chatbot.js';

function signAccess(owner) {
  return jwt.sign({ id: owner._id.toString(), email: owner.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function signRefresh(owner) {
  return jwt.sign({ id: owner._id.toString(), email: owner.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, businessName, businessType, phone, timezone } = req.body;
    const existing = await Owner.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // AI-generated business description
    let businessDescription = '';
    try {
      businessDescription = await generateBusinessBio(businessName, businessType);
    } catch (aiErr) {
      console.error('register: bio generation failed (non-fatal)', aiErr?.message);
    }


    const owner = new Owner({ name, email, passwordHash: password, businessName, businessType, businessDescription, phone, timezone });
    await owner.save();

    const accessToken = signAccess(owner);
    const refreshToken = signRefresh(owner);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    return res.status(201).json({ success: true, accessToken });
  } catch (err) {
    console.error('Registration error:', err.message, err.stack);
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, owner.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const accessToken = signAccess(owner);
    const refreshToken = signRefresh(owner);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({ success: true, accessToken });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const owner = await Owner.findById(payload.id);
    if (!owner) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const accessToken = signAccess(owner);
    return res.json({ success: true, data: { accessToken } });
  } catch (err) { next(err); }
}

export async function getMe(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const owner = await Owner.findById(ownerId).select('-passwordHash').lean();
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
    return res.json({ success: true, data: owner });
  } catch (err) { next(err); }
}

export async function updateMe(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { name, email, phone, timezone, businessName, businessType, businessDescription, password } = req.body;
    const updates = { name, email, phone, timezone, businessName, businessType, businessDescription };
    if (password) updates.passwordHash = password;
    const updated = await Owner.findByIdAndUpdate(ownerId, updates, { new: true }).select('-passwordHash').lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Owner not found' });
    return res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}
