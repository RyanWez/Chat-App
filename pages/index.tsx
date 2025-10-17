import { useState } from 'react'
import Head from 'next/head'
import { useChat } from '@/hooks/useChat'
import { useTheme } from '@/hooks/useTheme'
import { Sidebar } from '@/components/Sidebar'
import { MobileHeader } from '@/components/MobileHeader'
import { ChatMessages } from '@/components/ChatMessages'
import { MessageInput } from '@/components/MessageInput'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const {
    chatSessions,
    activeChatId,
    activeChat,
    isLoading,
    setActiveChatId,
    sendMessage,
    createNewChat
  } = useChat()

  const handleNewChat = () => {
    createNewChat()
    setIsSidebarOpen(false)
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
        <Sidebar
          isOpen={isSidebarOpen}
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          isDarkMode={isDarkMode}
          onClose={() => setIsSidebarOpen(false)}
          onChatSelect={setActiveChatId}
          onNewChat={handleNewChat}
          onToggleTheme={toggleTheme}
        />

        <div className="main-chat">
          <MobileHeader
            title={activeChat?.title || 'Chat'}
            isDarkMode={isDarkMode}
            onMenuClick={() => setIsSidebarOpen(true)}
            onToggleTheme={toggleTheme}
          />

          <ChatMessages 
            messages={activeChat?.messages || []} 
            isLoading={isLoading}
            onSuggestionClick={sendMessage}
          />

          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </>
  )
}
