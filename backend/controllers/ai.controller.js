import { generateChatReply } from '../ai/chatbot.js';
import { generateInsights } from '../ai/insights.js';
import { generateReminder } from '../ai/reminder.js';
import { Booking } from '../models/Booking.js';
import { Owner } from '../models/Owner.js';
import { getAvailableSlots } from '../services/slotService.js';
import { createBooking } from '../services/bookingService.js';
import { sendBookingConfirmation } from '../services/notifyService.js';

// ─── Owner Chat (protected) ────────────────────────────────────────────────
export async function chat(req, res, next) {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const ownerId = req.owner.id;
    const owner = await Owner.findById(ownerId).lean();

    const context = {
      role: 'owner',
      ownerId: String(owner?._id || ''),
      businessName: owner?.businessName || '',
      businessType: owner?.businessType || '',
      timezone: owner?.timezone || 'UTC'
    };

    const { reply } = await generateChatReply({
      message,
      role: 'owner',
      history: conversationHistory,
      context
    });

    return res.json({ success: true, data: { reply, role: 'owner' } });
  } catch (err) {
    next(err);
  }
}

// ─── Public Customer Chat (unauthenticated) ────────────────────────────────
export async function publicChat(req, res, next) {
  try {
    const ownerId = req.params.ownerId || req.body.ownerId;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'ownerId is required' });
    }

    const { message, conversationHistory = [] } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const owner = await Owner.findById(ownerId).lean();
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Build available slots context for today + next 14 days
    let slotsContext = [];
    try {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + 13);
      const slots = await getAvailableSlots(ownerId, from, to);
      // Summarise so it fits in the context window
      const dateMap = {};
      for (const s of slots) {
        const key = new Date(s.date).toDateString();
        if (!dateMap[key]) dateMap[key] = [];
        dateMap[key].push(s.startTime);
      }
      slotsContext = Object.entries(dateMap).slice(0, 10).map(([date, times]) => ({
        date,
        times: times.slice(0, 8)
      }));
    } catch {
      // non-fatal
    }

    const context = {
      role: 'customer',
      businessName: owner.businessName,
      businessType: owner.businessType,
      businessDescription: owner.businessDescription || '',
      availableSlots: slotsContext,
      todayDate: new Date().toDateString()
    };

    const { reply, toolCall } = await generateChatReply({
      message,
      role: 'customer',
      history: conversationHistory,
      context
    });

    // ── AI wants to book an appointment ──────────────────────────────────
    if (toolCall && toolCall.name === 'book_appointment') {
      const args = toolCall.args || {};

      // Validate that we have at minimum: name + date + (email or phone)
      if (!args.customerName || !args.date) {
        return res.json({
          success: true,
          data: {
            reply: "I still need a few more details to complete your booking. Could you please share your full name and preferred date?",
            role: 'customer'
          }
        });
      }
      if (!args.customerEmail && !args.customerPhone) {
        return res.json({
          success: true,
          data: {
            reply: "Almost there! I just need your email address or phone number so we can send your confirmation.",
            role: 'customer'
          }
        });
      }

      // Find the best matching available slot
      try {
        const requestedDate = new Date(args.date);
        if (isNaN(requestedDate.getTime())) {
          throw new Error('invalid date');
        }

        const nextDay = new Date(requestedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const daySlots = await getAvailableSlots(ownerId, requestedDate, nextDay);

        if (!daySlots.length) {
          return res.json({
            success: true,
            data: {
              reply: `Sorry, there are no available slots on ${requestedDate.toDateString()}. Would you like to pick another date? Here are some available days: ${slotsContext.slice(0, 3).map(s => s.date).join(', ')}.`,
              role: 'customer'
            }
          });
        }

        // Pick best time match
        let chosenSlot = daySlots[0];
        if (args.timePreference) {
          const pref = String(args.timePreference).toLowerCase();
          let targetHour = null;

          if (pref.includes('morning')) targetHour = 9;
          else if (pref.includes('afternoon')) targetHour = 13;
          else if (pref.includes('evening')) targetHour = 17;
          else {
            const match = pref.match(/(\d{1,2})/);
            if (match) targetHour = parseInt(match[1], 10);
          }

          if (targetHour !== null) {
            const closest = daySlots.reduce((best, slot) => {
              const slotHour = parseInt(slot.startTime.split(':')[0], 10);
              const bestHour = parseInt(best.startTime.split(':')[0], 10);
              return Math.abs(slotHour - targetHour) < Math.abs(bestHour - targetHour) ? slot : best;
            }, daySlots[0]);
            chosenSlot = closest;
          }
        }

        // Create the booking
        const booking = await createBooking({
          ownerId,
          slotConfigId: chosenSlot.slotConfigId,
          bookingDate: chosenSlot.date,
          startTime: chosenSlot.startTime,
          endTime: chosenSlot.endTime,
          customerName: args.customerName,
          customerPhone: args.customerPhone || '',
          customerEmail: args.customerEmail || ''
        });

        // Generate AI reminder and save
        let reminder = '';
        try {
          reminder = await generateReminder(booking, owner.businessName);
          await Booking.findByIdAndUpdate(booking._id, { reminderMessage: reminder });
          booking.reminderMessage = reminder;
        } catch { /* non-fatal */ }

        // Send email notifications
        sendBookingConfirmation(booking, owner.email, owner.businessName).catch(() => {});

        const confirmMsg = `Your appointment is confirmed! 🎉\n\n📅 **Date:** ${new Date(chosenSlot.date).toDateString()}\n⏰ **Time:** ${chosenSlot.startTime} – ${chosenSlot.endTime}\n🏢 **Business:** ${owner.businessName}\n\nYou'll receive a confirmation${args.customerEmail ? ' to ' + args.customerEmail : ''}. See you soon, ${args.customerName}!`;

        return res.json({
          success: true,
          data: {
            reply: confirmMsg,
            role: 'customer',
            bookingCreated: {
              bookingId: booking._id,
              customerName: booking.customerName,
              businessName: owner.businessName,
              bookingDate: booking.bookingDate,
              startTime: booking.startTime,
              endTime: booking.endTime
            }
          }
        });
      } catch (bookingErr) {
        if (bookingErr.statusCode === 409) {
          return res.json({
            success: true,
            data: {
              reply: `That slot is already taken! Let me suggest another time. Would you like me to book you at a different time on ${new Date(args.date).toDateString()}?`,
              role: 'customer'
            }
          });
        }
        console.error('publicChat: booking failed', bookingErr?.message);
        return res.json({
          success: true,
          data: {
            reply: "I ran into an issue completing your booking. Please try using the booking form on this page, or try again in a moment.",
            role: 'customer'
          }
        });
      }
    }

    return res.json({ success: true, data: { reply, role: 'customer' } });
  } catch (err) {
    next(err);
  }
}

