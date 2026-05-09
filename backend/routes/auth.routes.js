import express from 'express';
import { register, login, refresh, getMe, updateMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate([
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('businessName').notEmpty(),
  body('businessType').notEmpty()
] ), register);

router.post('/login', validate([ body('email').isEmail(), body('password').notEmpty() ]), login);

router.post('/refresh', refresh);

router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);

export default router;
