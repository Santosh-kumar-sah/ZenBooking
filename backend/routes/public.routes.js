import express from 'express';
import { getPublicOwner, publicBook } from '../controllers/public.controller.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/:ownerId', getPublicOwner);
router.post('/book', validate([
  body('ownerId').notEmpty(),
  body('slotConfigId').notEmpty(),
  body('bookingDate').notEmpty(),
  body('startTime').notEmpty(),
  body('endTime').notEmpty(),
  body('customerName').notEmpty(),
  body('customerPhone').custom((value, { req }) => Boolean(value?.trim()) || Boolean(req.body.customerEmail?.trim() || req.body.customerEmail)).withMessage('Provide a phone number or email'),
  body('customerEmail').custom((value, { req }) => {
    if (!value) return true;
    const email = String(value).trim();
    return /.+@.+\..+/.test(email);
  }).withMessage('Enter a valid email')
]), publicBook);

export default router;
