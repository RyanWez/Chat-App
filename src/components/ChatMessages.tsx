import { useRef, useEffect, useState } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { EmptyState } from "./EmptyState";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  streamingMessageId?: string | null;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessages = ({
  messages,
  isLoading,
  streamingMessageId,
  onSuggestionClick,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setIsScrolling(false), 500);
    }
  }, [messages, isLoading, streamingMessageId]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onSuggestionClick={onSuggestionClick || (() => {})} />;
  }

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
        />
      ))}
      {isLoading && <ThinkingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};
