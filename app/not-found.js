'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Globe, Mail } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                EHE Community Webseite Studio
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-[150px] lg:text-[200px] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent leading-none mb-4 animate-pulse">
              404
            </h1>
            <div className="flex items-center justify-center space-x-2 text-purple-300 mb-4">
              <Search className="w-6 h-6" />
              <p className="text-2xl font-semibold">Seite nicht gefunden</p>
            </div>
          </div>

          {/* Message Card */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl p-8 lg:p-12 mb-8 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              Ups! Diese Seite existiert nicht
            </h2>
            <p className="text-xl text-gray-200 mb-6 leading-relaxed">
              Die von Ihnen gesuchte Seite konnte leider nicht gefunden werden. 
              Sie wurde möglicherweise verschoben, gelöscht oder hat nie existiert.
            </p>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-8">
              <p className="text-purple-200 text-lg">
                💡 <strong>Tipp:</strong> Überprüfen Sie die URL auf Tippfehler oder kehren Sie zur Startseite zurück.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 text-lg px-8"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Zur Startseite
                </Button>
              </Link>
              <Link href="/#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-400 hover:bg-purple-500/20 text-white font-semibold hover:border-purple-300 text-lg px-8"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Kontakt
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="border-t border-purple-500/20 pt-8">
              <p className="text-gray-300 mb-4 font-semibold">Hilfreiche Links:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/#services"
                  className="flex items-center justify-center space-x-2 p-4 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="text-purple-400 text-2xl">🛠️</span>
                  <span className="text-white font-medium">Unsere Services</span>
                </Link>
                <Link 
                  href="/#portfolio"
                  className="flex items-center justify-center space-x-2 p-4 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="text-purple-400 text-2xl">💼</span>
                  <span className="text-white font-medium">Portfolio</span>
                </Link>
                <Link 
                  href="/#about"
                  className="flex items-center justify-center space-x-2 p-4 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="text-purple-400 text-2xl">ℹ️</span>
                  <span className="text-white font-medium">Über uns</span>
                </Link>
                <Link 
                  href="/#contact"
                  className="flex items-center justify-center space-x-2 p-4 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="text-purple-400 text-2xl">📧</span>
                  <span className="text-white font-medium">Kontakt</span>
                </Link>
              </div>
            </div>
          </Card>

          {/* Back Button */}
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur vorherigen Seite
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400 text-sm">
            © 2025 EHE Community Webseite Studio. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  )
}
