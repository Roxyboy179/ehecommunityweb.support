'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkOwnerStatus(session.user.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkOwnerStatus(session.user.id)
      } else {
        setIsOwner(false)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkOwnerStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_type')
        .eq('user_id', userId)
        .eq('badge_type', 'Owner')
        .single()

      setIsOwner(!!data && !error)
    } catch (error) {
      console.error('Owner check error:', error)
      setIsOwner(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      await checkOwnerStatus(data.user.id)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setIsOwner(false)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    loading,
    isOwner,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}