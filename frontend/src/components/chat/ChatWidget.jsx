import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '../ui/index.js';
import { ChatBubble } from './ChatBubble.jsx';
import { ChatInput } from './ChatInput.jsx';
import { useChat } from '../../hooks/useChat.js';

const ChatWidget = ({ ownerId }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const prevCount = useRef(0);
  const scrollRef = useRef(null);

  const {
    messages,
    isTyping,
    sendMessage
  } = useChat(ownerId);

  useEffect(() => {
    if (messages.length === 1 && messages[0]?.id === 'welcome' && prevCount.current === 0) {
      prevCount.current = messages.length;
      return;
    }

    if (open) {
      setUnread(0);
    } else if (messages.length > prevCount.current) {
      setUnread((value) => value + (messages.length - prevCount.current));
    }
    prevCount.current = messages.length;
  }, [messages.length, open]);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, open]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-2xl shadow-primary-500/20"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
        {unread > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-surface-950">{unread}</span> : null}
        <span className="absolute inset-0 rounded-full border border-primary-400/40 animate-ping" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, x: 24 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 24, x: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-5 z-40 w-[min(92vw,420px)]"
          >
            <Card className="overflow-hidden border-white/10 bg-surface-900 p-0 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Bot className="h-4 w-4 text-primary-400" /> AI Assistant
                </div>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} aria-label="Close chat">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="max-h-[460px] space-y-3 overflow-y-auto px-4 py-4">
                {messages.length ? messages.map((entry) => <ChatBubble key={entry.id} message={entry} />) : <ChatBubble message={{ role: 'assistant', content: `Hi! I'm your AI assistant. Ask about the business, services, or booking steps, and I’ll help.`, timestamp: new Date().toISOString() }} />}
                {isTyping ? <ChatBubble isTyping /> : null}
              </div>

              <div className="border-t border-white/10 p-4">
                <ChatInput value={message} onChange={(event) => setMessage(event.target.value)} onSend={handleSend} disabled={isTyping} />
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export { ChatWidget };
