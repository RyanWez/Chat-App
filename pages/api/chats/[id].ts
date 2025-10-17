import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid chat ID' })
  }

  try {
    const db = await getDatabase()
    const chatsCollection = db.collection('chats')

    if (req.method === 'GET') {
      // Get single chat
      const chat = await chatsCollection.findOne({ _id: new ObjectId(id) })

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' })
      }

      return res.status(200).json(chat)
    }

    if (req.method === 'PUT') {
      // Update chat
      const { title, messages } = req.body

      const updateData: Record<string, unknown> = {
        lastUpdated: new Date()
      }

      if (title !== undefined) updateData.title = title
      if (messages !== undefined) updateData.messages = messages

      const result = await chatsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

      if (!result) {
        return res.status(404).json({ error: 'Chat not found' })
      }

      return res.status(200).json(result)
    }

    if (req.method === 'DELETE') {
      // Delete chat
      const result = await chatsCollection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Chat not found' })
      }

      return res.status(200).json({ message: 'Chat deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
