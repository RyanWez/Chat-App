import type { NextApiRequest, NextApiResponse } from 'next'
import { OllamaService } from '@/services/ollama'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OLLAMA_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'OLLAMA_API_KEY not configured' })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const ollama = new OllamaService(apiKey)

    await ollama.streamChat(
      messages,
      (chunk: string) => {
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      },
      () => {
        // Send completion signal
        res.write('data: [DONE]\n\n')
        res.end()
      },
      (error: Error) => {
        console.error('Streaming error:', error)
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        res.end()
      }
    )
  } catch (error) {
    console.error('Chat stream API error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
