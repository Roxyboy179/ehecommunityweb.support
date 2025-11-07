'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Mail, FileText, Type, Globe, AlertCircle, CheckCircle, Loader2, Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ProjektAnfragePage() {
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('website')
  const [description, setDescription] = useState('')
  const [projectLink, setProjectLink] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(true) // Always show on page load
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Show dialog on every page load
  useEffect(() => {
    setShowInfoDialog(true)
  }, [])

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
          project_link: projectLink,
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
      setProjectLink('')
      
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
      {/* Info Dialog - Shows on every page load */}
      <AlertDialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <AlertDialogContent className="bg-slate-900 border-blue-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-400" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Wichtige Informationen
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-200 space-y-4 pt-4">
              {/* Kostenlose Projektanfragen */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  100% Kostenlos
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Projektanfragen sind <strong>völlig kostenlos</strong>! Wir sind eine Community-Plattform, 
                  die bestehende Projekte sichtbar macht. Es fallen keinerlei Gebühren oder versteckte Kosten an.
                </p>
              </div>

              {/* Was wir machen */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Was wir machen</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-2">
                  <strong>Wichtig:</strong> Wir entwickeln keine Projekte! Diese Plattform dient dazu, 
                  Community-Projekte zu präsentieren und sichtbar zu machen.
                </p>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Wenn Ihre Projekt-Anfrage angenommen wird, wird sie in unserer Projektübersicht 
                  veröffentlicht und für die gesamte EHE Community zugänglich gemacht.
                </p>
              </div>

              {/* AGB und Rechtliches */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-3">Rechtliche Hinweise</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-3">
                  Mit der Einreichung Ihrer Projekt-Anfrage akzeptieren Sie unsere rechtlichen Bedingungen:
                </p>
                <div className="space-y-2">
                  <Link 
                    href="/nutzungsbedingungen" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Nutzungsbedingungen
                  </Link>
                  <Link 
                    href="/datenschutz" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Datenschutzerklärung
                  </Link>
                  <Link 
                    href="/impressum" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Impressum
                  </Link>
                </div>
              </div>

              {/* Wichtige Regeln */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-amber-400 mb-2">Wichtige Regeln</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Projekte müssen Community-relevant sein</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Keine kommerziellen oder werblichen Inhalte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Respektvoller Umgang und keine beleidigenden Inhalte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Wahrheitsgemäße Angaben in der Projektbeschreibung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Keine illegalen oder rechtsverletzenden Inhalte</span>
                  </li>
                </ul>
              </div>

              <p className="text-xs text-gray-400 italic pt-2">
                Durch Klicken auf "Akzeptieren" bestätigen Sie, dass Sie diese Informationen gelesen 
                und verstanden haben.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowInfoDialog(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
            >
              Akzeptieren und fortfahren
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

        {/* Informational Section */}
        <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-300 mb-2">
                Was macht diese Plattform?
              </h3>
              <div className="text-gray-200 space-y-2">
                <p>
                  <strong>Wichtig:</strong> Wir erstellen keine Projekte! Diese Plattform dient dazu, 
                  Community-Projekte <strong>sichtbar zu machen</strong>.
                </p>
                <p>
                  Wenn Ihre Projekt-Anfrage angenommen wird, wird sie in unserer 
                  <Link href="/projekte" className="text-blue-300 hover:text-blue-200 underline mx-1">
                    Projektübersicht
                  </Link>
                  veröffentlicht und für die gesamte EHE Community sichtbar gemacht.
                </p>
                <p className="text-sm text-gray-300 mt-3">
                  💡 Diese Plattform ist eine Schaufenster für Community-Projekte, keine Entwicklungsagentur.
                </p>
              </div>
            </div>
          </div>
        </Card>

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

              {/* Project Link */}
              <div className="space-y-2">
                <label htmlFor="projectLink" className="text-sm font-medium text-gray-200">
                  Projekt-Link (optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="projectLink"
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="https://beispiel.de"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Falls Ihr Projekt bereits einen Link hat, geben Sie ihn hier an
                </p>
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
