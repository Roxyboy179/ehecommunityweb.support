'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Globe, Loader2, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
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
      case 'Angenommen':
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
      case 'Angenommen':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'Abgelehnt':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
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
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Globe className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EHE Community
            </span>
          </Link>
          <div className="flex items-center justify-between">
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

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Keine Anfragen vorhanden
            </h3>
            <p className="text-gray-400">
              Es wurden noch keine Projekt-Anfragen gestellt.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:border-blue-500/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Project Name & Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {request.project_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(request.created_at).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-sm font-semibold">{request.status}</span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Typ:</span>{' '}
                        <span className="text-white font-medium">{request.project_type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">E-Mail:</span>{' '}
                        <span className="text-blue-300">{request.email}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Beschreibung:</p>
                      <p className="text-white">{request.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2 min-w-[200px]">
                    <Button
                      onClick={() => updateStatus(request.id, 'In Bearbeitung')}
                      disabled={updatingId === request.id || request.status === 'In Bearbeitung'}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                    >
                      {updatingId === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'In Bearbeitung'
                      )}
                    </Button>
                    <Button
                      onClick={() => updateStatus(request.id, 'Angenommen')}
                      disabled={updatingId === request.id || request.status === 'Angenommen'}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                    >
                      {updatingId === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Annehmen'
                      )}
                    </Button>
                    <Button
                      onClick={() => updateStatus(request.id, 'Abgelehnt')}
                      disabled={updatingId === request.id || request.status === 'Abgelehnt'}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                    >
                      {updatingId === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Ablehnen'
                      )}
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
