'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Loader2, Calendar, Tag, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, Trash2, AlertTriangle } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function MeineProjektePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [projectToRemove, setProjectToRemove] = useState(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 })
  const [projectsRef, projectsVisible] = useScrollAnimation({ threshold: 0.1 })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.email) {
      loadMyProjects()
    }
  }, [user])

  const loadMyProjects = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/my-projects?email=${encodeURIComponent(user.email)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden der Projekte')
      }

      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveClick = (project) => {
    setProjectToRemove(project)
    setShowConfirmDialog(true)
  }

  const confirmRemove = async () => {
    if (!projectToRemove) return

    setRemovingId(projectToRemove.id)
    setShowConfirmDialog(false)
    
    try {
      const response = await fetch(`/api/project-requests/${projectToRemove.id}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Entfernen des Projekts')
      }

      // Reload projects after successful removal
      await loadMyProjects()
      setProjectToRemove(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  const cancelRemove = () => {
    setShowConfirmDialog(false)
    setProjectToRemove(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'In Bearbeitung':
        return <RefreshCw className="w-4 h-4 text-blue-400" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'Abgelehnt':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'In Bearbeitung':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'approved':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'Abgelehnt':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend'
      case 'In Bearbeitung':
        return 'In Bearbeitung'
      case 'approved':
        return 'Angenommen'
      case 'Abgelehnt':
        return 'Abgelehnt'
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getProjectTypeLabel = (type) => {
    const types = {
      'website': 'Website',
      'webapp': 'Web-Anwendung',
      'dashboard': 'Dashboard',
      'bot': 'Discord Bot',
      'other': 'Sonstiges'
    }
    return types[type] || type
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EHE Community Webseite Studio
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/projekte">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-white hover:bg-blue-500/20"
                >
                  Alle Projekte
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-white hover:bg-blue-500/20"
                >
                  Zur Startseite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section ref={headerRef} className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-8 ${headerVisible ? 'animate-fade-in-up' : ''}`}>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              Meine <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projekte</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Verwalten Sie hier Ihre eingereichten Projekt-Anfragen und deren Status.
            </p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto max-w-6xl px-4 mb-6">
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <section ref={projectsRef} className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {projects.length === 0 ? (
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-12 text-center">
              <Globe className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white">
                Noch keine Projekte
              </h3>
              <p className="text-gray-300 mb-6">
                Sie haben noch keine Projekt-Anfragen eingereicht.
              </p>
              <Link href="/projekt-anfrage">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Projekt einreichen
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:border-blue-500/40 transition-all ${
                    projectsVisible ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: projectsVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Project Name & Status */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {project.project_name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(project.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              <span>{getProjectTypeLabel(project.project_type)}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="text-sm font-semibold">{getStatusLabel(project.status)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-gray-300">{project.description}</p>
                      </div>

                      {/* Project Link */}
                      {project.project_link && (
                        <div>
                          <span className="text-gray-400 text-sm">Projekt-Link:</span>{' '}
                          <a 
                            href={project.project_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline break-all"
                          >
                            {project.project_link}
                          </a>
                        </div>
                      )}

                      {/* Status Info */}
                      {project.status === 'approved' && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <p className="text-green-300 text-sm">
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Ihr Projekt ist jetzt öffentlich auf der Projekte-Seite sichtbar!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex lg:flex-col gap-2 min-w-[200px]">
                      <Button
                        onClick={() => handleRemoveClick(project)}
                        disabled={removingId === project.id}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingId === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Projekt entfernen
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Dialog */}
      {showConfirmDialog && projectToRemove && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-red-500/30 max-w-md w-full p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Projekt entfernen?</h3>
            </div>
            
            <p className="text-gray-300 mb-4">
              Möchten Sie das Projekt <strong className="text-white">"{projectToRemove.project_name}"</strong> wirklich entfernen?
            </p>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm font-semibold mb-2">
                ⚠️ Wichtiger Hinweis:
              </p>
              <ul className="text-red-300 text-sm space-y-1 list-disc list-inside">
                <li>Das Projekt wird dauerhaft aus der öffentlichen Ansicht entfernt</li>
                <li>Diese Aktion kann <strong>nicht rückgängig gemacht</strong> werden</li>
                <li>Sie erhalten eine Bestätigungs-E-Mail</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelRemove}
                variant="outline"
                className="flex-1 border-gray-500 text-white hover:bg-gray-500/20"
              >
                Abbrechen
              </Button>
              <Button
                onClick={confirmRemove}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Ja, entfernen
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2025 EHE Community Webseite Studio. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
