'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Globe, Loader2, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, Search, Mail, ExternalLink, Lock, Unlock, RotateCcw, Trash2, ShieldAlert, FileText, X, Calendar, User, Filter, ChevronDown, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'

export default function AdminPage() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [projectToBlock, setProjectToBlock] = useState(null)
  const [blockReason, setBlockReason] = useState('')
  const [blockedBy, setBlockedBy] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { user, loading: authLoading, isOwner } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!user || !isOwner)) {
      router.push('/')
    }
  }, [user, authLoading, isOwner, router])

  useEffect(() => {
    if (user && isOwner) {
      loadRequests()
    }
  }, [user, isOwner])

  useEffect(() => {
    filterRequests()
  }, [requests, searchQuery, activeTab, sortBy])

  const filterRequests = () => {
    let filtered = [...requests]

    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'in_progress') {
        // Handle both "in_progress" and "In Bearbeitung" for backwards compatibility
        filtered = filtered.filter(req => req.status === 'in_progress' || req.status === 'In Bearbeitung')
      } else {
        filtered = filtered.filter(req => req.status === activeTab)
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(req => 
        req.project_name.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query) ||
        req.project_type.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.project_name.localeCompare(b.project_name))
    }

    setFilteredRequests(filtered)
  }

  const statistics = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      inProgress: requests.filter(r => r.status === 'In Bearbeitung' || r.status === 'in_progress').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'Abgelehnt').length,
      removed: requests.filter(r => r.status === 'removed').length,
      restorationRequested: requests.filter(r => r.status === 'restoration_requested').length,
      blocked: requests.filter(r => r.status === 'blocked').length,
    }
  }, [requests])

  const loadRequests = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/project-requests')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden der Anfragen')
      }

      setRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (requestId, newStatus) => {
    setUpdatingId(requestId)
    
    try {
      const response = await fetch(`/api/project-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Aktualisieren des Status')
      }

      await loadRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBlockClick = (project) => {
    setProjectToBlock(project)
    setBlockReason('')
    setBlockedBy('')
    setShowBlockDialog(true)
  }

  const confirmBlock = async () => {
    if (!projectToBlock || !blockReason.trim() || !blockedBy.trim()) {
      setError('Bitte füllen Sie alle Felder aus')
      return
    }

    setUpdatingId(projectToBlock.id)
    setShowBlockDialog(false)
    
    try {
      const response = await fetch(`/api/project-requests/${projectToBlock.id}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: blockReason,
          blocked_by: blockedBy 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Sperren des Projekts')
      }

      await loadRequests()
      setProjectToBlock(null)
      setBlockReason('')
      setBlockedBy('')
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUnblock = async (requestId) => {
    setUpdatingId(requestId)
    
    try {
      const response = await fetch(`/api/project-requests/${requestId}/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Entsperren des Projekts')
      }

      await loadRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleApproveRestoration = async (requestId) => {
    setUpdatingId(requestId)
    
    try {
      const response = await fetch(`/api/project-requests/${requestId}/approve-restoration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Genehmigen der Wiederherstellung')
      }

      await loadRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRejectRestoration = async (requestId) => {
    setUpdatingId(requestId)
    
    try {
      const response = await fetch(`/api/project-requests/${requestId}/reject-restoration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Ablehnen der Wiederherstellung')
      }

      await loadRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'in_progress':
      case 'In Bearbeitung':
        return <RefreshCw className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'Abgelehnt':
        return <XCircle className="w-4 h-4" />
      case 'removed':
        return <Trash2 className="w-4 h-4" />
      case 'restoration_requested':
        return <RotateCcw className="w-4 h-4" />
      case 'blocked':
        return <ShieldAlert className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'in_progress':
      case 'In Bearbeitung':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'Abgelehnt':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      case 'removed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'restoration_requested':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20'
      case 'blocked':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend'
      case 'in_progress':
      case 'In Bearbeitung':
        return 'In Bearbeitung'
      case 'approved':
        return 'Angenommen'
      case 'Abgelehnt':
        return 'Abgelehnt'
      case 'removed':
        return 'Entfernt'
      case 'restoration_requested':
        return 'Wiederherstellung'
      case 'blocked':
        return 'Gesperrt'
      default:
        return status
    }
  }

  const tabs = [
    { id: 'all', label: 'Alle', count: statistics.total },
    { id: 'pending', label: 'Ausstehend', count: statistics.pending },
    { id: 'in_progress', label: 'In Bearbeitung', count: statistics.inProgress },
    { id: 'approved', label: 'Angenommen', count: statistics.approved },
    { id: 'Abgelehnt', label: 'Abgelehnt', count: statistics.rejected },
    { id: 'restoration_requested', label: 'Wiederherstellung', count: statistics.restorationRequested },
    { id: 'blocked', label: 'Gesperrt', count: statistics.blocked },
    { id: 'removed', label: 'Entfernt', count: statistics.removed },
  ]

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!user || !isOwner) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Globe className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-xs text-gray-400">Projekt-Verwaltung</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                  Zur Startseite
                </Button>
              </Link>
              <Button
                onClick={loadRequests}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Statistics Grid - Compact */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {[
            { label: 'Gesamt', value: statistics.total, icon: FileText, color: 'blue' },
            { label: 'Ausstehend', value: statistics.pending, icon: Clock, color: 'amber' },
            { label: 'In Bearb.', value: statistics.inProgress, icon: RefreshCw, color: 'sky' },
            { label: 'Angenommen', value: statistics.approved, icon: CheckCircle, color: 'emerald' },
            { label: 'Abgelehnt', value: statistics.rejected, icon: XCircle, color: 'rose' },
            { label: 'Entfernt', value: statistics.removed, icon: Trash2, color: 'gray' },
            { label: 'Wiederh.', value: statistics.restorationRequested, icon: RotateCcw, color: 'violet' },
            { label: 'Gesperrt', value: statistics.blocked, icon: ShieldAlert, color: 'orange' },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-slate-900/50 border-white/5 backdrop-blur p-4 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                <span className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</span>
              </div>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Suche nach Projektname, E-Mail, Beschreibung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-slate-900/50 border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
                <option value="name">Nach Name</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs - Compact */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-900/50 border border-white/5 text-gray-300 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError('')} className="hover:bg-rose-500/20 p-1 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Projects List - Compact Table Style */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchQuery || activeTab !== 'all' ? 'Keine passenden Projekte gefunden' : 'Keine Anfragen vorhanden'}
            </h3>
            <p className="text-gray-500">
              {searchQuery || activeTab !== 'all' 
                ? 'Versuchen Sie es mit anderen Suchkriterien oder Filtern.'
                : 'Es wurden noch keine Projekt-Anfragen gestellt.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="bg-slate-900/50 border-white/5 backdrop-blur hover:border-white/10 transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                    {/* Left Side - Project Info */}
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {request.project_name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateShort(request.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {request.project_type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {request.email}
                            </span>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span>{getStatusLabel(request.status)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 line-clamp-2">{request.description}</p>

                      {/* Project Link */}
                      {request.project_link && (
                        <a 
                          href={request.project_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {request.project_link.length > 50 ? request.project_link.substring(0, 50) + '...' : request.project_link}
                        </a>
                      )}

                      {/* Block Info */}
                      {request.status === 'blocked' && request.block_reason && (
                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <p className="text-xs text-orange-300 mb-1 font-semibold">Sperrgrund:</p>
                          <p className="text-xs text-orange-200">{request.block_reason}</p>
                          {request.blocked_by && (
                            <p className="text-xs text-gray-400 mt-1">von {request.blocked_by}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex lg:flex-col gap-2 min-w-[180px]">
                      {/* Standard Actions */}
                      {request.status !== 'blocked' && request.status !== 'restoration_requested' && request.status !== 'removed' && (
                        <>
                          <Button
                            onClick={() => updateStatus(request.id, 'In Bearbeitung')}
                            disabled={updatingId === request.id || request.status === 'In Bearbeitung'}
                            size="sm"
                            className="flex-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 disabled:opacity-40 text-xs h-8"
                          >
                            {updatingId === request.id && request.status !== 'In Bearbeitung' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3 mr-1" />
                                In Bearb.
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => updateStatus(request.id, 'approved')}
                            disabled={updatingId === request.id || request.status === 'approved'}
                            size="sm"
                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 disabled:opacity-40 text-xs h-8"
                          >
                            {updatingId === request.id && request.status !== 'approved' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Annehmen
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => updateStatus(request.id, 'Abgelehnt')}
                            disabled={updatingId === request.id || request.status === 'Abgelehnt'}
                            size="sm"
                            className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 disabled:opacity-40 text-xs h-8"
                          >
                            {updatingId === request.id && request.status !== 'Abgelehnt' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Ablehnen
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      {/* Restoration Actions */}
                      {request.status === 'restoration_requested' && (
                        <>
                          <Button
                            onClick={() => handleApproveRestoration(request.id)}
                            disabled={updatingId === request.id}
                            size="sm"
                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs h-8"
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Genehmigen
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleRejectRestoration(request.id)}
                            disabled={updatingId === request.id}
                            size="sm"
                            className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs h-8"
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Ablehnen
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      {/* Block/Unblock Actions */}
                      {request.status === 'blocked' ? (
                        <Button
                          onClick={() => handleUnblock(request.id)}
                          disabled={updatingId === request.id}
                          size="sm"
                          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs h-8"
                        >
                          {updatingId === request.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 mr-1" />
                              Entsperren
                            </>
                          )}
                        </Button>
                      ) : (request.status === 'approved' || request.status === 'In Bearbeitung') && (
                        <Button
                          onClick={() => handleBlockClick(request)}
                          disabled={updatingId === request.id}
                          size="sm"
                          className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs h-8"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Sperren
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Block Project Dialog */}
      {showBlockDialog && projectToBlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-orange-500/30 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Projekt sperren</h3>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              Sie sind dabei, das Projekt <strong className="text-white">"{projectToBlock.project_name}"</strong> zu sperren.
            </p>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Sperrgrund <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Geben Sie den Grund für die Sperrung ein..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Name des Teamlers <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={blockedBy}
                  onChange={(e) => setBlockedBy(e.target.value)}
                  placeholder="Ihr Name..."
                  className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="mb-3 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowBlockDialog(false)
                  setProjectToBlock(null)
                  setBlockReason('')
                  setBlockedBy('')
                }}
                variant="outline"
                size="sm"
                className="flex-1 border-white/10 text-white hover:bg-white/5"
              >
                Abbrechen
              </Button>
              <Button
                onClick={confirmBlock}
                disabled={!blockReason.trim() || !blockedBy.trim()}
                size="sm"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                Projekt sperren
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
