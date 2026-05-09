import express from 'express';
import { chat, insights, regenerateReminder, publicChat } from '../controllers/ai.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Owner-only routes (require JWT)
router.post('/chat', verifyToken, chat);
router.get('/insights', verifyToken, insights);
router.post('/reminder/:bookingId', verifyToken, regenerateReminder);

// Public customer chat (no auth required)
router.post('/public/:ownerId/chat', publicChat);

export default router;
