import { useRef, useEffect, useState, useCallback } from "react";
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(false);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const threshold = 150; // Increased threshold
    const isAtBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    return isAtBottom;
  }, []);

  // Handle scroll event with debouncing
  const handleScroll = useCallback(() => {
    // Ignore scroll events triggered by auto-scroll
    if (isAutoScrollingRef.current) {
      return;
    }

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce scroll detection
    scrollTimeoutRef.current = setTimeout(() => {
      const atBottom = isNearBottom();
      setIsUserScrolling(!atBottom);
    }, 100); // 100ms debounce
  }, [isNearBottom]);

  // Auto-scroll only if user is at bottom
  useEffect(() => {
    if (!isUserScrolling) {
      isAutoScrollingRef.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      
      // Reset flag after scroll animation
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    }
  }, [messages, isLoading, streamingMessageId, isUserScrolling]);

  // Scroll to bottom when button clicked
  const scrollToBottom = useCallback(() => {
    isAutoScrollingRef.current = true;
    setIsUserScrolling(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Reset flag after scroll animation
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onSuggestionClick={onSuggestionClick || (() => {})} />;
  }

  return (
    <div 
      className="chat-messages" 
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
        />
      ))}
      {isLoading && <ThinkingIndicator />}
      <div ref={messagesEndRef} />
      
      {/* Jump to bottom button */}
      {isUserScrolling && (
        <button 
          className="jump-to-bottom-btn"
          onClick={scrollToBottom}
          title="Jump to latest message"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="7 13 12 18 17 13"></polyline>
            <polyline points="7 6 12 11 17 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};
