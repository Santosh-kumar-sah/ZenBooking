import { groqClient, GROQ_MODEL } from './groqClient.js';
import { BIO_GENERATION_PROMPT, CUSTOMER_CHAT_PROMPT, OWNER_CHAT_PROMPT } from './prompts.js';

// Tool definition for Groq function calling
const BOOK_APPOINTMENT_TOOL = {
  type: 'function',
  function: {
    name: 'book_appointment',
    description: 'Books an appointment for a customer when all required details have been collected.',
    parameters: {
      type: 'object',
      properties: {
        customerName: { type: 'string', description: 'Full name of the customer' },
        customerEmail: { type: 'string', description: 'Email address of the customer (optional if phone is provided)' },
        customerPhone: { type: 'string', description: 'Phone number of the customer (optional if email is provided)' },
        date: { type: 'string', description: 'Booking date in YYYY-MM-DD format' },
        timePreference: { type: 'string', description: 'Preferred time as HH:MM (24h) or a period like morning/afternoon/evening' },
        intent: { type: 'string', description: 'Short description of what the customer wants, e.g. haircut, consultation' }
      },
      required: ['customerName', 'date', 'timePreference']
    }
  }
};

/**
 * Generate a chat reply for either a customer or owner.
 * For customer role, supports Groq tool calling so the AI can book appointments.
 *
 * Returns { reply: string, toolCall: object|null }
 */
export async function generateChatReply({ message, role = 'customer', history = [], context = {} }) {
  const systemPrompt = role === 'owner' ? OWNER_CHAT_PROMPT : CUSTOMER_CHAT_PROMPT;

  const messages = [
    { role: 'system', content: `${systemPrompt}\n\nBusiness context: ${JSON.stringify(context)}` },
    ...history
      .filter((entry) => entry && entry.role && entry.content)
      .slice(-14)
      .map((entry) => ({ role: entry.role === 'assistant' ? 'assistant' : 'user', content: String(entry.content) })),
    { role: 'user', content: message }
  ];

  const requestOptions = {
    model: GROQ_MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.5
  };

  // Only add tool calling for customer role
  if (role === 'customer') {
    requestOptions.tools = [BOOK_APPOINTMENT_TOOL];
    requestOptions.tool_choice = 'auto';
  }

  const resp = await groqClient.chat.completions.create(requestOptions);
  const choice = resp?.choices?.[0];

  // Check if the model wants to call a tool
  if (choice?.finish_reason === 'tool_calls' && choice?.message?.tool_calls?.length > 0) {
    const toolCall = choice.message.tool_calls[0];
    if (toolCall.function.name === 'book_appointment') {
      let args = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = {};
      }
      return { reply: null, toolCall: { name: 'book_appointment', args } };
    }
  }

  const reply = choice?.message?.content || 'I could not process that request. Please try again.';
  return { reply, toolCall: null };
}

/**
 * Generate a business bio using AI.
 */
export async function generateBusinessBio(businessName, businessType) {
  const prompt = `${BIO_GENERATION_PROMPT}\nBusiness name: ${businessName}\nBusiness type: ${businessType}`;
  const resp = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.3
  });
  return resp?.choices?.[0]?.message?.content?.trim() || '';
}
