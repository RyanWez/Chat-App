export const ThinkingIndicator = () => {
  return (
    <div className="message assistant">
      <div className="message-avatar">AI</div>
      <div className="message-content thinking">
        <span className="thinking-text">Thinking</span>
        <span className="thinking-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  )
}
