import { useCallback, useMemo, useState } from 'react';
import { sendPublicChatMessage } from '../api/public.api.js';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi! I'm your AI assistant. Ask a question or describe what you need, and I’ll answer as a customer assistant.`,
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

    const nextMessages = [...messages, { id: crypto.randomUUID(), role: 'user', content: trimmed, timestamp: new Date().toISOString() }];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const response = await sendPublicChatMessage({ ownerId, message: trimmed, role: 'customer', conversationHistory: nextMessages.map(({ role, content }) => ({ role, content })) });
      const data = response?.data || response;
      const reply = data?.reply || 'I could not understand that request.';
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: reply, timestamp: new Date().toISOString() }]);
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