'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CookieContext = createContext()

export function CookieProvider({ children }) {
  const [cookieConsent, setCookieConsent] = useState(null) // null = not set, true = accepted, false = rejected
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (consent === null) {
      setShowBanner(true)
      setCookieConsent(null)
    } else {
      setCookieConsent(consent === 'true')
      setShowBanner(false)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setCookieConsent(true)
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'false')
    setCookieConsent(false)
    setShowBanner(false)
  }

  const acceptNecessaryOnly = () => {
    localStorage.setItem('cookieConsent', 'necessary')
    setCookieConsent('necessary')
    setShowBanner(false)
  }

  return (
    <CookieContext.Provider value={{ 
      cookieConsent, 
      showBanner, 
      acceptCookies, 
      rejectCookies,
      acceptNecessaryOnly,
      setShowBanner 
    }}>
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookies must be used within CookieProvider')
  }
  return context
}
