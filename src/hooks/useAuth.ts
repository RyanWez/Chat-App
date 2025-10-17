import { useState, useEffect } from 'react'
import { getDeviceId, getDeviceInfo } from '@/lib/deviceId'

export interface User {
  _id: string
  deviceId: string
  createdAt: Date
  lastSeen: Date
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get device ID from localStorage
      const deviceId = getDeviceId()

      if (!deviceId) {
        throw new Error('Failed to generate device ID')
      }

      // Register or verify device with backend
      const response = await fetch('/api/auth/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          deviceInfo: getDeviceInfo(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate device')
      }

      const userData = await response.json()
      
      setUser({
        ...userData,
        createdAt: new Date(userData.createdAt),
        lastSeen: new Date(userData.lastSeen),
      })

      console.log('✅ User authenticated:', userData._id)
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAuth = () => {
    initializeAuth()
  }

  return {
    user,
    userId: user?._id || null,
    deviceId: user?.deviceId || null,
    isLoading,
    error,
    refreshAuth,
  }
}
