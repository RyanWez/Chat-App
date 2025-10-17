import { useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { ChatMessage } from './ChatMessage'
import { ThinkingIndicator } from './ThinkingIndicator'
import { EmptyState } from './EmptyState'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
  streamingMessageId?: string | null
  onSuggestionClick?: (suggestion: string) => void
}

export const ChatMessages = ({ messages, isLoading, streamingMessageId, onSuggestionClick }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, streamingMessageId])

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onSuggestionClick={onSuggestionClick || (() => {})} />
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
  )
}
