interface MobileHeaderProps {
  title: string
  isDarkMode: boolean
  onMenuClick: () => void
  onToggleTheme: () => void
}

export const MobileHeader = ({
  title,
  isDarkMode,
  onMenuClick,
  onToggleTheme
}: MobileHeaderProps) => {
  return (
    <div className="mobile-header">
      <button 
        className="menu-button"
        onClick={onMenuClick}
      >
        ☰
      </button>
      <h1 style={{ fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h1>
      <button 
        className="theme-toggle"
        onClick={onToggleTheme}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
