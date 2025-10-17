import { useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { ChatMessage } from './ChatMessage'
import { LoadingDots } from './LoadingDots'
import { EmptyState } from './EmptyState'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
  onSuggestionClick?: (suggestion: string) => void
}

export const ChatMessages = ({ messages, isLoading, onSuggestionClick }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onSuggestionClick={onSuggestionClick || (() => {})} />
  }

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message}
          isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
        />
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="message assistant">
          <div className="message-avatar">AI</div>
          <div className="message-content loading">
            <LoadingDots />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