// ─── AI Insights (owner protected) ────────────────────────────────────────
export async function insights(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const since = new Date();
    since.setDate(since.getDate() - 90);

    const bookings = await Booking.find({ ownerId, createdAt: { $gte: since } }).lean();

    // Build richer stats for better insights
    const byStatus = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const byDay = bookings.reduce((acc, b) => {
      const day = new Date(b.bookingDate).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const byHour = bookings.reduce((acc, b) => {
      const hour = b.startTime ? parseInt(b.startTime.split(':')[0], 10) : 0;
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalBookings: bookings.length,
      periodDays: 90,
      byStatus,
      byDayOfWeek: byDay,
      byHour,
      cancellationRate: bookings.length
        ? `${((byStatus.cancelled || 0) / bookings.length * 100).toFixed(1)}%`
        : '0%'
    };

    const text = await generateInsights(stats);
    return res.json({ success: true, data: text });
  } catch (err) {
    next(err);
  }
}

// ─── Regenerate Reminder (owner protected) ─────────────────────────────────
export async function regenerateReminder(req, res, next) {
  try {
    const ownerId = req.owner.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId, ownerId }).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const owner = await Owner.findById(ownerId).lean();
    const reminder = await generateReminder(booking, owner?.businessName || 'Your Business');
    await Booking.findByIdAndUpdate(bookingId, { reminderMessage: reminder });

    return res.json({ success: true, data: reminder });
  } catch (err) {
    next(err);
  }
}
