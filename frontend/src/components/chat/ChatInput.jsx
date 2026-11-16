import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/index.js';

const ChatInput = ({ value, onChange, onSend, disabled }) => (
  <form
    className="flex items-center gap-2 rounded-2xl border border-atelier-200 bg-white p-1.5 shadow-sm dark:border-atelier-700 dark:bg-atelier-850"
    onSubmit={(event) => {
      event.preventDefault();
      onSend?.();
    }}
  >
    <input
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          onSend?.();
        }
      }}
      placeholder="Type a date, time, or question..."
      className="flex-1 bg-transparent px-3 py-2 text-sm text-atelier-900 placeholder-atelier-400 focus:outline-none dark:text-atelier-100 dark:placeholder-atelier-500"
      disabled={disabled}
    />
    <Button
      type="submit"
      size="sm"
      className="h-8 w-8 !p-0 rounded-xl"
      disabled={disabled || !value.trim()}
      aria-label="Send message"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  </form>
);

export { ChatInput };
