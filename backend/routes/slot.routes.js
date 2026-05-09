import express from 'express';
import { getSlots, upsertSlot, addHoliday, removeHoliday, getHolidays } from '../controllers/slot.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', getSlots);
router.post('/', validate([ body('dayOfWeek').notEmpty(), body('startTime').notEmpty(), body('endTime').notEmpty(), body('durationMinutes').isInt({ min: 5 }) ]), upsertSlot);
router.get('/holidays', getHolidays);
router.post('/holidays', validate([ body('date').notEmpty() ]), addHoliday);
router.delete('/holidays/:id', removeHoliday);

export default router;
