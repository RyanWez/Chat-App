import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await getDatabase()
    const chatsCollection = db.collection('chats')

    // Get userId from header or body
    const userId = req.headers['x-user-id'] as string || req.body?.userId

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' })
    }

    // Validate userId format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' })
    }

    if (req.method === 'GET') {
      // Get all chats for this user
      const chats = await chatsCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ lastUpdated: -1 })
        .toArray()

      return res.status(200).json(chats)
    }

    if (req.method === 'POST') {
      // Create new chat for this user
      const { title, messages } = req.body

      // Validate input
      if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'Invalid title format' })
      }

      if (messages && !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' })
      }

      // Validate messages structure
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          if (!msg.role || !msg.content || typeof msg.content !== 'string') {
            return res.status(400).json({ error: 'Invalid message structure' })
          }
          if (!['user', 'assistant', 'system'].includes(msg.role)) {
            return res.status(400).json({ error: 'Invalid message role' })
          }
        }
      }

      const newChat = {
        userId: new ObjectId(userId),
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
