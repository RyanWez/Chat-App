import { useState } from 'react'
import { ChatSession, Message } from '@/types/chat'

export const useChat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      messages: [],
      lastUpdated: new Date()
    }
  ])
  const [activeChatId, setActiveChatId] = useState('1')
  const [isLoading, setIsLoading] = useState(false)

  const activeChat = chatSessions.find(chat => chat.id === activeChatId)

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeChat || isLoading) return

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
    setIsLoading(true)

    // Create placeholder for streaming response
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    }

    // Add empty assistant message
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

    try {
      // Prepare messages for API
      const apiMessages = updatedSessions
        .find(s => s.id === activeChatId)
        ?.messages.map(m => ({
          role: m.role,
          content: m.content
        })) || []

      // Call streaming API
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                
                // Update message content
                setChatSessions(prev => prev.map(session => {
                  if (session.id === activeChatId) {
                    return {
                      ...session,
                      messages: session.messages.map(msg =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      ),
                      lastUpdated: new Date()
                    }
                  }
                  return session
                }))
              }
            } catch (e) {
              console.error('Error parsing chunk:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Update with error message
      setChatSessions(prev => prev.map(session => {
        if (session.id === activeChatId) {
          return {
            ...session,
            messages: session.messages.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
                : msg
            ),
            lastUpdated: new Date()
          }
        }
        return session
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
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
    isLoading,
    setActiveChatId,
    sendMessage,
    createNewChat
  }
}
