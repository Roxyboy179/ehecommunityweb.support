'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Code, Palette, Users, Zap, CheckCircle, ArrowRight, Mail, Globe, Heart } from 'lucide-react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Webseiten Entwicklung',
      description: 'Professionelle und moderne Webseiten für Unternehmen und Privatpersonen'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Design & UX',
      description: 'Ansprechendes Design mit Fokus auf Benutzererfahrung und Barrierefreiheit'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Performance',
      description: 'Schnelle Ladezeiten und optimierte Performance für beste Ergebnisse'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Support',
      description: 'Engagierte Community-Unterstützung und kontinuierliche Weiterentwicklung'
    }
  ]

  const features = [
    'Kostenlose Plattform für Community-Projekte',
    'Moderne Technologien und Frameworks',
    'Responsive Design für alle Geräte',
    'SEO-Optimierung',
    'Schnelle Entwicklungszeiten',
    'Professioneller Support'
  ]

  const portfolio = [
    {
      name: 'BotForge',
      description: 'Discord Bot Builder mit visuellem Command Builder',
      link: 'https://botforge-orcin.de',
      image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8Ymx1ZXwxNzYyMjQyNTQxfDA&ixlib=rb-4.1.0&q=85'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EHE Community Webseite Studio
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-white hover:text-blue-400 transition-colors font-medium">Services</a>
              <a href="#portfolio" className="text-white hover:text-blue-400 transition-colors font-medium">Portfolio</a>
              <a href="#about" className="text-white hover:text-blue-400 transition-colors font-medium">Über Uns</a>
              <a href="#contact" className="text-white hover:text-blue-400 transition-colors font-medium">Kontakt</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
                  Kostenlose Community Plattform
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Professionelle
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Webseiten
                </span>
                für die Community
              </h1>
              <p className="text-xl text-gray-100 leading-relaxed">
                Wir erstellen kostenlose Webseiten für Unternehmen und Privatpersonen. 
                Als Teil der EHE Community bieten wir professionelle Webentwicklung ohne Kosten.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                  <a href="#contact">Projekt Anfragen</a>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  <a href="#portfolio">Portfolio Ansehen</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610989001873-03968eed0f08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8Ymx1ZXwxNzYyMjQyNTQxfDA&ixlib=rb-4.1.0&q=85"
                  alt="Web Development"
                  className="w-full h-auto rounded-lg"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Was wir <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">bieten</span>
            </h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Professionelle Webentwicklung mit modernsten Technologien - komplett kostenlos für unsere Community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:bg-slate-900/70 transition-all duration-300 hover:scale-105 hover:border-blue-500/40"
              >
                <div className="text-blue-400 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-200">{service.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Unsere Features</h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-100">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl blur-2xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8Ymx1ZXwxNzYyMjQyNTQxfDA&ixlib=rb-4.1.0&q=85"
                    alt="Development"
                    className="relative rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Unsere <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projekte</span>
            </h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Beispiele unserer Arbeit für die Community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <Card 
                key={index}
                className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden hover:scale-105 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{project.name}</h3>
                  <p className="text-gray-200 mb-4">{project.description}</p>
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Projekt Ansehen
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </Card>
            ))}

            {/* Add more project cards as placeholders */}
            <Card className="bg-slate-900/30 border-blue-500/20 border-dashed backdrop-blur-xl p-6 flex flex-col items-center justify-center min-h-[300px] hover:bg-slate-900/40 transition-all">
              <div className="text-blue-400/50 mb-4">
                <Zap className="w-12 h-12" />
              </div>
              <p className="text-gray-200 text-center">Weitere Projekte folgen...</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-8 lg:p-12">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Über <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">EHE Community</span>
                </h2>
                <div className="space-y-4 text-gray-100 leading-relaxed">
                  <p>
                    EHE Community Webseite Studio ist eine kostenlose Plattform, die professionelle 
                    Webseiten für Unternehmen und Privatpersonen erstellt.
                  </p>
                  <p>
                    Wir sind eine engagierte Community von Entwicklern und Designern, die ihre 
                    Fähigkeiten einsetzen, um hochwertige Webprojekte zu realisieren - ohne Kosten 
                    für unsere Community-Mitglieder.
                  </p>
                  <p>
                    Unser Ziel ist es, moderne Webtechnologien für alle zugänglich zu machen und 
                    gemeinsam großartige digitale Erlebnisse zu schaffen.
                  </p>
                </div>
                <div className="mt-8 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-slate-300">Community-getrieben</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">Kostenlos</span>
                  </div>
                </div>
              </div>
              <div className="relative h-full min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl" />
                <img 
                  src="https://images.pexels.com/photos/4957793/pexels-photo-4957793.jpeg"
                  alt="Community"
                  className="relative w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Projekt <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">anfragen</span>
              </h2>
              <p className="text-xl text-slate-300">
                Haben Sie ein Projekt im Sinn? Kontaktieren Sie uns!
              </p>
            </div>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">E-Mail Kontakt</h3>
                    <a 
                      href="mailto:hamburgrp20@gmail.com"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                    >
                      hamburgrp20@gmail.com
                    </a>
                    <p className="text-slate-400 mt-2">Antwortzeit: In der Regel innerhalb von 48 Stunden</p>
                  </div>
                </div>

                <div className="border-t border-blue-500/20 pt-6">
                  <h3 className="text-xl font-bold mb-4">Was können Sie anfragen?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Neue Webseiten-Projekte</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Technischer Support</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Allgemeine Fragen</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Rechtliche Anfragen</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">EHE Community Webseite Studio</span>
              </div>
              <p className="text-slate-400 mb-4">
                Kostenlose Plattform für professionelle Webseiten - von der Community, für die Community.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-slate-400 hover:text-blue-400 transition-colors">Services</a></li>
                <li><a href="#portfolio" className="text-slate-400 hover:text-blue-400 transition-colors">Portfolio</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-blue-400 transition-colors">Über Uns</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-blue-400 transition-colors">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-blue-400">Rechtliches</h4>
              <ul className="space-y-2">
                <li><Link href="/impressum" className="text-slate-400 hover:text-blue-400 transition-colors">Impressum</Link></li>
                <li><Link href="/datenschutz" className="text-slate-400 hover:text-blue-400 transition-colors">Datenschutz</Link></li>
                <li><Link href="/nutzungsbedingungen" className="text-slate-400 hover:text-blue-400 transition-colors">Nutzungsbedingungen</Link></li>
                <li><Link href="/widerspruch" className="text-slate-400 hover:text-blue-400 transition-colors">Widerspruch</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/20 pt-8 text-center text-slate-400">
            <p>&copy; 2025 EHE Community Webseite Studio. Alle Rechte vorbehalten.</p>
            <p className="text-sm mt-2">Private Nutzung - Keine kommerzielle Verwendung</p>
          </div>
        </div>
      </footer>
    </div>
  )
}