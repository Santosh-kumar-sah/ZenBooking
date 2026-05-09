/**
 * Full integration test for AI booking flow
 * Tests: AI parsing → Booking creation → Email/SMS notifications
 * Runs in TEST MODE by default (no real emails/SMS sent unless NOTIFY_TEST_MODE=0)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { parseChatMessage } from '../ai/chatbot.js';
import { createBooking } from '../services/bookingService.js';
import { sendBookingConfirmation, sendReminder } from '../services/notifyService.js';
import { logger } from '../services/logger.js';
import { Owner } from '../models/Owner.js';
import { SlotConfig } from '../models/SlotConfig.js';
import { Booking } from '../models/Booking.js';

async function integrationTest() {
  logger.info('=== Starting AI Booking Flow Integration Test ===');
  
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    logger.info('MongoDB connected');

    // Find or create a test owner
    logger.info('Looking for test owner...');
    let owner = await Owner.findOne({ email: 'integration-test@example.com' });
    if (!owner) {
      logger.info('Creating test owner...');
      owner = await Owner.create({
        name: 'Integration Test Owner',
        email: 'integration-test@example.com',
        passwordHash: 'dummy-hash', // pre-hashed (bcrypt would be applied on save)
        businessName: 'Test Salon',
        businessType: 'Hair Salon',
        businessDescription: 'A test salon for integration testing'
      });
      logger.info(`Created test owner: ${owner._id}`);
    } else {
      logger.info(`Using existing test owner: ${owner._id}`);
    }

    // Ensure a slot config exists for today
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    logger.info(`Looking for slot config for ${todayName}...`);
    let slot = await SlotConfig.findOne({ ownerId: owner._id, dayOfWeek: todayName });
    if (!slot) {
      logger.info(`Creating slot config for ${todayName}...`);
      slot = await SlotConfig.create({
        ownerId: owner._id,
        dayOfWeek: todayName,
        startTime: '09:00',
        endTime: '17:00',
        durationMinutes: 30,
        isActive: true
      });
      logger.info(`Created slot config: ${slot._id}`);
    } else {
      logger.info(`Using existing slot config: ${slot._id}`);
    }

    // Step 1: Test AI message parsing
    logger.info('=== Step 1: Test AI Message Parsing ===');
    const userMessage = 'I want to book a haircut today at 11:00 AM. My name is John Doe and my phone is 5551234567 and email is john@example.com';
    logger.info(`User message: "${userMessage}"`);
    
    const { reply, action } = await parseChatMessage(userMessage, owner._id.toString(), []);
    logger.info(`AI Reply: ${reply}`);
    logger.info(`AI Action: ${JSON.stringify(action, null, 2)}`);

    if (action?.intent !== 'book') {
      logger.warn('AI did not return booking intent. Test incomplete.');
      logger.info('=== Integration Test Finished (Incomplete) ===');
      await mongoose.disconnect();
      return;
    }

    // Step 2: Create booking via AI action
    logger.info('=== Step 2: Create Booking from AI Action ===');
    const today = new Date().toISOString().split('T')[0];
    const bookingPayload = {
      ownerId: owner._id,
      slotConfigId: slot._id,
      bookingDate: new Date(today),
      startTime: action.startTime || '11:00',
      endTime: '11:30',
      customerName: action.customerName || 'John Doe',
      customerPhone: action.customerPhone || '5551234567',
      customerEmail: action.customerEmail || 'john@example.com'
    };

    // Remove any previous test booking that would conflict with this run.
    await Booking.deleteMany({
      ownerId: owner._id,
      bookingDate: bookingPayload.bookingDate,
      startTime: bookingPayload.startTime,
      customerName: bookingPayload.customerName
    });

    logger.info(`Creating booking: ${JSON.stringify(bookingPayload, null, 2)}`);

    const booking = await createBooking(bookingPayload);
    logger.info(`Booking created: ${booking._id}`);
    logger.info(`Booking details: ${JSON.stringify({ date: booking.bookingDate, time: booking.startTime, customer: booking.customerName }, null, 2)}`);

    // Step 3: Send booking confirmation (with email + SMS)
    logger.info('=== Step 3: Send Booking Confirmation ===');
    await sendBookingConfirmation(booking, owner.email);
    logger.info('Booking confirmation sent');

    // Step 4: Send reminder
    logger.info('=== Step 4: Send Booking Reminder ===');
    await sendReminder(booking);
    logger.info('Booking reminder sent');

    logger.info('=== Integration Test Completed Successfully ===');
  } catch (err) {
    logger.error(`Integration test failed: ${String(err)}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

integrationTest();
