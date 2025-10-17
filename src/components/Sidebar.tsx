import { useState } from 'react'
import { ChatSession } from '@/types/chat'
import { formatChatDate } from '@/utils/formatters'

interface SidebarProps {
  isOpen: boolean
  chatSessions: ChatSession[]
  activeChatId: string
  isDarkMode: boolean
  onClose: () => void
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onToggleTheme: () => void
  onDeleteChat: (chatId: string) => void
  onUpdateTitle: (chatId: string, newTitle: string) => void
}

export const Sidebar = ({
  isOpen,
  chatSessions,
  activeChatId,
  isDarkMode,
  onClose,
  onChatSelect,
  onNewChat,
  onToggleTheme,
  onDeleteChat,
  onUpdateTitle
}: SidebarProps) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId)
    onClose()
  }

  const handleStartEdit = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const handleSaveEdit = (chatId: string) => {
    if (editTitle.trim()) {
      onUpdateTitle(chatId, editTitle.trim())
    }
    setEditingChatId(null)
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleDelete = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      onDeleteChat(chatId)
    }
  }

  // Group chats by date
  const groupedChats = chatSessions.reduce((groups, session) => {
    const dateLabel = formatChatDate(session.lastUpdated)
    if (!groups[dateLabel]) {
      groups[dateLabel] = []
    }
    groups[dateLabel].push(session)
    return groups
  }, {} as Record<string, ChatSession[]>)

  const dateOrder = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days']

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
          {dateOrder.map(dateLabel => {
            const chats = groupedChats[dateLabel]
            if (!chats || chats.length === 0) return null

            return (
              <div key={dateLabel} className="chat-group">
                <div className="chat-group-label">{dateLabel}</div>
                {chats.map(session => (
                  <div
                    key={session.id}
                    className={`chat-item ${session.id === activeChatId ? 'active' : ''}`}
                    onClick={() => handleChatSelect(session.id)}
                  >
                    {editingChatId === session.id ? (
                      <div className="chat-item-edit" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(session.id)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                          className="chat-title-input"
                        />
                        <button 
                          className="chat-action-btn save"
                          onClick={() => handleSaveEdit(session.id)}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button 
                          className="chat-action-btn cancel"
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="chat-item-title">{session.title}</span>
                        <div className="chat-item-actions">
                          <button
                            className="chat-action-btn edit"
                            onClick={(e) => handleStartEdit(session.id, session.title, e)}
                            title="Edit title"
                          >
                            ✎
                          </button>
                          <button
                            className="chat-action-btn delete"
                            onClick={(e) => handleDelete(session.id, e)}
                            title="Delete chat"
                          >
                            🗑
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
          
          {/* Other dates */}
          {Object.entries(groupedChats).map(([dateLabel, chats]) => {
            if (dateOrder.includes(dateLabel)) return null

            return (
              <div key={dateLabel} className="chat-group">
                <div className="chat-group-label">{dateLabel}</div>
                {chats.map(session => (
                  <div
                    key={session.id}
                    className={`chat-item ${session.id === activeChatId ? 'active' : ''}`}
                    onClick={() => handleChatSelect(session.id)}
                  >
                    {editingChatId === session.id ? (
                      <div className="chat-item-edit" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(session.id)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                          className="chat-title-input"
                        />
                        <button 
                          className="chat-action-btn save"
                          onClick={() => handleSaveEdit(session.id)}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button 
                          className="chat-action-btn cancel"
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="chat-item-title">{session.title}</span>
                        <div className="chat-item-actions">
                          <button
                            className="chat-action-btn edit"
                            onClick={(e) => handleStartEdit(session.id, session.title, e)}
                            title="Edit title"
                          >
                            ✎
                          </button>
                          <button
                            className="chat-action-btn delete"
                            onClick={(e) => handleDelete(session.id, e)}
                            title="Delete chat"
                          >
                            🗑
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
