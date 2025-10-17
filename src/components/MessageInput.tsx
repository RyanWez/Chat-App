import { useState, useRef, KeyboardEvent, useEffect } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [currentMessage])

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return
    onSendMessage(currentMessage)
    setCurrentMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="input-area">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type your message here..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim()}
          title="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
