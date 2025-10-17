export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}
