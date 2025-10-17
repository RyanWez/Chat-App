export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatSession {
  _id?: string
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
  createdAt?: Date
}
