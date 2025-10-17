import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chatId } = req.query

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'Invalid chat ID' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDatabase()
    const chatsCollection = db.collection('chats')

    const { message } = req.body

    if (!message || !message.content || !message.role) {
      return res.status(400).json({ error: 'Invalid message format' })
    }

    // Add message to chat
    const result = await chatsCollection.findOneAndUpdate(
      { _id: new ObjectId(chatId) },
      { 
        $push: { messages: message },
        $set: { lastUpdated: new Date() }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error('Message API error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
