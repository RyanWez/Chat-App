import { ChatSession } from '@/types/chat'

interface SidebarProps {
  isOpen: boolean
  chatSessions: ChatSession[]
  activeChatId: string
  isDarkMode: boolean
  onClose: () => void
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onToggleTheme: () => void
}

export const Sidebar = ({
  isOpen,
  chatSessions,
  activeChatId,
  isDarkMode,
  onClose,
  onChatSelect,
  onNewChat,
  onToggleTheme
}: SidebarProps) => {
  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId)
    onClose()
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            + New Chat
          </button>
          <button 
            className="theme-toggle"
            onClick={onToggleTheme}
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
              onClick={() => handleChatSelect(session.id)}
            >
              {session.title}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
