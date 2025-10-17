interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a creative story about a time traveler",
    "Help me plan a healthy meal for the week",
    "Teach me the basics of JavaScript"
  ]

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">💬</div>
        <h2 className="empty-state-title">Start a Conversation</h2>
        <p className="empty-state-description">
          Choose a suggestion below or type your own message
        </p>
        
        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">✨</span>
              <span className="suggestion-text">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
