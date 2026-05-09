import { groqClient, GROQ_MODEL } from './groqClient.js';
import { INSIGHTS_SYSTEM_PROMPT } from './prompts.js';

/**
 * generateInsights: ask Claude to return plain-English insights given bookingStats
 * @param {Object} bookingStats - aggregated stats
 * @returns {Promise<string>} insights text
 */
export async function generateInsights(bookingStats) {
  const prompt = `${INSIGHTS_SYSTEM_PROMPT}\nStats: ${JSON.stringify(bookingStats)}`;
  const resp = await groqClient.chat.completions.create({ model: GROQ_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 400, temperature: 0 });
  return resp?.choices?.[0]?.message?.content || '';
}
