import { useCallback, useMemo, useState } from 'react';
import { sendPublicChatMessage } from '../api/public.api.js';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome! I am your studio concierge. You can ask about our availability or simply tell me when you'd like to book (e.g., "I'd like an appointment this Friday afternoon").`,
  timestamp: new Date().toISOString()
};

const useChat = (ownerId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const conversationHistory = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const response = await sendPublicChatMessage({
        ownerId,
        message: trimmed,
        role: 'customer',
        conversationHistory: nextMessages.map(({ role, content }) => ({ role, content }))
      });
      const data = response?.data || response;
      const reply = data?.reply || 'I could not process that request. Please try again.';
      const bookingCreated = data?.bookingCreated || null;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          bookingCreated,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, I ran into an issue connecting to the studio. Please pick a slot directly from the calendar or try again in a moment.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, ownerId]);

  return {
    messages: messages.length ? messages : [welcomeMessage],
    isTyping,
    sendMessage,
    conversationHistory
  };
};

export { useChat };
