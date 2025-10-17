import { Message } from '@/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export const ChatMessage = ({ message, isStreaming }: ChatMessageProps) => {
  return (
    <div className={`message ${message.role} ${isStreaming ? 'streaming' : ''}`}>
      {message.role === 'assistant' && (
        <div className="message-avatar">AI</div>
      )}
      <div className="message-content">
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
            code: ({ inline, children, ...props }: any) => {
              return inline ? (
                <code className="markdown-inline-code" {...props}>
                  {children}
                </code>
              ) : (
                <code className="markdown-code-block" {...props}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
            
            // Lists
            ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
            ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
            li: ({ children }) => <li className="markdown-li">{children}</li>,
            
            // Links
            a: ({ children, href }) => (
              <a className="markdown-link" href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            
            // Tables
            table: ({ children }) => <table className="markdown-table">{children}</table>,
            thead: ({ children }) => <thead className="markdown-thead">{children}</thead>,
            tbody: ({ children }) => <tbody className="markdown-tbody">{children}</tbody>,
            tr: ({ children }) => <tr className="markdown-tr">{children}</tr>,
            th: ({ children }) => <th className="markdown-th">{children}</th>,
            td: ({ children }) => <td className="markdown-td">{children}</td>,
            
            // Blockquote
            blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
            
            // Paragraphs
            p: ({ children }) => <p className="markdown-p">{children}</p>
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {message.role === 'user' && (
        <div className="message-avatar">You</div>
      )}
    </div>
  )
}
