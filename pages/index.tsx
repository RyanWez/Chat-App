import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      messages: [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          role: 'assistant',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    }
  ])
  const [activeChatId, setActiveChatId] = useState('1')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeChat = chatSessions.find(chat => chat.id === activeChatId)

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat?.messages])

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !activeChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // Add user message
    const updatedSessions = chatSessions.map(session => {
      if (session.id === activeChatId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          lastUpdated: new Date()
        }
      }
      return session
    })

    setChatSessions(updatedSessions)
    setCurrentMessage('')

    // Simulate assistant response (in real app, this would be an API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${newMessage.content}". This is a demo response.`,
        role: 'assistant',
        timestamp: new Date()
      }

      setChatSessions(prev => prev.map(session => {
        if (session.id === activeChatId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            lastUpdated: new Date()
          }
        }
        return session
      }))
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${chatSessions.length + 1}`,
      messages: [],
      lastUpdated: new Date()
    }

    setChatSessions(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
    setIsSidebarOpen(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Head>
        <title>Modern Chat Interface</title>
        <meta name="description" content="A modern chat interface built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="chat-container">
        {/* Sidebar Overlay for Mobile */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={createNewChat}>
              + New Chat
            </button>
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="chat-history">
            {chatSessions.map(session => (
              <div
                key={session.id}
                className={`chat-item ${session.id === activeChatId ? 'active' : ''}`}
                onClick={() => {
                  setActiveChatId(session.id)
                  setIsSidebarOpen(false)
                }}
              >
                {session.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="main-chat">
          {/* Mobile Header */}
          <div className="mobile-header">
            <button 
              className="menu-button"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '600' }}>
              {activeChat?.title || 'Chat'}
            </h1>
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {activeChat?.messages.map(message => (
              <div key={message.id} className={`message ${message.role}`}>
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
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <textarea
                ref={textareaRef}
                className="message-input"
                placeholder="Type your message here..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
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
        </div>
      </div>
    </>
  )
}