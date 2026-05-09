import { Send } from 'lucide-react';
import { Button, Input } from '../ui/index.js';

const ChatInput = ({ value, onChange, onSend, disabled }) => (
  <form
    className="flex items-end gap-3"
    onSubmit={(event) => {
      event.preventDefault();
      onSend?.();
    }}
  >
    <Input
      label=""
      value={value}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          onSend?.();
        }
      }}
      placeholder="Type a prompt for customer or owner help..."
      className="flex-1"
      disabled={disabled}
    />
    <Button type="submit" loading={disabled} disabled={disabled} aria-label="Send message">
      <Send className="h-4 w-4" />
    </Button>
  </form>
);

export { ChatInput };