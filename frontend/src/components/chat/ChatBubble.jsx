import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '../../utils/cn.js';

const ChatBubble = ({ message, isTyping = false }) => {
  if (isTyping) {
    return (
      <div className="flex justify-start">
        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-white/5 dark:bg-white/10 dark:text-slate-100">
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.12 }}
                className="h-2 w-2 rounded-full bg-current"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6', isUser ? 'rounded-tr-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'rounded-tl-sm border border-slate-200 bg-slate-100 text-slate-900 dark:border-white/5 dark:bg-white/10 dark:text-slate-100')}>
        <p>{message.content}</p>
        <p className="mt-2 text-[11px] opacity-70">{format(new Date(message.timestamp), 'p')}</p>
      </div>
    </div>
  );
};

export { ChatBubble };