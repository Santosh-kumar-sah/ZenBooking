import nodemailer from 'nodemailer';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendWithRetry(mailOptions, attempts = 3) {
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      logger.info(`notifyService: sending email to ${mailOptions.to} (attempt ${i + 1}/${attempts})`);
      if (process.env.NOTIFY_TEST_MODE === '1') {
        logger.info(`notifyService: TEST MODE – skipping real send to ${mailOptions.to}`);
        return { messageId: 'test-mode' };
      }
      const info = await transporter.sendMail(mailOptions);
      logger.info(`notifyService: sent to ${mailOptions.to} – messageId=${info?.messageId || 'unknown'}`);
      return info;
    } catch (err) {
      lastErr = err;
      const backoff = 1000 * Math.pow(2, i);
      logger.error(`notifyService: attempt ${i + 1} failed for ${mailOptions.to} – ${String(err)}. Retrying in ${backoff}ms`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
  logger.error(`notifyService: all ${attempts} attempts failed for ${mailOptions.to}`);
  throw lastErr;
}

function buildCustomerHTML(booking, businessName) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020617;font-family:Inter,system-ui,sans-serif;color:#e2e8f0;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;margin-bottom:16px;font-size:24px;font-weight:900;color:#fff;">BA</div>
      <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;">Booking Confirmed! ✅</h1>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">${businessName}</p>
    </div>
    <div style="background:#0f172a;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.08);border-top:none;padding:32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#cbd5e1;">Hi <strong style="color:#fff;">${booking.customerName}</strong>, your appointment is confirmed. Here are your details:</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;width:40%;">Business</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${businessName}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;">Date</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${new Date(booking.bookingDate).toDateString()}</td></tr>
        <tr><td style="padding:12px 0;color:#94a3b8;font-size:13px;">Time</td><td style="padding:12px 0;color:#f1f5f9;font-size:13px;font-weight:600;">${booking.startTime} – ${booking.endTime}</td></tr>
      </table>
      ${booking.reminderMessage ? `<div style="margin-top:24px;padding:16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:12px;font-size:13px;color:#cbd5e1;line-height:1.6;">${booking.reminderMessage}</div>` : ''}
      <p style="margin:24px 0 0;font-size:12px;color:#475569;">You'll receive a reminder 1 hour before your appointment. See you soon!</p>
    </div>
  </div>
</body>
</html>`;
}

function buildOwnerHTML(booking, businessName) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020617;font-family:Inter,system-ui,sans-serif;color:#e2e8f0;">
  <div style="max-width:560px;margin:40px auto;padding:0 16px;">
    <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;margin-bottom:16px;font-size:24px;font-weight:900;color:#fff;">BA</div>
      <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;">New Booking Alert 🔔</h1>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">${businessName}</p>
    </div>
    <div style="background:#0f172a;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.08);border-top:none;padding:32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#cbd5e1;">A new appointment has been booked through BookAI:</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;width:40%;">Customer</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${booking.customerName}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;">Phone</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${booking.customerPhone || '—'}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;">Email</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${booking.customerEmail || '—'}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#94a3b8;font-size:13px;">Date</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f1f5f9;font-size:13px;font-weight:600;">${new Date(booking.bookingDate).toDateString()}</td></tr>
        <tr><td style="padding:12px 0;color:#94a3b8;font-size:13px;">Time</td><td style="padding:12px 0;color:#f1f5f9;font-size:13px;font-weight:600;">${booking.startTime} – ${booking.endTime}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#475569;">Log in to your BookAI dashboard to manage this booking.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send booking confirmation emails to customer and owner
 * @param {Object} booking
 * @param {String} ownerEmail
 * @param {String} businessName
 */
export async function sendBookingConfirmation(booking, ownerEmail, businessName = 'Your Business') {
  const retries = Number(process.env.EMAIL_RETRY_ATTEMPTS) || 3;

  if (booking.customerEmail) {
    const customerMail = {
      from: `"${businessName} via BookAI" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: `Booking Confirmed – ${businessName} on ${new Date(booking.bookingDate).toDateString()}`,
      text: `Hi ${booking.customerName}, your booking at ${businessName} on ${new Date(booking.bookingDate).toDateString()} at ${booking.startTime} is confirmed. ${booking.reminderMessage || ''}`,
      html: buildCustomerHTML(booking, businessName)
    };
    try {
      await sendWithRetry(customerMail, retries);
    } catch (err) {
      logger.error('notifyService: customer email failed', String(err));
    }
  } else {
    logger.info('notifyService: no customer email – skipping customer confirmation');
  }

  const ownerMail = {
    from: `"BookAI Notifications" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Booking – ${booking.customerName} on ${new Date(booking.bookingDate).toDateString()}`,
    text: `New booking for ${booking.customerName} (${booking.customerPhone || booking.customerEmail}) on ${new Date(booking.bookingDate).toDateString()} at ${booking.startTime}.`,
    html: buildOwnerHTML(booking, businessName)
  };
  try {
    await sendWithRetry(ownerMail, retries);
  } catch (err) {
    logger.error('notifyService: owner email failed', String(err));
  }

  if (booking.customerPhone) {
    await sendSMS(booking.customerPhone, booking.reminderMessage || `Your booking at ${businessName} on ${new Date(booking.bookingDate).toDateString()} at ${booking.startTime} is confirmed.`).catch((err) => {
      logger.info(`notifyService: SMS skipped – ${String(err)}`);
    });
  }
}

/**
 * Send reminder email + SMS for an upcoming booking
 * @param {Object} booking
 * @param {String} businessName
 */
export async function sendReminder(booking, businessName = 'Your Business') {
  const retries = Number(process.env.EMAIL_RETRY_ATTEMPTS) || 3;

  if (booking.customerEmail) {
    const mail = {
      from: `"${businessName} via BookAI" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: `Reminder: Your appointment at ${businessName} today at ${booking.startTime}`,
      text: booking.reminderMessage || `Reminder: You have a booking at ${businessName} today at ${booking.startTime}.`,
      html: `<div style="font-family:Inter,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;border-radius:12px;max-width:480px;margin:auto;"><h2 style="color:#0ea5e9;">⏰ Appointment Reminder</h2><p>Hi <strong>${booking.customerName}</strong>,</p><p>${booking.reminderMessage || `Just a reminder that you have an appointment at <strong>${businessName}</strong> today at <strong>${booking.startTime}</strong>.`}</p><p style="color:#64748b;font-size:12px;">See you soon!</p></div>`
    };
    try {
      await sendWithRetry(mail, retries);
    } catch (err) {
      logger.error('notifyService: reminder email failed', String(err));
    }
  }

  if (booking.customerPhone) {
    await sendSMS(booking.customerPhone, booking.reminderMessage || `Reminder: Your appointment at ${businessName} is today at ${booking.startTime}.`).catch((err) => {
      logger.info(`notifyService: SMS skipped – ${String(err)}`);
    });
  }

  logger.info(`notifyService: reminder processed for booking ${booking._id}`);
}

async function sendSMS(to, text) {
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) {
    logger.info(`notifyService: Twilio not configured – would send to ${to}: ${text}`);
    return;
  }
  const twilio = await import('twilio');
  const client = twilio.default(sid, token);
  const msg = await client.messages.create({ body: text, from, to });
  logger.info(`notifyService: SMS sent to ${to} sid=${msg.sid}`);
  return msg;
}
