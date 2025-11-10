'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  User, 
  FolderOpen, 
  MessageCircle,
  Mail,
  Globe,
  Search,
  CheckCircle,
  BookOpen,
  LifeBuoy,
  LogIn,
  LogOut,
  Home
} from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { useAuth } from '@/contexts/AuthContext'

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const { user, signOut } = useAuth()

  const faqCategories = [
    {
      id: 'technical',
      name: 'Technische Probleme',
      icon: <Code className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'account',
      name: 'Account-Fragen',
      icon: <User className="w-5 h-5" />,
      color: 'cyan'
    },
    {
      id: 'projects',
      name: 'Projekt-Anfragen',
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'indigo'
    },
    {
      id: 'general',
      name: 'Allgemeine Fragen',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'purple'
    }
  ]

  const faqs = [
    // Technische Probleme
    {
      category: 'technical',
      question: 'Die Webseite lädt nicht richtig. Was kann ich tun?',
      answer: 'Bitte versuchen Sie folgende Schritte: 1) Leeren Sie Ihren Browser-Cache (Strg+Shift+Entf), 2) Probieren Sie einen anderen Browser aus, 3) Stellen Sie sicher, dass JavaScript aktiviert ist, 4) Überprüfen Sie Ihre Internetverbindung. Falls das Problem weiterhin besteht, kontaktieren Sie uns bitte über das Kontaktformular unten.'
    },
    {
      category: 'technical',
      question: 'Mein Projekt wird nicht korrekt angezeigt. Was soll ich tun?',
      answer: 'Überprüfen Sie zunächst, ob Ihr Projekt den richtigen Status hat (Genehmigt und Aktiv). Stellen Sie sicher, dass alle Projektinformationen vollständig ausgefüllt sind. Falls das Problem weiterhin besteht, kontaktieren Sie uns mit der Projekt-ID, damit wir das Problem untersuchen können.'
    },
    {
      category: 'technical',
      question: 'Ich erhalte eine Fehlermeldung beim Hochladen. Warum?',
      answer: 'Fehlermeldungen beim Hochladen können verschiedene Ursachen haben: 1) Die Datei ist zu groß (max. 5MB), 2) Das Dateiformat wird nicht unterstützt, 3) Ihre Internetverbindung wurde unterbrochen. Bitte überprüfen Sie diese Punkte und versuchen Sie es erneut.'
    },
    {
      category: 'technical',
      question: 'Welche Browser werden unterstützt?',
      answer: 'Unsere Plattform unterstützt die aktuellen Versionen von Chrome, Firefox, Safari, Edge und Opera. Für die beste Performance empfehlen wir Chrome oder Firefox. Bitte stellen Sie sicher, dass Sie die neueste Version Ihres Browsers verwenden.'
    },

    // Account-Fragen
    {
      category: 'account',
      question: 'Wie erstelle ich einen Account?',
      answer: 'Klicken Sie auf "Anmelden" in der oberen rechten Ecke. Sie werden dann zur Anmeldeseite weitergeleitet, wo Sie sich mit Ihrer E-Mail-Adresse und einem Passwort registrieren können. Nach der Registrierung erhalten Sie eine Bestätigungs-E-Mail.'
    },
    {
      category: 'account',
      question: 'Ich habe mein Passwort vergessen. Was nun?',
      answer: 'Klicken Sie auf der Anmeldeseite auf "Passwort vergessen?". Geben Sie Ihre E-Mail-Adresse ein, und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts. Überprüfen Sie auch Ihren Spam-Ordner, falls Sie keine E-Mail erhalten.'
    },
    {
      category: 'account',
      question: 'Kann ich meine E-Mail-Adresse ändern?',
      answer: 'Ja, Sie können Ihre E-Mail-Adresse in Ihren Kontoeinstellungen ändern. Gehen Sie zu "Meine Projekte" und dann zu Ihren Profileinstellungen. Beachten Sie, dass Sie die Änderung per E-Mail bestätigen müssen.'
    },
    {
      category: 'account',
      question: 'Wie lösche ich meinen Account?',
      answer: 'Um Ihren Account zu löschen, kontaktieren Sie uns bitte über das Kontaktformular mit dem Betreff "Account-Löschung". Wir werden Ihre Anfrage innerhalb von 48 Stunden bearbeiten. Beachten Sie, dass alle Ihre Daten und Projekte unwiderruflich gelöscht werden.'
    },
    {
      category: 'account',
      question: 'Ist die Plattform wirklich kostenlos?',
      answer: 'Ja! EHE Community Webseite Studio ist eine völlig kostenlose Plattform für Community-Projekte. Es fallen keine versteckten Kosten oder Gebühren an. Wir sind eine Community-getriebene Initiative.'
    },

    // Projekt-Anfragen
    {
      category: 'projects',
      question: 'Wie reiche ich ein Projekt ein?',
      answer: 'Klicken Sie auf "Projekt einreichen" auf der Startseite oder gehen Sie zu "Projekt-Anfrage" im Menü. Füllen Sie das Formular mit allen relevanten Informationen zu Ihrem Projekt aus. Nach der Einreichung wird Ihr Projekt von unserem Team überprüft.'
    },
    {
      category: 'projects',
      question: 'Wie lange dauert die Genehmigung meines Projekts?',
      answer: 'Die Überprüfung und Genehmigung eines Projekts dauert in der Regel 2-5 Werktage. Sie erhalten eine E-Mail-Benachrichtigung, sobald Ihr Projekt genehmigt oder abgelehnt wurde. Bei Rückfragen werden wir Sie kontaktieren.'
    },
    {
      category: 'projects',
      question: 'Kann ich mein Projekt nach der Einreichung noch bearbeiten?',
      answer: 'Ja, Sie können Ihr Projekt in "Meine Projekte" jederzeit bearbeiten. Größere Änderungen müssen möglicherweise erneut genehmigt werden. Sie werden darüber per E-Mail informiert.'
    },
    {
      category: 'projects',
      question: 'Welche Arten von Projekten werden akzeptiert?',
      answer: 'Wir akzeptieren alle Community-Projekte, die legal sind und unseren Nutzungsbedingungen entsprechen. Dies umfasst Discord-Bots, Webanwendungen, Tools, Spiele und andere digitale Projekte. Kommerzielle Projekte müssen klar als solche gekennzeichnet sein.'
    },
    {
      category: 'projects',
      question: 'Mein Projekt wurde abgelehnt. Warum?',
      answer: 'Projekte können aus verschiedenen Gründen abgelehnt werden: Verstoß gegen Nutzungsbedingungen, unvollständige Informationen, unangemessene Inhalte oder Duplikate. Sie erhalten eine E-Mail mit der Begründung. Sie können das Projekt überarbeiten und erneut einreichen.'
    },

    // Allgemeine Fragen
    {
      category: 'general',
      question: 'Was ist EHE Community Webseite Studio?',
      answer: 'EHE Community Webseite Studio ist eine kostenlose Plattform, die Community-Projekte sichtbar macht. Wir entwickeln keine Projekte, sondern bieten eine professionelle Bühne für bestehende Community-Projekte, damit sie von mehr Menschen gefunden und genutzt werden können.'
    },
    {
      category: 'general',
      question: 'Wer steht hinter der Plattform?',
      answer: 'Wir sind eine engagierte Community von Entwicklern und Enthusiasten, die Community-Projekte fördern möchten. Die Plattform wird ehrenamtlich betrieben und ist nicht kommerziell.'
    },
    {
      category: 'general',
      question: 'Wie kann ich die Plattform unterstützen?',
      answer: 'Sie können uns unterstützen, indem Sie: 1) Die Plattform in Ihrer Community bekannt machen, 2) Qualitativ hochwertige Projekte einreichen, 3) Feedback und Verbesserungsvorschläge geben, 4) Andere Community-Mitglieder unterstützen.'
    },
    {
      category: 'general',
      question: 'Gibt es eine Community oder einen Discord-Server?',
      answer: 'Ja! Wir haben einen aktiven Discord-Server, auf dem Sie sich mit anderen Community-Mitgliedern austauschen können. Den Link finden Sie in unseren Projekten oder kontaktieren Sie uns für eine Einladung.'
    },
    {
      category: 'general',
      question: 'Wie kann ich Fehler oder Probleme melden?',
      answer: 'Bitte nutzen Sie das Kontaktformular unten auf dieser Seite, um Fehler oder Probleme zu melden. Beschreiben Sie das Problem so detailliert wie möglich und fügen Sie Screenshots hinzu, wenn möglich. Wir werden uns schnellstmöglich darum kümmern.'
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/95 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <LifeBuoy className="w-10 h-10 text-blue-400 relative group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  EHE Support
                </span>
                <span className="text-xs text-blue-300/70">Wir helfen Ihnen gerne</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#faq" className="text-white hover:text-blue-400 transition-colors font-medium flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </a>
              <a href="#contact" className="text-white hover:text-blue-400 transition-colors font-medium flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Kontakt</span>
              </a>
              <Link href="/projekte" className="text-white hover:text-blue-400 transition-colors font-medium flex items-center space-x-2">
                <FolderOpen className="w-4 h-4" />
                <span>Projekte</span>
              </Link>
              
              {user ? (
                <>
                  <Link href="/meine-projekte" className="text-white hover:text-blue-400 transition-colors font-medium">
                    Meine Projekte
                  </Link>
                  <Button
                    onClick={signOut}
                    size="sm"
                    variant="outline"
                    className="border-blue-400 text-white hover:bg-blue-500/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Anmelden
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block animate-bounce">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30"></div>
                <LifeBuoy className="w-20 h-20 text-blue-400 relative animate-spin-slow" style={{ animationDuration: '8s' }} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="inline-block">
                <span className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold backdrop-blur-sm shadow-lg shadow-blue-500/20">
                  🎯 24/7 Support verfügbar
                </span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Willkommen im
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Support Center
                </span>
              </h1>
              <p className="text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                Durchsuchen Sie unsere umfangreiche Wissensdatenbank oder kontaktieren Sie unser Support-Team
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex flex-col items-center space-y-2">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  <div className="text-3xl font-bold text-white">25+</div>
                  <div className="text-sm text-gray-300">FAQ Artikel</div>
                </div>
              </Card>
              <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-cyan-400" />
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-gray-300">Zufriedenheit</div>
                </div>
              </Card>
              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex flex-col items-center space-y-2">
                  <Mail className="w-8 h-8 text-blue-400" />
                  <div className="text-3xl font-bold text-white">&lt;2h</div>
                  <div className="text-sm text-gray-300">Antwortzeit</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-2 shadow-2xl shadow-blue-500/10">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-400" />
                <input
                  type="text"
                  placeholder="Suchen Sie nach Artikeln, FAQs oder Lösungen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-slate-800/50 border-2 border-blue-500/30 rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all"
                />
                {searchTerm && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-blue-300 font-semibold">
                      {filteredFaqs.length} Ergebnisse
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card
                onClick={() => setActiveCategory('all')}
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeCategory === 'all' 
                    ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-900/50 border-blue-500/20 hover:bg-slate-900/70'
                } backdrop-blur-xl`}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Alle</span>
                </div>
              </Card>
              {faqCategories.map((category) => (
                <Card
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    activeCategory === category.id 
                      ? `bg-${category.color}-500/20 border-${category.color}-400 shadow-lg shadow-${category.color}-500/30` 
                      : 'bg-slate-900/50 border-blue-500/20 hover:bg-slate-900/70'
                  } backdrop-blur-xl`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-${category.color}-400`}>{category.icon}</div>
                    <span className="font-semibold text-white text-sm">{category.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Häufig gestellte Fragen
            </h2>
            
            {filteredFaqs.length === 0 ? (
              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-8 text-center">
                <p className="text-gray-300 text-lg">Keine Ergebnisse gefunden. Versuchen Sie einen anderen Suchbegriff.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const category = faqCategories.find(cat => cat.id === faq.category)
                  return (
                    <Card
                      key={index}
                      className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full p-6 text-left flex items-start justify-between space-x-4 hover:bg-slate-900/30 transition-colors"
                      >
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`text-${category.color}-400 mt-1 flex-shrink-0`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                            {expandedFaq === index && (
                              <p className="text-gray-300 mt-4 leading-relaxed">{faq.answer}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {expandedFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                      </button>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Weitere Hilfe benötigt?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:bg-slate-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <Mail className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">E-Mail Support</h3>
                <p className="text-gray-300 mb-4">
                  Kontaktieren Sie uns direkt per E-Mail für detaillierte Anfragen
                </p>
                <a 
                  href="mailto:hamburgrp20@gmail.com"
                  className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                >
                  hamburgrp20@gmail.com
                </a>
              </Card>

              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:bg-slate-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <FolderOpen className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Projekt-Hilfe</h3>
                <p className="text-gray-300 mb-4">
                  Benötigen Sie Hilfe bei Ihrem Projekt?
                </p>
                <Link 
                  href="/meine-projekte"
                  className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
                >
                  Zu meinen Projekten →
                </Link>
              </Card>

              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-6 hover:bg-slate-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Status</h3>
                <p className="text-gray-300 mb-4">
                  Alle Systeme laufen normal
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">Operational</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Kontaktieren Sie uns
              </h2>
              <p className="text-xl text-white/90">
                Haben Sie eine Frage, die nicht in den FAQ beantwortet wurde? Schreiben Sie uns!
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/90 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50"></div>
                  <LifeBuoy className="w-10 h-10 text-blue-400 relative" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">EHE Support</span>
                  <span className="text-sm text-blue-300/70">Ihr Support Center</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Professioneller Support für die EHE Community - Wir sind hier, um Ihnen zu helfen. 
                Durchsuchen Sie unsere FAQ oder kontaktieren Sie uns direkt.
              </p>
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:hamburgrp20@gmail.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                  hamburgrp20@gmail.com
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-blue-400 text-lg">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#faq" className="text-gray-300 hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300 group">
                    <HelpCircle className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300 group">
                    <Mail className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                    Kontakt
                  </a>
                </li>
                <li>
                  <Link href="/projekte" className="text-gray-300 hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300 group">
                    <FolderOpen className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                    Projekte
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300 group">
                    <LogIn className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                    Anmelden
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-blue-400 text-lg">Rechtliches</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/impressum" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/nutzungsbedingungen" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    Nutzungsbedingungen
                  </Link>
                </li>
                <li>
                  <Link href="/widerspruch" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                    Widerspruch
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-500/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-300 text-center md:text-left">
                &copy; 2025 EHE Community Support Center. Alle Rechte vorbehalten.
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-semibold">Alle Systeme betriebsbereit</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
