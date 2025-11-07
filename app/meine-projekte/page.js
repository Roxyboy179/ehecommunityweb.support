'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Loader2, Calendar, Tag, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, Trash2, AlertTriangle, ExternalLink, Mail, Send, Eye, EyeOff, ChevronDown, ChevronUp, TimerReset, RotateCw } from 'lucide-react'

export default function MeineProjektePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [projectToRemove, setProjectToRemove] = useState(null)
  const [restoringId, setRestoringId] = useState(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [projectToRestore, setProjectToRestore] = useState(null)
  const [selectedReviewType, setSelectedReviewType] = useState('ai') // 'ai' or 'team'
  const [showReviewDetails, setShowReviewDetails] = useState({})
  const [reviewData, setReviewData] = useState({})
  const [expandedProjects, setExpandedProjects] = useState(new Set())
  const [extendingId, setExtendingId] = useState(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

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

  // Load review data for projects that might have AI reviews
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(project => {
        // Try to load review data for projects that might have been through restoration
        if ((project.status === 'approved' || project.status === 'removed') && !reviewData[project.id]) {
          loadReviewData(project.id)
        }
      })
    }
  }, [projects])

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

  const toggleExpanded = (projectId) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
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

  const handleRestoreClick = (project) => {
    setProjectToRestore(project)
    setShowRestoreDialog(true)
  }

  const confirmRestore = async () => {
    if (!projectToRestore) return

    setRestoringId(projectToRestore.id)
    setShowRestoreDialog(false)
    
    try {
      const response = await fetch(`/api/project-requests/${projectToRestore.id}/request-restoration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email,
          review_type: selectedReviewType 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Beantragen der Wiederherstellung')
      }

      // If AI review and review result available, store it
      if (selectedReviewType === 'ai' && data.review_result) {
        setReviewData(prev => ({
          ...prev,
          [projectToRestore.id]: data.review_result.review
        }))
      }

      await loadMyProjects()
      setProjectToRestore(null)
      setSelectedReviewType('ai') // Reset to default
    } catch (err) {
      setError(err.message)
    } finally {
      setRestoringId(null)
    }
  }

  const loadReviewData = async (projectId) => {
    try {
      const response = await fetch(`/api/restoration-reviews/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setReviewData(prev => ({
          ...prev,
          [projectId]: data
        }))
      }
    } catch (err) {
      console.error('Error loading review data:', err)
    }
  }

  const hasAIReview = (projectId) => {
    // Check if this project has an AI review in the reviewData
    return reviewData[projectId] && reviewData[projectId].review_type === 'ai'
  }

  const toggleReviewDetails = (projectId) => {
    setShowReviewDetails(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
    
    // Load review data if not already loaded
    if (!reviewData[projectId]) {
      loadReviewData(projectId)
    }
  }

  const cancelRestore = () => {
    setShowRestoreDialog(false)
    setProjectToRestore(null)
  }

  const handleExtendProject = async (project) => {
    if (!project.id) return

    setExtendingId(project.id)
    
    try {
      const response = await fetch(`/api/project-requests/${project.id}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Verlängern des Projekts')
      }

      await loadMyProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setExtendingId(null)
    }
  }

  const isProjectExpired = (expirationDate) => {
    if (!expirationDate) return false
    return new Date(expirationDate) <= new Date()
  }

  const canExtendProject = (project) => {
    const extensionCount = project.extension_count || 0
    return extensionCount < 3 && (project.status === 'approved' && !project.is_active)
  }

  const getStatusIcon = (status, project = null) => {
    // Check if project is expired
    if (project && status === 'approved' && project.is_active === false) {
      return <TimerReset className="w-5 h-5 text-orange-400" />
    }
    
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'In Bearbeitung':
        return <RefreshCw className="w-5 h-5 text-blue-400" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'Abgelehnt':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'removed':
        return <Trash2 className="w-5 h-5 text-gray-400" />
      case 'restoration_requested':
        return <RefreshCw className="w-5 h-5 text-purple-400" />
      case 'blocked':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status, project = null) => {
    // Check if project is expired
    if (project && status === 'approved' && project.is_active === false) {
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    }
    
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'In Bearbeitung':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'approved':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'Abgelehnt':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'removed':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
      case 'restoration_requested':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'blocked':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }
  
  const getStatusLabel = (status, project = null) => {
    // Check if project is expired
    if (project && status === 'approved' && project.is_active === false) {
      return 'Abgelaufen'
    }
    
    switch (status) {
      case 'pending':
        return 'Ausstehend'
      case 'In Bearbeitung':
        return 'In Bearbeitung'
      case 'approved':
        return 'Angenommen'
      case 'Abgelehnt':
        return 'Abgelehnt'
      case 'removed':
        return 'Entfernt'
      case 'restoration_requested':
        return 'Wiederherstellung beantragt'
      case 'blocked':
        return 'Gesperrt'
      default:
        return status
    }
  }

  const getStatusDescription = (status, project = null) => {
    // Check if project is expired
    if (project && status === 'approved' && project.is_active === false) {
      return 'Ihr Projekt ist abgelaufen und wird nicht mehr öffentlich angezeigt.'
    }
    
    switch (status) {
      case 'pending':
        return 'Ihre Anfrage wird geprüft. Das Team wird sich zeitnah bei Ihnen melden.'
      case 'In Bearbeitung':
        return 'Ihre Anfrage wird aktiv bearbeitet. Sie werden über den Fortschritt informiert.'
      case 'approved':
        return 'Ihr Projekt wurde angenommen und ist öffentlich auf der Website sichtbar!'
      case 'Abgelehnt':
        return 'Ihre Anfrage wurde abgelehnt. Bei Fragen kontaktieren Sie uns bitte.'
      case 'removed':
        return 'Das Projekt wurde entfernt und ist nicht mehr öffentlich sichtbar.'
      case 'restoration_requested':
        return 'Ihr Wiederherstellungsantrag wird geprüft. Sie erhalten eine Benachrichtigung.'
      case 'blocked':
        return 'Das Projekt wurde gesperrt und ist nicht öffentlich verfügbar.'
      default:
        return 'Status wird aktualisiert...'
    }
  }

  const getEstimatedTime = (status) => {
    switch (status) {
      case 'pending':
        return '7-14 Tage'
      case 'In Bearbeitung':
        return '3-7 Tage'
      case 'restoration_requested':
        return '3-7 Tage'
      default:
        return 'Abgeschlossen'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              Meine <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projekte</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Verwalten Sie hier Ihre eingereichten Projekt-Anfragen und verfolgen Sie deren Status.
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
      <section className="pb-20 px-4">
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
              {projects.map((project) => {
                const isExpanded = expandedProjects.has(project.id)
                
                return (
                  <Card
                    key={project.id}
                    className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl hover:border-blue-500/40 transition-all overflow-hidden"
                  >
                    {/* Main Project Card */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          {/* Project Header */}
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1">
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
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(project.status, project)}`}>
                              {getStatusIcon(project.status, project)}
                              <span>{getStatusLabel(project.status, project)}</span>
                            </div>
                          </div>

                          {/* Status Info Card */}
                          <Card className="bg-slate-800/30 border-blue-500/10 p-5">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-500/10 rounded-lg">
                                {getStatusIcon(project.status, project)}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-2">Aktueller Status</h4>
                                <p className="text-gray-300 text-sm mb-3">
                                  {getStatusDescription(project.status, project)}
                                </p>
                                {(project.status === 'pending' || project.status === 'In Bearbeitung' || project.status === 'restoration_requested') && (
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Geschätzte Bearbeitungszeit: <strong className="text-blue-400">{getEstimatedTime(project.status)}</strong></span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>

                          {/* Project Link */}
                          {project.project_link && (
                            <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                              <ExternalLink className="w-5 h-5 text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 mb-1">Projekt-Link</p>
                                <a 
                                  href={project.project_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline break-all text-sm"
                                >
                                  {project.project_link}
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Status-specific Messages */}
                          {project.status === 'approved' && project.is_active && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-green-300 text-sm font-semibold mb-1">
                                    🎉 Herzlichen Glückwunsch!
                                  </p>
                                  <p className="text-green-200 text-sm mb-3">
                                    Ihr Projekt ist jetzt öffentlich auf der Projekte-Seite sichtbar! Besuchen Sie die Seite, um Ihr Projekt anzusehen.
                                  </p>
                                  {project.expiration_date && (
                                    <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                      <div className="flex items-center gap-2 mb-2">
                                        <TimerReset className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-300 text-xs font-semibold">Ablaufinformationen</span>
                                      </div>
                                      <div className="space-y-1 text-xs text-gray-300">
                                        <p>Ablaufdatum: <strong className="text-white">{formatDate(project.expiration_date)}</strong></p>
                                        <p>Dauer: <strong className="text-white">{project.duration_months || 1} Monat(e)</strong></p>
                                        <p>Verlängerungen genutzt: <strong className="text-white">{project.extension_count || 0} von 3</strong></p>
                                      </div>
                                    </div>
                                  )}
                                  <Link href="/projekte" className="mt-3 inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold">
                                    <Eye className="w-4 h-4" />
                                    Projekt ansehen
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}

                          {project.status === 'approved' && !project.is_active && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-orange-300 text-sm font-semibold mb-1">
                                    ⏰ Projekt abgelaufen
                                  </p>
                                  <p className="text-orange-200 text-sm mb-3">
                                    Ihr Projekt ist abgelaufen und wird nicht mehr öffentlich angezeigt.
                                  </p>
                                  {project.expiration_date && (
                                    <div className="mt-2 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                      <div className="space-y-1 text-xs text-gray-300">
                                        <p>Abgelaufen am: <strong className="text-white">{formatDate(project.expiration_date)}</strong></p>
                                        <p>Verlängerungen genutzt: <strong className="text-white">{project.extension_count || 0} von 3</strong></p>
                                      </div>
                                    </div>
                                  )}
                                  {canExtendProject(project) ? (
                                    <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                      <p className="text-blue-200 text-xs">
                                        ✓ Sie können Ihr Projekt jetzt verlängern ({3 - (project.extension_count || 0)} Verlängerung(en) verfügbar)
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                      <p className="text-red-200 text-xs">
                                        ⚠️ Sie haben bereits 3 Verlängerungen durchgeführt. Um Ihr Projekt erneut anzuzeigen, müssen Sie eine neue Anfrage einreichen.
                                      </p>
                                      <Link href="/projekt-anfrage" className="mt-2 inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-semibold">
                                        <Send className="w-3 h-3" />
                                        Neue Anfrage einreichen
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {project.status === 'removed' && (
                            <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <EyeOff className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-gray-300 text-sm">
                                    Dieses Projekt wurde entfernt und ist nicht mehr öffentlich sichtbar. Sie können eine Wiederherstellung beantragen.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {project.status === 'restoration_requested' && (
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <RefreshCw className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-purple-300 text-sm font-semibold mb-1">
                                    Wiederherstellung beantragt
                                  </p>
                                  <p className="text-purple-200 text-sm">
                                    Ihr Wiederherstellungsantrag wird geprüft. Sie erhalten eine E-Mail sobald entschieden wurde.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {project.status === 'blocked' && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                              <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-orange-300 text-sm font-semibold mb-2">
                                      Dieses Projekt wurde gesperrt
                                    </p>
                                    {project.block_reason && (
                                      <div className="mt-2 pt-2 border-t border-orange-500/20">
                                        <p className="text-gray-400 text-xs mb-1">Grund:</p>
                                        <p className="text-orange-200 text-sm">{project.block_reason}</p>
                                      </div>
                                    )}
                                    {project.blocked_by && (
                                      <p className="text-gray-400 text-xs mt-2">
                                        Gesperrt von: {project.blocked_by}
                                      </p>
                                    )}
                                    <div className="mt-3 p-3 bg-orange-500/10 rounded-lg">
                                      <p className="text-orange-200 text-xs flex items-start gap-2">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                        Bei Fragen zur Sperrung kontaktieren Sie uns bitte unter{' '}
                                        <a href="mailto:hamburgrp20@gmail.com" className="underline hover:text-orange-100">
                                          hamburgrp20@gmail.com
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpanded(project.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-blue-400 transition-colors border-t border-blue-500/10 mt-4"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Weniger anzeigen
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Vollständige Details anzeigen
                              </>
                            )}
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2 min-w-[200px]">
                          {canExtendProject(project) && (
                            <Button
                              onClick={() => handleExtendProject(project)}
                              disabled={extendingId === project.id}
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {extendingId === project.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <RotateCw className="w-4 h-4 mr-2" />
                              )}
                              Verlängern
                            </Button>
                          )}

                          {project.status === 'removed' && (
                            <Button
                              onClick={() => handleRestoreClick(project)}
                              disabled={restoringId === project.id}
                              className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {restoringId === project.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                              )}
                              Wiederherstellung
                            </Button>
                          )}
                          
                          {project.status !== 'removed' && project.status !== 'restoration_requested' && project.status !== 'blocked' && project.is_active && (
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
                              Entfernen
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-blue-500/10 bg-slate-800/20 p-6">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Send className="w-5 h-5 text-blue-400" />
                          Vollständige Projekt-Details
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Project Description */}
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Beschreibung</p>
                            <p className="text-gray-200">{project.description}</p>
                          </div>

                          {/* Email */}
                          <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Kontakt E-Mail</p>
                            <p className="text-gray-200 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-400" />
                              {project.email}
                            </p>
                          </div>

                          {/* Submission Timeline */}
                          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                            <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">Status-Timeline</p>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-full">
                                  <Send className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-white">Projekt eingereicht</p>
                                  <p className="text-xs text-gray-400">{formatDate(project.created_at)}</p>
                                </div>
                              </div>
                              
                              {project.status !== 'pending' && (
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-full ${
                                    (project.status === 'approved' && project.is_active === false) ? 'bg-orange-500/10' :
                                    project.status === 'approved' ? 'bg-green-500/10' :
                                    project.status === 'Abgelehnt' ? 'bg-red-500/10' :
                                    project.status === 'In Bearbeitung' ? 'bg-blue-500/10' :
                                    project.status === 'blocked' ? 'bg-orange-500/10' :
                                    project.status === 'removed' ? 'bg-gray-500/10' :
                                    project.status === 'restoration_requested' ? 'bg-purple-500/10' :
                                    'bg-gray-500/10'
                                  }`}>
                                    {getStatusIcon(project.status, project)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-white">Status aktualisiert: {getStatusLabel(project.status, project)}</p>
                                    <p className="text-xs text-gray-400">Aktueller Status</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* AI Review Details - Show if project has AI review data */}
                          {reviewData[project.id]?.review_type === 'ai' && (
                            <div className="p-5 bg-purple-500/5 rounded-lg border border-purple-500/20">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-purple-500/10 rounded-full">
                                    <RefreshCw className="w-5 h-5 text-purple-400" />
                                  </div>
                                  <h5 className="text-white font-semibold">🤖 KI-Prüfungsübersicht</h5>
                                </div>
                                <Button
                                  onClick={() => toggleReviewDetails(project.id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                                >
                                  {showReviewDetails[project.id] ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Ausblenden
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Details anzeigen
                                    </>
                                  )}
                                </Button>
                              </div>

                              {showReviewDetails[project.id] && reviewData[project.id] && (
                                <div className="space-y-4 mt-4 animate-fade-in-up">
                                  {/* Review Status */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-800/50 rounded-lg">
                                      <p className="text-xs text-gray-400 mb-1">Prüfungsergebnis</p>
                                      <p className={`text-sm font-bold ${reviewData[project.id].status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                                        {reviewData[project.id].status === 'approved' ? '✓ Genehmigt' : '✗ Abgelehnt'}
                                      </p>
                                    </div>
                                    <div className="p-3 bg-slate-800/50 rounded-lg">
                                      <p className="text-xs text-gray-400 mb-1">Vertrauenswert</p>
                                      <p className="text-sm font-bold text-purple-400">
                                        {reviewData[project.id].confidence_score}%
                                      </p>
                                    </div>
                                  </div>

                                  {/* Decision Reason */}
                                  <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/10">
                                    <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Entscheidungsgrund</p>
                                    <p className="text-gray-200 text-sm">{reviewData[project.id].decision_reason}</p>
                                  </div>

                                  {/* Problems Found */}
                                  {reviewData[project.id].problems && reviewData[project.id].problems.length > 0 && (
                                    <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                                      <p className="text-xs text-red-400 mb-2 font-semibold uppercase">Gefundene Probleme</p>
                                      <ul className="space-y-1">
                                        {reviewData[project.id].problems.map((problem, idx) => (
                                          <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">•</span>
                                            <span>{problem}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Recommendations */}
                                  {reviewData[project.id].recommendations && reviewData[project.id].recommendations.length > 0 && (
                                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                                      <p className="text-xs text-blue-400 mb-2 font-semibold uppercase">Empfehlungen</p>
                                      <ul className="space-y-1">
                                        {reviewData[project.id].recommendations.map((rec, idx) => (
                                          <li key={idx} className="text-sm text-blue-300 flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span>{rec}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Review Metadata */}
                                  <div className="grid grid-cols-2 gap-4">
                                    {reviewData[project.id].processing_time_minutes && (
                                      <div className="p-3 bg-slate-800/50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Prüfungsdauer</p>
                                        <p className="text-sm font-bold text-purple-400">
                                          {reviewData[project.id].processing_time_minutes} Min.
                                        </p>
                                      </div>
                                    )}
                                    {reviewData[project.id].reviewed_at && (
                                      <div className="p-3 bg-slate-800/50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Geprüft am</p>
                                        <p className="text-sm font-bold text-purple-400">
                                          {formatDate(reviewData[project.id].reviewed_at)}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {showReviewDetails[project.id] && !reviewData[project.id] && (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Remove Confirmation Dialog */}
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
                <li>Das Projekt wird aus der öffentlichen Ansicht entfernt</li>
                <li>Sie können später eine Wiederherstellung beantragen</li>
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

      {/* Restore Confirmation Dialog */}
      {showRestoreDialog && projectToRestore && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-purple-500/30 max-w-lg w-full p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <RefreshCw className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Wiederherstellung beantragen</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Möchten Sie die Wiederherstellung des Projekts <strong className="text-white">"{projectToRestore.project_name}"</strong> beantragen?
            </p>
            
            {/* Review Type Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">Prüfungstyp wählen:</label>
              <div className="space-y-3">
                {/* AI Review Option */}
                <div 
                  onClick={() => setSelectedReviewType('ai')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReviewType === 'ai' 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-gray-600 bg-slate-800/30 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedReviewType === 'ai' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-500'
                    }`}>
                      {selectedReviewType === 'ai' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">🤖 KI-Prüfung</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-semibold">
                          Schnell
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        Automatische Prüfung durch unsere KI mit detaillierter Übersicht
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-300 font-semibold">10-60 Minuten</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Review Option */}
                <div 
                  onClick={() => setSelectedReviewType('team')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReviewType === 'team' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 bg-slate-800/30 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedReviewType === 'team' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-500'
                    }`}>
                      {selectedReviewType === 'team' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">👥 Teamler-Prüfung</span>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold">
                          Persönlich
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        Manuelle Prüfung durch unser erfahrenes Team
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-blue-300 font-semibold">3-7 Tage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${selectedReviewType === 'ai' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-blue-500/10 border-blue-500/20'} border rounded-lg p-4 mb-6`}>
              <p className={`${selectedReviewType === 'ai' ? 'text-purple-300' : 'text-blue-300'} text-sm font-semibold mb-2`}>
                ℹ️ Hinweise:
              </p>
              <ul className={`${selectedReviewType === 'ai' ? 'text-purple-300' : 'text-blue-300'} text-sm space-y-1 list-disc list-inside`}>
                {selectedReviewType === 'ai' ? (
                  <>
                    <li>KI-Prüfung erfolgt automatisch</li>
                    <li>Sie erhalten eine detaillierte Prüfungsübersicht per E-Mail</li>
                    <li>Entscheidung innerhalb von 10-60 Minuten</li>
                    <li>Automatische Genehmigung oder Ablehnung</li>
                  </>
                ) : (
                  <>
                    <li>Ihr Antrag wird persönlich vom Team geprüft</li>
                    <li>Sie erhalten eine E-Mail-Benachrichtigung über die Entscheidung</li>
                    <li>Die Bearbeitungszeit beträgt in der Regel 3-7 Tage</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelRestore}
                variant="outline"
                className="flex-1 border-gray-500 text-white hover:bg-gray-500/20"
              >
                Abbrechen
              </Button>
              <Button
                onClick={confirmRestore}
                className={`flex-1 ${selectedReviewType === 'ai' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Jetzt beantragen
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
