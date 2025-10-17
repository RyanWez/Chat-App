import type { NextApiRequest, NextApiResponse } from 'next'
import { OllamaService } from '@/services/ollama'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate environment variables
  const apiKey = process.env.OLLAMA_API_KEY

  if (!apiKey) {
    console.error('OLLAMA_API_KEY is not configured')
    return res.status(500).json({ error: 'Server configuration error: API key missing' })
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not configured')
    return res.status(500).json({ error: 'Server configuration error: Database URI missing' })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const ollama = new OllamaService(apiKey)
    const response = await ollama.chat(messages)

    return res.status(200).json({ content: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
