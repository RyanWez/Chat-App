import { useState } from 'react'
import { Message } from '@/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export const ChatMessage = ({ message, isStreaming }: ChatMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Check if message is long (more than 200 characters or 3 lines)
  const isLongMessage = message.role === 'user' && message.content.length > 200
  const shouldCollapse = isLongMessage && !isExpanded
  
  // Get preview text (first 150 characters)
  const previewText = shouldCollapse 
    ? message.content.slice(0, 150) + '...'
    : message.content

  return (
    <div className={`message ${message.role} ${isStreaming ? 'streaming' : ''}`}>
      {message.role === 'assistant' && (
        <div className="message-avatar">AI</div>
      )}
      <div className={`message-content ${shouldCollapse ? 'collapsed' : 'expanded'}`}>
        {message.role === 'user' && isLongMessage && (
          <button
            className={`message-expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
            h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
            
            // Text formatting
            strong: ({ children }) => <strong className="markdown-bold">{children}</strong>,
            em: ({ children }) => <em className="markdown-italic">{children}</em>,
            
            // Code
            code: ({ inline, children, className, ...props }: { inline?: boolean; children?: React.ReactNode; className?: string }) => {
              return inline ? (
                <code className="markdown-inline-code" {...props}>
                  {children}
                </code>
              ) : (
                <code className={`markdown-code-block ${className || ''}`} {...props}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className="markdown-pre">
                {children}
              </pre>
            ),
            
            // Lists
            ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
            ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
            li: ({ children }) => <li className="markdown-li">{children}</li>,
            
            // Links
            a: ({ children, href }) => (
              <a 
                className="markdown-link" 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ wordBreak: 'break-all' }}
              >
                {children}
              </a>
            ),
            
            // Tables
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <table className="markdown-table">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="markdown-thead">{children}</thead>,
            tbody: ({ children }) => <tbody className="markdown-tbody">{children}</tbody>,
            tr: ({ children }) => <tr className="markdown-tr">{children}</tr>,
            th: ({ children }) => <th className="markdown-th">{children}</th>,
            td: ({ children }) => <td className="markdown-td">{children}</td>,
            
            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="markdown-blockquote">{children}</blockquote>
            ),
            
            // Paragraphs
            p: ({ children }) => <p className="markdown-p">{children}</p>,
            
            // Line breaks
            br: () => <br />
          }}
        >
          {previewText}
        </ReactMarkdown>
      </div>
      {message.role === 'user' && (
        <div className="message-avatar">You</div>
      )}
    </div>
  )
}
