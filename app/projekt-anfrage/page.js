'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, FileText, Type, Globe, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProjektAnfragePage() {
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('website')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/project-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectName,
          project_type: projectType,
          email: user.email,
          description: description,
          user_id: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten')
      }

      setSuccess(true)
      setProjectName('')
      setProjectType('website')
      setDescription('')
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Globe className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EHE Community
            </span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Projekt-Anfrage <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">stellen</span>
          </h1>
          <p className="text-gray-300">
            Füllen Sie das Formular aus, um ein neues Community-Projekt anzufragen
          </p>
        </div>

        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Anfrage erfolgreich gesendet!</h2>
              <p className="text-gray-300 mb-4">
                Ihre Projekt-Anfrage wurde eingereicht. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
              </p>
              <p className="text-sm text-gray-400">
                Sie werden in wenigen Sekunden zur Startseite weitergeleitet...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium text-gray-200">
                  Projekt-Name *
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="z.B. Community Dashboard"
                    required
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <label htmlFor="projectType" className="text-sm font-medium text-gray-200">
                  Projekt-Typ *
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                >
                  <option value="website">Website</option>
                  <option value="webapp">Web-Anwendung</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="bot">Discord Bot</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              {/* Email (pre-filled, read-only) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/30 border border-blue-500/10 rounded-lg text-gray-400 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-200">
                  Beschreibung *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Beschreiben Sie Ihr Projekt im Detail. Was soll entwickelt werden? Welche Funktionen benötigen Sie?"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="flex-1 border-2 border-blue-400 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    'Anfrage absenden'
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}