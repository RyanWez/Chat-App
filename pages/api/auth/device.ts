import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { deviceId, deviceInfo } = req.body

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({ error: 'Invalid device ID' })
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Check if device already exists
    const user = await usersCollection.findOne({ deviceId })

    if (user) {
      // Update last seen
      await usersCollection.updateOne(
        { deviceId },
        { 
          $set: { 
            lastSeen: new Date(),
            ...(deviceInfo && { deviceInfo })
          } 
        }
      )

      console.log('✅ Existing user authenticated:', user._id)
      
      return res.status(200).json({
        _id: user._id.toString(),
        deviceId: user.deviceId,
        createdAt: user.createdAt,
        lastSeen: new Date(),
      })
    }

    // Create new user
    const newUser = {
      deviceId,
      deviceInfo: deviceInfo || null,
      createdAt: new Date(),
      lastSeen: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    console.log('🆕 New user created:', result.insertedId)

    return res.status(201).json({
      _id: result.insertedId.toString(),
      deviceId: newUser.deviceId,
      createdAt: newUser.createdAt,
      lastSeen: newUser.lastSeen,
    })
  } catch (error) {
    console.error('Device auth error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
