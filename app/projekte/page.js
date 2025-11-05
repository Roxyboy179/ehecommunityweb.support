'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, ArrowRight, Loader2, Calendar, Tag, Mail } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function ProjektePage() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 })
  const [projectsRef, projectsVisible] = useScrollAnimation({ threshold: 0.1 })

  useEffect(() => {
    fetchApprovedProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [searchQuery, projects])

  const fetchApprovedProjects = async () => {
    try {
      const response = await fetch('/api/projects/approved')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden der Projekte')
      }

      setProjects(data)
      setFilteredProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = projects.filter(project => 
      project.project_name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.project_type.toLowerCase().includes(query)
    )
    setFilteredProjects(filtered)
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
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-white hover:bg-blue-500/20"
                >
                  Zurück zur Startseite
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
              Unsere <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Community-Projekte</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Hier werden alle angenommenen Community-Projekte sichtbar gemacht. 
              Wir erstellen keine Projekte, sondern geben ihnen eine Plattform zur Präsentation.
            </p>

            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto ${headerVisible ? 'animate-fade-in-up stagger-1' : ''}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Projekte durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-900/50 border border-blue-500/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  {filteredProjects.length} Projekt{filteredProjects.length !== 1 ? 'e' : ''} gefunden
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          ) : error ? (
            <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-xl p-8 text-center">
              <p className="text-red-400 text-lg">{error}</p>
            </Card>
          ) : filteredProjects.length === 0 ? (
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-12 text-center">
              <Globe className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white">
                {searchQuery ? 'Keine Projekte gefunden' : 'Noch keine Projekte'}
              </h3>
              <p className="text-gray-300 mb-6">
                {searchQuery 
                  ? 'Versuchen Sie es mit einem anderen Suchbegriff.'
                  : 'Aktuell gibt es noch keine angenommenen Projekte. Schauen Sie später wieder vorbei!'}
              </p>
              {!searchQuery && (
                <Link href="/projekt-anfrage">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Projekt einreichen
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 ${
                    projectsVisible ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: projectsVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <div className="p-6">
                    {/* Project Type Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <Tag className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">
                          {getProjectTypeLabel(project.project_type)}
                        </span>
                      </div>
                    </div>

                    {/* Project Name */}
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {project.project_name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Link */}
                    {project.project_link && (
                      <div className="mb-4">
                        <a 
                          href={project.project_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors text-sm font-medium"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Projekt besuchen</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center space-x-2 text-sm text-gray-400 border-t border-blue-500/10 pt-4">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-blue-500/20">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Haben Sie ein <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Community-Projekt?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Reichen Sie Ihr Projekt ein und machen Sie es für unsere Community sichtbar!
            </p>
            <Link href="/projekt-anfrage">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg px-8 py-6 shadow-lg shadow-blue-500/30">
                Projekt einreichen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

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
