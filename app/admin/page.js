'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Globe, Loader2, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, Search, Filter, ArrowUpDown, TrendingUp, FileText, Mail, ExternalLink, Lock, Unlock, RotateCcw, Trash2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [projectToBlock, setProjectToBlock] = useState(null)
  const [blockReason, setBlockReason] = useState('')
  const [blockedBy, setBlockedBy] = useState('')
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
    filterAndSortRequests()
  }, [requests, searchQuery, statusFilter, sortBy])

  const filterAndSortRequests = () => {
    let filtered = [...requests]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter)
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
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'name-asc':
        filtered.sort((a, b) => a.project_name.localeCompare(b.project_name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.project_name.localeCompare(a.project_name))
        break
      case 'status':
        const statusOrder = { 'pending': 0, 'In Bearbeitung': 1, 'approved': 2, 'Abgelehnt': 3 }
        filtered.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99))
        break
    }

    setFilteredRequests(filtered)
  }

  const statistics = useMemo(() => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      inProgress: requests.filter(r => r.status === 'In Bearbeitung').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'Abgelehnt').length,
      removed: requests.filter(r => r.status === 'removed').length,
      restorationRequested: requests.filter(r => r.status === 'restoration_requested').length,
      blocked: requests.filter(r => r.status === 'blocked').length,
    }
    return stats
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

      // Reload requests after successful update
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
        return <RotateCcw className="w-5 h-5 text-purple-400" />
      case 'blocked':
        return <ShieldAlert className="w-5 h-5 text-orange-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
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
      case 'removed':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
      case 'restoration_requested':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'blocked':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
            <Globe className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EHE Community
            </span>
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Admin <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-300">
                Verwalten Sie alle Projekt-Anfragen
              </p>
            </div>
            <Button
              onClick={loadRequests}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-4 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Gesamt</p>
                <p className="text-2xl font-bold text-white">{statistics.total}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-yellow-500/20 backdrop-blur-xl p-4 hover:border-yellow-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Ausstehend</p>
                <p className="text-2xl font-bold text-yellow-400">{statistics.pending}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-4 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">In Bearb.</p>
                <p className="text-2xl font-bold text-blue-400">{statistics.inProgress}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-xl p-4 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Angenommen</p>
                <p className="text-2xl font-bold text-green-400">{statistics.approved}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-xl p-4 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Abgelehnt</p>
                <p className="text-2xl font-bold text-red-400">{statistics.rejected}</p>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-gray-500/20 backdrop-blur-xl p-4 hover:border-gray-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Entfernt</p>
                <p className="text-2xl font-bold text-gray-400">{statistics.removed}</p>
              </div>
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <Trash2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl p-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Wiederh.</p>
                <p className="text-2xl font-bold text-purple-400">{statistics.restorationRequested}</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <RotateCcw className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-orange-500/20 backdrop-blur-xl p-4 hover:border-orange-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Gesperrt</p>
                <p className="text-2xl font-bold text-orange-400">{statistics.blocked}</p>
              </div>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Projektname, E-Mail, Beschreibung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setStatusFilter('all')}
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className={statusFilter === 'all' 
                  ? 'bg-blue-500 text-white text-xs' 
                  : 'border-blue-500/30 text-gray-300 hover:bg-blue-500/20 text-xs'}
                size="sm"
              >
                <Filter className="w-3 h-3 mr-1" />
                Alle
              </Button>
              <Button
                onClick={() => setStatusFilter('pending')}
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                className={statusFilter === 'pending' 
                  ? 'bg-yellow-500 text-white text-xs' 
                  : 'border-yellow-500/30 text-gray-300 hover:bg-yellow-500/20 text-xs'}
                size="sm"
              >
                Ausstehend
              </Button>
              <Button
                onClick={() => setStatusFilter('In Bearbeitung')}
                variant={statusFilter === 'In Bearbeitung' ? 'default' : 'outline'}
                className={statusFilter === 'In Bearbeitung' 
                  ? 'bg-blue-500 text-white text-xs' 
                  : 'border-blue-500/30 text-gray-300 hover:bg-blue-500/20 text-xs'}
                size="sm"
              >
                In Bearbeitung
              </Button>
              <Button
                onClick={() => setStatusFilter('approved')}
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                className={statusFilter === 'approved' 
                  ? 'bg-green-500 text-white text-xs' 
                  : 'border-green-500/30 text-gray-300 hover:bg-green-500/20 text-xs'}
                size="sm"
              >
                Angenommen
              </Button>
              <Button
                onClick={() => setStatusFilter('Abgelehnt')}
                variant={statusFilter === 'Abgelehnt' ? 'default' : 'outline'}
                className={statusFilter === 'Abgelehnt' 
                  ? 'bg-red-500 text-white text-xs' 
                  : 'border-red-500/30 text-gray-300 hover:bg-red-500/20 text-xs'}
                size="sm"
              >
                Abgelehnt
              </Button>
              <Button
                onClick={() => setStatusFilter('restoration_requested')}
                variant={statusFilter === 'restoration_requested' ? 'default' : 'outline'}
                className={statusFilter === 'restoration_requested' 
                  ? 'bg-purple-500 text-white text-xs' 
                  : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/20 text-xs'}
                size="sm"
              >
                Wiederherstellung
              </Button>
              <Button
                onClick={() => setStatusFilter('blocked')}
                variant={statusFilter === 'blocked' ? 'default' : 'outline'}
                className={statusFilter === 'blocked' 
                  ? 'bg-orange-500 text-white text-xs' 
                  : 'border-orange-500/30 text-gray-300 hover:bg-orange-500/20 text-xs'}
                size="sm"
              >
                Gesperrt
              </Button>
              <Button
                onClick={() => setStatusFilter('removed')}
                variant={statusFilter === 'removed' ? 'default' : 'outline'}
                className={statusFilter === 'removed' 
                  ? 'bg-gray-500 text-white text-xs' 
                  : 'border-gray-500/30 text-gray-300 hover:bg-gray-500/20 text-xs'}
                size="sm"
              >
                Entfernt
              </Button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="date-desc">Neueste zuerst</option>
              <option value="date-asc">Älteste zuerst</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="status">Nach Status</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-blue-500/10">
            <p className="text-sm text-gray-400">
              {filteredRequests.length} von {requests.length} Projekt{requests.length !== 1 ? 'en' : ''} {searchQuery || statusFilter !== 'all' ? 'gefunden' : 'gesamt'}
            </p>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Keine passenden Projekte gefunden' : 'Keine Anfragen vorhanden'}
            </h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Versuchen Sie es mit anderen Suchkriterien oder Filtern.'
                : 'Es wurden noch keine Projekt-Anfragen gestellt.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 p-6">
                  {/* Left Side - Project Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header with Status */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white truncate">
                            {request.project_name}
                          </h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border flex-shrink-0 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="text-xs font-semibold">{getStatusLabel(request.status)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(request.created_at).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Projekt-Typ</p>
                          <p className="text-sm text-white font-medium">{request.project_type}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Kontakt</p>
                          <a 
                            href={`mailto:${request.email}`}
                            className="text-sm text-blue-300 hover:text-blue-200 font-medium break-all"
                          >
                            {request.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Project Link */}
                    {request.project_link && (
                      <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                            <ExternalLink className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-1">Projekt-Link</p>
                            <a 
                              href={request.project_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:text-blue-300 underline break-all font-medium"
                            >
                              {request.project_link}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Beschreibung</p>
                      <p className="text-sm text-gray-200 leading-relaxed">{request.description}</p>
                    </div>

                    {/* Block Info (if blocked) */}
                    {request.status === 'blocked' && request.block_reason && (
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <ShieldAlert className="w-4 h-4 text-orange-400 mt-0.5" />
                          <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Gesperrt</p>
                        </div>
                        <p className="text-sm text-orange-200 mb-2">{request.block_reason}</p>
                        {request.blocked_by && (
                          <p className="text-xs text-gray-400">Gesperrt von: {request.blocked_by}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex flex-col gap-2 lg:w-48 w-full">
                    <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                      Aktionen
                    </div>

                    {/* Standard Actions (for pending, In Bearbeitung, Abgelehnt) */}
                    {request.status !== 'blocked' && request.status !== 'restoration_requested' && request.status !== 'removed' && (
                      <>
                        <Button
                          onClick={() => updateStatus(request.id, 'In Bearbeitung')}
                          disabled={updatingId === request.id || request.status === 'In Bearbeitung'}
                          className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                          size="sm"
                        >
                          {updatingId === request.id && request.status !== 'In Bearbeitung' ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <RefreshCw className="w-3 h-3 mr-1" />
                          )}
                          In Bearbeitung
                        </Button>
                        <Button
                          onClick={() => updateStatus(request.id, 'approved')}
                          disabled={updatingId === request.id || request.status === 'approved'}
                          className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                          size="sm"
                        >
                          {updatingId === request.id && request.status !== 'approved' ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          Annehmen
                        </Button>
                        <Button
                          onClick={() => updateStatus(request.id, 'Abgelehnt')}
                          disabled={updatingId === request.id || request.status === 'Abgelehnt'}
                          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                          size="sm"
                        >
                          {updatingId === request.id && request.status !== 'Abgelehnt' ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          Ablehnen
                        </Button>
                      </>
                    )}

                    {/* Restoration Actions */}
                    {request.status === 'restoration_requested' && (
                      <>
                        <Button
                          onClick={() => handleApproveRestoration(request.id)}
                          disabled={updatingId === request.id}
                          className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                          size="sm"
                        >
                          {updatingId === request.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          Genehmigen
                        </Button>
                        <Button
                          onClick={() => handleRejectRestoration(request.id)}
                          disabled={updatingId === request.id}
                          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                          size="sm"
                        >
                          {updatingId === request.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          Ablehnen
                        </Button>
                      </>
                    )}

                    {/* Block/Unblock Actions */}
                    {request.status === 'blocked' ? (
                      <Button
                        onClick={() => handleUnblock(request.id)}
                        disabled={updatingId === request.id}
                        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                        size="sm"
                      >
                        {updatingId === request.id ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                          <Unlock className="w-3 h-3 mr-1" />
                        )}
                        Entsperren
                      </Button>
                    ) : (request.status === 'approved' || request.status === 'In Bearbeitung') && (
                      <Button
                        onClick={() => handleBlockClick(request)}
                        disabled={updatingId === request.id}
                        className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs"
                        size="sm"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Sperren
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Block Project Dialog */}
        {showBlockDialog && projectToBlock && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-slate-900 border-orange-500/30 max-w-md w-full p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <Lock className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Projekt sperren</h3>
              </div>
              
              <p className="text-gray-300 mb-4">
                Sie sind dabei, das Projekt <strong className="text-white">"{projectToBlock.project_name}"</strong> zu sperren.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Sperrgrund <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Geben Sie den Grund für die Sperrung ein..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Name des Teamlers <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={blockedBy}
                    onChange={(e) => setBlockedBy(e.target.value)}
                    placeholder="Ihr Name..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                <p className="text-orange-300 text-sm font-semibold mb-2">
                  ⚠️ Wichtiger Hinweis:
                </p>
                <ul className="text-orange-300 text-sm space-y-1 list-disc list-inside">
                  <li>Das Projekt wird nicht mehr öffentlich angezeigt</li>
                  <li>Der Benutzer erhält eine E-Mail mit dem Sperrgrund</li>
                  <li>Sie können das Projekt später entsperren</li>
                </ul>
              </div>

              {error && (
                <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowBlockDialog(false)
                    setProjectToBlock(null)
                    setBlockReason('')
                    setBlockedBy('')
                  }}
                  variant="outline"
                  className="flex-1 border-gray-500 text-white hover:bg-gray-500/20"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={confirmBlock}
                  disabled={!blockReason.trim() || !blockedBy.trim()}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Projekt sperren
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
