import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await getDatabase()
    const chatsCollection = db.collection('chats')

    if (req.method === 'GET') {
      // Get all chats
      const chats = await chatsCollection
        .find({})
        .sort({ lastUpdated: -1 })
        .toArray()

      return res.status(200).json(chats)
    }

    if (req.method === 'POST') {
      // Create new chat
      const { title, messages } = req.body

      const newChat = {
        title: title || 'New Chat',
        messages: messages || [],
        lastUpdated: new Date(),
        createdAt: new Date()
      }

      const result = await chatsCollection.insertOne(newChat)

      return res.status(201).json({
        _id: result.insertedId,
        ...newChat
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Chats API error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
