// Device ID management for anonymous authentication
// Uses localStorage to persist device identity across sessions

const DEVICE_ID_KEY = 'chat_device_id'

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Get or create device ID
 * Returns existing ID from localStorage or generates new one
 */
export function getDeviceId(): string {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    // Try to get existing device ID
    let deviceId = localStorage.getItem(DEVICE_ID_KEY)

    if (!deviceId) {
      // Generate new device ID
      deviceId = generateUUID()
      localStorage.setItem(DEVICE_ID_KEY, deviceId)
      console.log('🆕 New device ID generated:', deviceId)
    } else {
      console.log('✅ Existing device ID found:', deviceId)
    }

    return deviceId
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    // Fallback: generate temporary ID (won't persist)
    return generateUUID()
  }
}

/**
 * Clear device ID (for testing or logout)
 */
export function clearDeviceId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY)
    console.log('🗑️ Device ID cleared')
  }
}

/**
 * Get device information for fingerprinting
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return null
  }

  return {
    browser: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth: window.screen.colorDepth,
  }
}
