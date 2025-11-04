'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cookie, X, Settings } from 'lucide-react'
import { useCookies } from '@/contexts/CookieContext'
import Link from 'next/link'

export default function CookieBanner() {
  const { showBanner, acceptCookies, rejectCookies, acceptNecessaryOnly } = useCookies()
  const [showDetails, setShowDetails] = useState(false)

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 animate-fade-in">
      <Card className="max-w-4xl w-full bg-slate-900/95 border-blue-500/30 backdrop-blur-xl p-6 mb-4 shadow-2xl animate-slide-up">
        <div className="flex items-start space-x-4">
          <Cookie className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">🍪 Cookie-Einstellungen</h3>
            
            {!showDetails ? (
              <>
                <p className="text-gray-200 mb-4 text-base leading-relaxed">
                  Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
                  Dazu gehören notwendige Cookies für die Funktionalität der Seite (z.B. Authentifizierung).
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  Weitere Informationen finden Sie in unserer{' '}
                  <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline">
                    Datenschutzerklärung
                  </Link>.
                </p>
              </>
            ) : (
              <div className="space-y-4 mb-4">
                <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Notwendige Cookies (erforderlich)
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich, 
                    wie z.B. Authentifizierung und Sicherheit.
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2 flex items-center">
                    <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                    Analyse-Cookies (optional)
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Aktuell verwenden wir keine Analyse- oder Marketing-Cookies.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={acceptCookies}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
              >
                Alle akzeptieren
              </Button>
              <Button
                onClick={acceptNecessaryOnly}
                variant="outline"
                className="border-blue-400 text-white hover:bg-blue-500/20"
              >
                Nur notwendige
              </Button>
              <Button
                onClick={rejectCookies}
                variant="outline"
                className="border-gray-400 text-white hover:bg-gray-500/20"
              >
                Ablehnen
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showDetails ? 'Weniger' : 'Details'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
