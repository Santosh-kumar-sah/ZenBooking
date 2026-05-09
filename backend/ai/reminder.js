import { groqClient, GROQ_MODEL } from './groqClient.js';
import { REMINDER_SYSTEM_PROMPT } from './prompts.js';

/**
 * generateReminder: generate a 2-sentence reminder for a booking
 * @param {Object} booking
 * @param {String} businessName
 * @returns {Promise<string>} reminder text
 */
export async function generateReminder(booking, businessName) {
  const prompt = `${REMINDER_SYSTEM_PROMPT}\nCustomer: ${booking.customerName}\nBusiness: ${businessName}\nDate: ${new Date(booking.bookingDate).toDateString()}\nTime: ${booking.startTime}`;
  const resp = await groqClient.chat.completions.create({ model: GROQ_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 120, temperature: 0 });
  return resp?.choices?.[0]?.message?.content || '';
}
