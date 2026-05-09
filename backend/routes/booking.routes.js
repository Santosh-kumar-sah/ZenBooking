import express from 'express';
import { listBookings, rescheduleBooking, cancelBooking, createBookingController } from '../controllers/booking.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', listBookings);
router.post('/', validate([
	body('slotConfigId').notEmpty(),
	body('bookingDate').notEmpty(),
	body('startTime').notEmpty(),
	body('endTime').notEmpty(),
	body('customerName').notEmpty(),
	body('customerPhone').custom((value, { req }) => Boolean(value?.trim()) || Boolean(req.body.customerEmail?.trim() || req.body.customerEmail)).withMessage('Provide a phone number or email'),
	body('customerEmail').custom((value) => {
		if (!value) return true;
		return /.+@.+\..+/.test(String(value).trim());
	}).withMessage('Enter a valid email')
]), createBookingController);
router.put('/:id', validate([ body('bookingDate').notEmpty(), body('startTime').notEmpty(), body('endTime').notEmpty() ]), rescheduleBooking);
router.delete('/:id', cancelBooking);

export default router;
