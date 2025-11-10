'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Globe, Loader2, Calendar, Tag, AlertCircle, CheckCircle, Clock, XCircle, 
  RefreshCw, Trash2, AlertTriangle, ExternalLink, Mail, Send, Eye, EyeOff, 
  TimerReset, RotateCw, TrendingUp, Archive, Filter, Plus, Search, ChevronDown, ChevronUp
} from 'lucide-react'
import { formatDateToGermanTime } from '@/lib/utils'

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
  const [selectedReviewType, setSelectedReviewType] = useState('ai')
  const [extendingId, setExtendingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProjects, setExpandedProjects] = useState(new Set())
  const [reviewData, setReviewData] = useState({})
  const [showReviewDetails, setShowReviewDetails] = useState({})
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

  // Load review data for projects
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(project => {
        if ((project.status === 'approved' || project.status === 'removed' || project.status === 'restoration_requested') && !reviewData[project.id]) {
          loadReviewData(project.id)
        }
      })
    }
  }, [projects])

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

  const toggleReviewDetails = (projectId) => {
    setShowReviewDetails(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
    
    if (!reviewData[projectId]) {
      loadReviewData(projectId)
    }
  }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Fehler beim Entfernen')

      await loadMyProjects()
      setProjectToRemove(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, review_type: selectedReviewType }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Fehler bei Wiederherstellung')

      await loadMyProjects()
      setProjectToRestore(null)
      setSelectedReviewType('ai')
    } catch (err) {
      setError(err.message)
    } finally {
      setRestoringId(null)
    }
  }

  const handleExtendProject = async (project) => {
    if (!project.id) return
    setExtendingId(project.id)
    
    try {
      const response = await fetch(`/api/project-requests/${project.id}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Fehler beim Verlängern')

      await loadMyProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setExtendingId(null)
    }
  }

  const canExtendProject = (project) => {
    const extensionCount = project.extension_count || 0
    return extensionCount < 3 && (project.status === 'approved' && !project.is_active)
  }

  // Statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'approved' && p.is_active).length,
    pending: projects.filter(p => p.status === 'pending').length,
    expired: projects.filter(p => p.status === 'approved' && !p.is_active).length,
  }

  // Filter projects based on tab
  const filteredProjects = projects.filter(project => {
    // Search filter
    if (searchQuery && !project.project_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Tab filter
    switch (activeTab) {
      case 'active':
        return project.status === 'approved' && project.is_active
      case 'pending':
        return project.status === 'pending' || project.status === 'In Bearbeitung'
      case 'expired':
        return project.status === 'approved' && !project.is_active
      case 'removed':
        return project.status === 'removed' || project.status === 'restoration_requested'
      default:
        return true
    }
  })

  const getStatusBadge = (project) => {
    if (project.status === 'approved' && project.is_active) {
      return { label: 'Aktiv', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle }
    }
    if (project.status === 'approved' && !project.is_active) {
      return { label: 'Abgelaufen', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: TimerReset }
    }
    if (project.status === 'pending') {
      return { label: 'Ausstehend', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock }
    }
    if (project.status === 'In Bearbeitung') {
      return { label: 'In Bearbeitung', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: RefreshCw }
    }
    if (project.status === 'removed') {
      return { label: 'Entfernt', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Archive }
    }
    if (project.status === 'restoration_requested') {
      return { label: 'Wiederherstellung beantragt', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: RefreshCw }
    }
    if (project.status === 'Abgelehnt') {
      return { label: 'Abgelehnt', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle }
    }
    if (project.status === 'blocked') {
      return { label: 'Gesperrt', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: AlertTriangle }
    }
    return { label: project.status, color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Tag }
  }

  const formatDate = (dateString) => {
    return formatDateToGermanTime(dateString)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EHE Community
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/projekt-anfrage">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Neues Projekt
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-blue-400 text-white hover:bg-blue-500/20">
                  Startseite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header with Stats */}
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              Meine <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projekte</span>
            </h1>
            <p className="text-gray-300">Verwalten Sie Ihre eingereichten Projekt-Anfragen</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-blue-500/30 p-5 hover:border-blue-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 text-sm font-semibold">Gesamt</span>
                <Archive className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.total}</p>
            </Card>

            <Card className="bg-slate-800 border-green-500/30 p-5 hover:border-green-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 text-sm font-semibold">Aktiv</span>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.active}</p>
            </Card>

            <Card className="bg-slate-800 border-yellow-500/30 p-5 hover:border-yellow-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 text-sm font-semibold">Ausstehend</span>
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.pending}</p>
            </Card>

            <Card className="bg-slate-800 border-orange-500/30 p-5 hover:border-orange-500/50 transition-all shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 text-sm font-semibold">Abgelaufen</span>
                <TimerReset className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-4xl font-bold text-white">{stats.expired}</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Projekte durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'active', 'pending', 'expired', 'removed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-800 text-gray-100 hover:bg-slate-700 border border-blue-500/30'
                  }`}
                >
                  {tab === 'all' ? 'Alle' : tab === 'active' ? 'Aktiv' : tab === 'pending' ? 'Ausstehend' : tab === 'expired' ? 'Abgelaufen' : 'Entfernt'}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="bg-red-900/30 border-red-500/50 p-4 mb-6 shadow-lg">
              <div className="flex items-center gap-2 text-red-100">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">{error}</p>
              </div>
            </Card>
          )}

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="bg-slate-800 border-blue-500/30 p-12 text-center shadow-lg">
              <Archive className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white">Keine Projekte gefunden</h3>
              <p className="text-gray-200 mb-6">
                {searchQuery ? 'Keine Projekte entsprechen Ihrer Suche.' : 'Beginnen Sie, indem Sie Ihr erstes Projekt einreichen.'}
              </p>
              <Link href="/projekt-anfrage">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Projekt einreichen
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((project) => {
                const statusBadge = getStatusBadge(project)
                const StatusIcon = statusBadge.icon
                const isExpanded = expandedProjects.has(project.id)

                return (
                  <Card key={project.id} className="bg-slate-800 border-blue-500/30 hover:border-blue-500/50 transition-all overflow-hidden shadow-lg">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">{project.project_name}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-200">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">{formatDateToGermanTime(project.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="w-4 h-4" />
                                  <span className="font-medium">{project.project_type}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-bold ${statusBadge.color}`}>
                              <StatusIcon className="w-5 h-5" />
                              {statusBadge.label}
                            </div>
                          </div>

                          <p className="text-gray-100 mb-4 line-clamp-2 text-base">{project.description}</p>

                          {project.project_link && (
                            <a 
                              href={project.project_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm mb-4 font-semibold underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {project.project_link}
                            </a>
                          )}

                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpanded(project.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-300 hover:text-blue-400 transition-colors border-t border-blue-500/20 mt-4 font-semibold"
                          >
                            {isExpanded ? (
                              <>
                                <Eye className="w-4 h-4" />
                                Weniger Details
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Alle Details anzeigen
                              </>
                            )}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2 min-w-[180px]">
                          {project.status === 'approved' && project.is_active && (
                            <Link href="/projekte" className="flex-1">
                              <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-2 border-green-500 font-semibold shadow-lg">
                                <Eye className="w-4 h-4 mr-2" />
                                Ansehen
                              </Button>
                            </Link>
                          )}

                          {canExtendProject(project) && (
                            <Button
                              onClick={() => handleExtendProject(project)}
                              disabled={extendingId === project.id}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 font-semibold shadow-lg disabled:opacity-50"
                            >
                              {extendingId === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 font-semibold shadow-lg disabled:opacity-50"
                            >
                              {restoringId === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                              )}
                              Wiederherstellen
                            </Button>
                          )}

                          {project.status !== 'removed' && project.status !== 'restoration_requested' && project.status !== 'blocked' && project.is_active && (
                            <Button
                              onClick={() => handleRemoveClick(project)}
                              disabled={removingId === project.id}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 font-semibold shadow-lg disabled:opacity-50"
                            >
                              {removingId === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                              )}
                              Entfernen
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {isExpanded && (
                      <div className="border-t border-blue-500/20 bg-slate-900/50 p-6">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Send className="w-5 h-5 text-blue-400" />
                          Vollständige Details
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Full Description */}
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/10">
                            <p className="text-xs text-gray-300 mb-2 font-semibold uppercase">Beschreibung</p>
                            <p className="text-gray-100 text-base">{project.description}</p>
                          </div>

                          {/* Email */}
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/10">
                            <p className="text-xs text-gray-300 mb-2 font-semibold uppercase">Kontakt E-Mail</p>
                            <p className="text-gray-100 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-400" />
                              {project.email}
                            </p>
                          </div>

                          {/* Expiration Info for Active Projects */}
                          {project.status === 'approved' && project.is_active && project.expiration_date && (
                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <p className="text-xs text-blue-300 mb-3 font-semibold uppercase flex items-center gap-2">
                                <TimerReset className="w-4 h-4" />
                                Ablauf-Informationen
                              </p>
                              <div className="space-y-2 text-sm text-gray-100">
                                <p><strong>Ablaufdatum:</strong> {formatDate(project.expiration_date)}</p>
                                <p><strong>Dauer:</strong> {project.duration_months || 1} Monat(e)</p>
                                <p><strong>Verlängerungen:</strong> {project.extension_count || 0} von 3</p>
                              </div>
                            </div>
                          )}

                          {/* AI Review Details */}
                          {reviewData[project.id]?.review_type === 'ai' && (
                            <div className="p-5 bg-purple-500/10 rounded-lg border border-purple-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-purple-500/20 rounded-full">
                                    <RefreshCw className="w-5 h-5 text-purple-300" />
                                  </div>
                                  <h5 className="text-white font-bold">🤖 KI-Prüfung</h5>
                                </div>
                                <Button
                                  onClick={() => toggleReviewDetails(project.id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20 font-semibold"
                                >
                                  {showReviewDetails[project.id] ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Ausblenden
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Details
                                    </>
                                  )}
                                </Button>
                              </div>

                              {showReviewDetails[project.id] && reviewData[project.id] && (
                                <div className="space-y-4 mt-4">
                                  {/* Review Status */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-800/70 rounded-lg">
                                      <p className="text-xs text-gray-300 mb-1 font-semibold">Ergebnis</p>
                                      <p className={`text-sm font-bold ${reviewData[project.id].status === 'approved' ? 'text-green-300' : 'text-red-300'}`}>
                                        {reviewData[project.id].status === 'approved' ? '✓ Genehmigt' : '✗ Abgelehnt'}
                                      </p>
                                    </div>
                                    <div className="p-3 bg-slate-800/70 rounded-lg">
                                      <p className="text-xs text-gray-300 mb-1 font-semibold">Vertrauenswert</p>
                                      <p className="text-sm font-bold text-purple-300">
                                        {reviewData[project.id].confidence_score}%
                                      </p>
                                    </div>
                                  </div>

                                  {/* Decision Reason */}
                                  {reviewData[project.id].decision_reason && (
                                    <div className="p-4 bg-slate-800/70 rounded-lg border border-purple-500/20">
                                      <p className="text-xs text-purple-300 mb-2 font-semibold uppercase">Entscheidungsgrund</p>
                                      <p className="text-gray-100 text-sm">{reviewData[project.id].decision_reason}</p>
                                    </div>
                                  )}

                                  {/* Problems */}
                                  {reviewData[project.id].problems && reviewData[project.id].problems.length > 0 && (
                                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                                      <p className="text-xs text-red-300 mb-2 font-semibold uppercase">Gefundene Probleme</p>
                                      <ul className="space-y-1">
                                        {reviewData[project.id].problems.map((problem, idx) => (
                                          <li key={idx} className="text-sm text-red-200 flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">•</span>
                                            <span>{problem}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Recommendations */}
                                  {reviewData[project.id].recommendations && reviewData[project.id].recommendations.length > 0 && (
                                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                      <p className="text-xs text-blue-300 mb-2 font-semibold uppercase">Empfehlungen</p>
                                      <ul className="space-y-1">
                                        {reviewData[project.id].recommendations.map((rec, idx) => (
                                          <li key={idx} className="text-sm text-blue-200 flex items-start gap-2">
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
                                      <div className="p-3 bg-slate-800/70 rounded-lg">
                                        <p className="text-xs text-gray-300 mb-1 font-semibold">Prüfungsdauer</p>
                                        <p className="text-sm font-bold text-purple-300">
                                          {reviewData[project.id].processing_time_minutes} Min.
                                        </p>
                                      </div>
                                    )}
                                    {reviewData[project.id].reviewed_at && (
                                      <div className="p-3 bg-slate-800/70 rounded-lg">
                                        <p className="text-xs text-gray-300 mb-1 font-semibold">Geprüft am</p>
                                        <p className="text-sm font-bold text-purple-300">
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

                          {/* Team Review Indicator */}
                          {reviewData[project.id]?.review_type === 'team' && (
                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-full">
                                  <Mail className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                  <p className="text-white font-bold">👥 Team-Prüfung durchgeführt</p>
                                  <p className="text-blue-200 text-sm">Ihr Projekt wurde manuell von unserem Team geprüft.</p>
                                </div>
                              </div>
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

      {/* Dialogs */}
      {showConfirmDialog && projectToRemove && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-red-500/50 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Projekt entfernen?</h3>
            </div>
            <p className="text-gray-100 mb-6 text-base">
              Möchten Sie <strong className="text-white">"{projectToRemove.project_name}"</strong> wirklich entfernen?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowConfirmDialog(false)} variant="outline" className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={confirmRemove} className="flex-1 bg-red-500 hover:bg-red-600">
                Entfernen
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showRestoreDialog && projectToRestore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-purple-500/50 max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-white">Wiederherstellung beantragen</h3>
            <p className="text-gray-100 mb-4 text-base">
              Projekt: <strong className="text-white">"{projectToRestore.project_name}"</strong>
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedReviewType('ai')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedReviewType === 'ai' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-500 bg-slate-700 hover:border-purple-400'
                }`}
              >
                <div className="font-bold mb-1 text-white">🤖 KI-Prüfung (10-60 Min.)</div>
                <div className="text-sm text-gray-200">Automatische Prüfung mit detaillierter Analyse</div>
              </button>

              <button
                onClick={() => setSelectedReviewType('team')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedReviewType === 'team' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-500 bg-slate-700 hover:border-blue-400'
                }`}
              >
                <div className="font-bold mb-1 text-white">👥 Team-Prüfung (3-7 Tage)</div>
                <div className="text-sm text-gray-200">Manuelle Prüfung durch unser Team</div>
              </button>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowRestoreDialog(false)} variant="outline" className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={confirmRestore} className="flex-1 bg-purple-500 hover:bg-purple-600">
                Beantragen
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-gray-300">
          <p>&copy; 2025 EHE Community Webseite Studio</p>
        </div>
      </footer>
    </div>
  )
}
