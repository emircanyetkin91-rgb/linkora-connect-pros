import { Message } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <div className={cn("flex mb-3", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-body-small",
          isMe
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-grey-100 text-foreground rounded-bl-md"
        )}
      >
        <p>{message.text}</p>
        <p className={cn(
          "mt-1 text-xs",
          isMe ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}