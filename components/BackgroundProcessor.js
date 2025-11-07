'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundProcessor() {
  const intervalRef = useRef(null)

  useEffect(() => {
    // Function to process pending AI reviews
    const processPendingReviews = async () => {
      try {
        const response = await fetch('/api/process-pending-reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.processed > 0) {
            console.log(`✅ Background: Processed ${result.processed} pending AI reviews`)
          }
        }
      } catch (error) {
        console.error('Background processor error:', error)
        // Silently fail - don't disrupt user experience
      }
    }

    // Start interval - check every 2 minutes (120000ms)
    intervalRef.current = setInterval(() => {
      processPendingReviews()
    }, 120000) // 2 minutes

    // Run once immediately on mount
    processPendingReviews()

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
