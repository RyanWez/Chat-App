import { useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { ChatMessage } from './ChatMessage'

interface ChatMessagesProps {
  messages: Message[]
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-messages">
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
