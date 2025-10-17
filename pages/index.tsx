import { useState } from "react";
import Head from "next/head";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { MessageInput } from "@/components/MessageInput";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Initialize authentication
  const { userId, isLoading: isAuthLoading, error: authError } = useAuth();
  
  // Initialize chat with userId
  const {
    chatSessions,
    activeChatId,
    activeChat,
    isLoading,
    streamingMessageId,
    isInitializing,
    setActiveChatId,
    sendMessage,
    createNewChat,
    deleteChat,
    updateChatTitle,
  } = useChat({ userId });

  const handleNewChat = () => {
    createNewChat();
    setIsSidebarOpen(false);
  };

  // Show loading state while authenticating
  if (isAuthLoading || isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#565869',
        gap: '10px'
      }}>
        <div>🔐 Initializing your session...</div>
        {isAuthLoading && <div style={{ fontSize: '14px', opacity: 0.7 }}>Authenticating device...</div>}
        {isInitializing && <div style={{ fontSize: '14px', opacity: 0.7 }}>Loading chats...</div>}
      </div>
    );
  }

  // Show error state if authentication failed
  if (authError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#ef4444',
        gap: '10px'
      }}>
        <div>❌ Authentication Error</div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>{authError}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '14px',
            background: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Modern Chat Interface</title>
        <meta
          name="description"
          content="A modern chat interface built with Next.js"
        />
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
          onDeleteChat={deleteChat}
          onUpdateTitle={updateChatTitle}
        />

        <div className="main-chat">
          <MobileHeader
            title={activeChat?.title || "Chat"}
            isDarkMode={isDarkMode}
            onMenuClick={() => setIsSidebarOpen(true)}
            onToggleTheme={toggleTheme}
          />

          <ChatMessages
            messages={activeChat?.messages || []}
            isLoading={isLoading}
            streamingMessageId={streamingMessageId}
            onSuggestionClick={sendMessage}
          />

          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </>
  );
}
