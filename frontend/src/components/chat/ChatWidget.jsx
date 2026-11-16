import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';
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
    const msg = message;
    setMessage('');
    await sendMessage(msg);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-atelier-900 text-white shadow-card hover:bg-atelier-800 hover:scale-105 active:scale-95 transition-all duration-200 dark:bg-white dark:text-atelier-900"
        aria-label="Open Studio Concierge"
      >
        <MessageSquare className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white shadow-sm">
            {unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-22 right-6 z-40 w-[min(92vw,400px)]"
          >
            <Card className="overflow-hidden border border-atelier-200 bg-white p-0 shadow-card-hover dark:border-atelier-800 dark:bg-atelier-900">
              {/* Concierge Header */}
              <div className="flex items-center justify-between border-b border-atelier-200 bg-atelier-50/70 px-4 py-3.5 dark:border-atelier-800 dark:bg-atelier-850">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-atelier-900 dark:text-atelier-100">Studio Concierge</h4>
                    <p className="text-[11px] text-atelier-500 dark:text-atelier-400">Available to help you book</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full text-atelier-500 hover:bg-atelier-200/50 dark:hover:bg-atelier-700"
                  onClick={() => setOpen(false)}
                  aria-label="Close concierge"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages feed */}
              <div ref={scrollRef} className="max-h-[380px] min-h-[220px] space-y-3 overflow-y-auto px-4 py-4 bg-atelier-50/20 dark:bg-transparent">
                {messages.map((entry) => (
                  <ChatBubble key={entry.id} message={entry} />
                ))}
                {isTyping ? <ChatBubble isTyping /> : null}
              </div>

              {/* Input Area */}
              <div className="border-t border-atelier-200 bg-white p-3 dark:border-atelier-800 dark:bg-atelier-900">
                <ChatInput
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onSend={handleSend}
                  disabled={isTyping}
                />
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export { ChatWidget };
