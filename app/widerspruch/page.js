'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, Globe } from 'lucide-react'

export default function Widerspruch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-green-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                EHE Community Webseite Studio
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="outline" className="mb-8 border-2 border-green-400 hover:bg-green-500/20 text-white font-semibold hover:border-green-300">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </Link>

        <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-xl p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <AlertCircle className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Widerspruch
            </h1>
          </div>

          <div className="space-y-8 text-white">
            <section>
              <p className="text-lg mb-4 text-white">
                Wenn Ihr Account bei EHE Community Webseite Studio gesperrt wurde, können Sie hier 
                Widerspruch einlegen.
              </p>
            </section>

            <section className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Gründe für eine Sperrung</h2>
              <p className="mb-4 text-white">Ein Account kann gesperrt werden, wenn:</p>
              <ul className="list-disc list-inside space-y-2 text-white">
                <li>Gegen die Nutzungsbedingungen verstoßen wurde</li>
                <li>Illegale Inhalte verbreitet wurden</li>
                <li>Die Plattform missbraucht wurde</li>
                <li>Rechte Dritter verletzt wurden</li>
                <li>Schädliche Aktivitäten festgestellt wurden</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Widerspruch einlegen</h2>
              <p className="mb-4 text-white">
                Wenn Sie der Meinung sind, dass Ihr Account zu Unrecht gesperrt wurde, können Sie 
                über unser Online-Formular Widerspruch einlegen:
              </p>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40 p-8 mb-6 shadow-xl shadow-green-500/20">
                <h3 className="text-2xl font-bold mb-4 text-green-400">Online Widerspruchsformular</h3>
                <p className="mb-6 text-white text-lg">
                  Nutzen Sie unser spezielles Formular für einen schnellen und strukturierten Widerspruchsprozess:
                </p>
                <a 
                  href="https://botforge-orcin.de/widerspruch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-green-500/30 hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="rotate-180 w-5 h-5" />
                  Zum Widerspruchsformular
                </a>
                <p className="text-sm text-green-200 mt-4">
                  Das Formular führt Sie Schritt für Schritt durch den Widerspruchsprozess.
                </p>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30 p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">Alternative: Widerspruch per E-Mail</h3>
                <p className="mb-4 text-white">Alternativ können Sie auch eine E-Mail senden an:</p>
                <a 
                  href="mailto:hamburgrp20@gmail.com?subject=Widerspruch gegen Account-Sperrung"
                  className="text-green-300 hover:text-green-200 text-lg font-bold"
                >
                  hamburgrp20@gmail.com
                </a>
                <p className="text-sm text-white mt-4">Betreff: Widerspruch gegen Account-Sperrung</p>
              </Card>

              <div className="bg-slate-800/30 border border-green-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Bitte geben Sie folgende Informationen an:</h3>
                <ul className="list-disc list-inside space-y-2 text-white">
                  <li>Ihren Benutzernamen / Account-Namen</li>
                  <li>Die E-Mail-Adresse Ihres Accounts</li>
                  <li>Das Datum der Sperrung (falls bekannt)</li>
                  <li>Eine ausführliche Begründung Ihres Widerspruchs</li>
                  <li>Relevante Nachweise oder Dokumente (falls vorhanden)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Bearbeitungsprozess</h2>
              <div className="space-y-4">
                <Card className="bg-slate-800/30 border border-green-500/30 p-4">
                  <h3 className="font-bold mb-2 text-green-400">1. Eingang des Widerspruchs</h3>
                  <p className="text-sm text-white">Wir bestätigen den Eingang Ihres Widerspruchs innerhalb von 24 Stunden.</p>
                </Card>
                <Card className="bg-slate-800/30 border border-green-500/30 p-4">
                  <h3 className="font-bold mb-2 text-green-400">2. Überprüfung</h3>
                  <p className="text-sm text-white">Ihr Fall wird sorgfältig geprüft. Dies kann bis zu 5 Werktage dauern.</p>
                </Card>
                <Card className="bg-slate-800/30 border border-green-500/30 p-4">
                  <h3 className="font-bold mb-2 text-green-400">3. Entscheidung</h3>
                  <p className="text-sm text-white">Sie erhalten eine schriftliche Mitteilung über unsere Entscheidung.</p>
                </Card>
                <Card className="bg-slate-800/30 border border-green-500/30 p-4">
                  <h3 className="font-bold mb-2 text-green-400">4. Aufhebung der Sperrung</h3>
                  <p className="text-sm text-white">Bei erfolgreicher Prüfung wird Ihr Account umgehend entsperrt.</p>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Wichtige Hinweise</h2>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Bitte bleiben Sie sachlich und höflich in Ihrer Kommunikation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Je ausführlicher Ihre Begründung, desto besser können wir Ihren Fall prüfen</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Mehrfache Widersprüche verzögern die Bearbeitung</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Unsere Entscheidung ist final, kann aber bei neuen Beweisen erneut geprüft werden</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Alternative Kontaktmöglichkeiten</h2>
              <p className="mb-4 text-white">
                Für allgemeine Fragen oder Beschwerden, die nicht mit einer Account-Sperrung zusammenhängen:
              </p>
              <Card className="bg-slate-800/50 border-green-500/30 p-4">
                <p className="mb-2 text-white"><strong className="text-green-400">Allgemeiner Support:</strong></p>
                <a href="mailto:hamburgrp20@gmail.com" className="text-green-300 hover:text-green-200 font-semibold">
                  hamburgrp20@gmail.com
                </a>
                <p className="text-sm text-white mt-2">Antwortzeit: In der Regel innerhalb von 48 Stunden</p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Rechtliche Grundlage</h2>
              <p className="mb-4 text-white">
                Dieser Widerspruchsprozess basiert auf unseren{' '}
                <Link href="/nutzungsbedingungen" className="text-green-300 hover:text-green-200 font-bold underline">
                  Nutzungsbedingungen
                </Link>
                {' '}und respektiert Ihre Rechte gemäß unserer{' '}
                <Link href="/datenschutz" className="text-green-300 hover:text-green-200 font-bold underline">
                  Datenschutzerklärung
                </Link>.
              </p>
            </section>

            <section className="border-t border-green-500/20 pt-8">
              <p className="text-center text-white">
                Wir nehmen alle Anliegen ernst und bemühen uns um eine schnelle und faire Lösung.
              </p>
            </section>

            <section className="text-center space-y-4">
              <a 
                href="https://botforge-orcin.de/widerspruch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 text-lg px-8"
                >
                  <ArrowLeft className="rotate-180 w-5 h-5 mr-2" />
                  Widerspruch online einlegen
                </Button>
              </a>
              <p className="text-gray-300 text-sm">oder</p>
              <a href="mailto:hamburgrp20@gmail.com?subject=Widerspruch gegen Account-Sperrung">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-green-400 hover:bg-green-500/20 text-white font-semibold hover:border-green-300"
                >
                  Widerspruch per E-Mail einlegen
                </Button>
              </a>
            </section>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="border-2 border-green-400 hover:bg-green-500/20 text-white font-semibold hover:border-green-300">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
