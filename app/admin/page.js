'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Globe, Loader2, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw, Search, Filter, ArrowUpDown, TrendingUp, FileText, Mail, ExternalLink } from 'lucide-react'
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Gesamt</p>
                <p className="text-3xl font-bold text-white">{statistics.total}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-yellow-500/20 backdrop-blur-xl p-6 hover:border-yellow-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Ausstehend</p>
                <p className="text-3xl font-bold text-yellow-400">{statistics.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">In Bearbeitung</p>
                <p className="text-3xl font-bold text-blue-400">{statistics.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-xl p-6 hover:border-green-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Angenommen</p>
                <p className="text-3xl font-bold text-green-400">{statistics.approved}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-xl p-6 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Abgelehnt</p>
                <p className="text-3xl font-bold text-red-400">{statistics.rejected}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
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
                  ? 'bg-blue-500 text-white' 
                  : 'border-blue-500/30 text-gray-300 hover:bg-blue-500/20'}
              >
                <Filter className="w-4 h-4 mr-2" />
                Alle
              </Button>
              <Button
                onClick={() => setStatusFilter('pending')}
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                className={statusFilter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'border-yellow-500/30 text-gray-300 hover:bg-yellow-500/20'}
              >
                Ausstehend
              </Button>
              <Button
                onClick={() => setStatusFilter('In Bearbeitung')}
                variant={statusFilter === 'In Bearbeitung' ? 'default' : 'outline'}
                className={statusFilter === 'In Bearbeitung' 
                  ? 'bg-blue-500 text-white' 
                  : 'border-blue-500/30 text-gray-300 hover:bg-blue-500/20'}
              >
                In Bearbeitung
              </Button>
              <Button
                onClick={() => setStatusFilter('approved')}
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                className={statusFilter === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : 'border-green-500/30 text-gray-300 hover:bg-green-500/20'}
              >
                Angenommen
              </Button>
              <Button
                onClick={() => setStatusFilter('Abgelehnt')}
                variant={statusFilter === 'Abgelehnt' ? 'default' : 'outline'}
                className={statusFilter === 'Abgelehnt' 
                  ? 'bg-red-500 text-white' 
                  : 'border-red-500/30 text-gray-300 hover:bg-red-500/20'}
              >
                Abgelehnt
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
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex flex-col gap-2 lg:w-48 w-full">
                    <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                      Aktionen
                    </div>
                    <Button
                      onClick={() => updateStatus(request.id, 'In Bearbeitung')}
                      disabled={updatingId === request.id || request.status === 'In Bearbeitung'}
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      size="sm"
                    >
                      {updatingId === request.id && request.status !== 'In Bearbeitung' ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      In Bearbeitung
                    </Button>
                    <Button
                      onClick={() => updateStatus(request.id, 'approved')}
                      disabled={updatingId === request.id || request.status === 'approved'}
                      className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      size="sm"
                    >
                      {updatingId === request.id && request.status !== 'approved' ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Annehmen
                    </Button>
                    <Button
                      onClick={() => updateStatus(request.id, 'Abgelehnt')}
                      disabled={updatingId === request.id || request.status === 'Abgelehnt'}
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      size="sm"
                    >
                      {updatingId === request.id && request.status !== 'Abgelehnt' ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Ablehnen
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
