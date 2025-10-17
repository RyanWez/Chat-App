import type { NextApiRequest, NextApiResponse } from 'next'
import { OllamaService } from '@/services/ollama'

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
  },
}

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

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const ollama = new OllamaService(apiKey)

    let hasStarted = false

    await ollama.streamChat(
      messages,
      (chunk: string) => {
        if (!hasStarted) {
          hasStarted = true
          // Send start signal
          res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`)
        }
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`)
      },
      () => {
        // Send completion signal
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        res.end()
      },
      (error: Error) => {
        console.error('Streaming error:', error)
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
        res.end()
      }
    )
  } catch (error) {
    console.error('Chat stream API error:', error)
    
    // Try to send error via SSE if headers not sent
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
    }
    
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })}\n\n`)
    res.end()
  }
}
