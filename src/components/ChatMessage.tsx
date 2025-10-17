import { Message } from '@/types/chat'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`message ${message.role}`}>
      {message.role === 'assistant' && (
        <div className="message-avatar">AI</div>
      )}
      <div className="message-content">
        {message.content}
      </div>
      {message.role === 'user' && (
        <div className="message-avatar">You</div>
      )}
    </div>
  )
}
