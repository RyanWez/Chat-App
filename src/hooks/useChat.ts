import { useState } from 'react'
import { ChatSession, Message } from '@/types/chat'

export const useChat = () => {
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

  const activeChat = chatSessions.find(chat => chat.id === activeChatId)

  const sendMessage = (content: string) => {
    if (!content.trim() || !activeChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
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

    // Simulate assistant response
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

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${chatSessions.length + 1}`,
      messages: [],
      lastUpdated: new Date()
    }

    setChatSessions(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }

  return {
    chatSessions,
    activeChatId,
    activeChat,
    setActiveChatId,
    sendMessage,
    createNewChat
  }
}
