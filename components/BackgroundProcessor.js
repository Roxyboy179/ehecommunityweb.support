'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundProcessor() {
  const reviewIntervalRef = useRef(null)
  const projectIntervalRef = useRef(null)

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
        console.error('Background processor error (reviews):', error)
        // Silently fail - don't disrupt user experience
      }
    }

    // Function to check and update pending projects to in_progress
    const checkPendingProjects = async () => {
      try {
        const response = await fetch('/api/projects/check-pending', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.updated_count > 0) {
            console.log(`✅ Background: Updated ${result.updated_count} pending projects to "in_progress"`)
          }
        }
      } catch (error) {
        console.error('Background processor error (projects):', error)
        // Silently fail - don't disrupt user experience
      }
    }

    // Start interval for AI reviews - check every 2 minutes (120000ms)
    reviewIntervalRef.current = setInterval(() => {
      processPendingReviews()
    }, 120000) // 2 minutes

    // Start interval for pending projects - check every 1 minute (60000ms)
    projectIntervalRef.current = setInterval(() => {
      checkPendingProjects()
    }, 60000) // 1 minute

    // Run once immediately on mount
    processPendingReviews()
    checkPendingProjects()

    // Cleanup on unmount
    return () => {
      if (reviewIntervalRef.current) {
        clearInterval(reviewIntervalRef.current)
      }
      if (projectIntervalRef.current) {
        clearInterval(projectIntervalRef.current)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
