'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Globe } from 'lucide-react'

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EHE Community Webseite Studio
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="outline" className="mb-8 border-blue-500/50 hover:bg-blue-500/10">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </Link>

        <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Impressum
          </h1>

          <div className="space-y-8 text-slate-300">
            <section>
              <p className="text-lg text-slate-400 mb-4">Angaben gemäß § 5 TMG</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Betreiber</h2>
              <p className="mb-2"><strong>Künstlername:</strong> Roxyboy#2474</p>
              <p><strong>Website:</strong> <a href="https://botforge-orcin.de" className="text-blue-400 hover:text-blue-300">EHE Community Webseite Studio</a></p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Kontakt</h2>
              <p className="mb-4">
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:hamburgrp20@gmail.com" className="text-blue-400 hover:text-blue-300">
                  hamburgrp20@gmail.com
                </a>
              </p>
              <p className="text-slate-400">
                Für Anfragen, Support oder rechtliche Anliegen kannst du uns über die angegebene E-Mail-Adresse erreichen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Haftung für Inhalte</h2>
              <p className="mb-4">
                Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Vollständigkeit, 
                Richtigkeit und Aktualität wird jedoch keine Haftung übernommen.
              </p>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Haftung für Links</h2>
              <p className="mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss 
                haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte 
                der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente 
                inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer 
                Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
                Links umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Urheberrecht</h2>
              <p className="mb-4">
                Alle Inhalte auf dieser Website, insbesondere Texte, Bilder, Grafiken, Code und Design, sind 
                urheberrechtlich geschützt. Jede Vervielfältigung, Bearbeitung, Verbreitung und jede Art der 
                Verwertung außerhalb der Grenzen des Urheberrechtes bedarf der schriftlichen Zustimmung des 
                jeweiligen Urhebers.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
                Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Solltest du 
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden 
                Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </section>

            <section className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Hinweis zur privaten Nutzung</h2>
              <p className="mb-4">Diese Website wird privat und ohne kommerziellen Zweck betrieben.</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Es werden keine Einnahmen durch die Website generiert</li>
                <li>Es wird keine Werbung geschaltet</li>
                <li>Die Website wird nicht geschäftlich genutzt</li>
              </ul>
              <p className="text-sm text-slate-400">
                Gemäß § 5 TMG ist bei privaten Websites ohne kommerziellen Zweck die Angabe einer vollständigen 
                Adresse nicht verpflichtend. Ein Künstlername zusammen mit einer Kontakt-E-Mail-Adresse ist ausreichend.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">EU-Streitschlichtung</h2>
              <p className="mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Support und Kontakt</h2>
              <p className="mb-4">
                Für Support-Anfragen, technische Probleme oder allgemeine Fragen zu EHE Community Webseite Studio:
              </p>
              
              <Card className="bg-slate-800/50 border-blue-500/20 p-6 mb-4">
                <h3 className="text-xl font-bold mb-2 text-blue-400">E-Mail Support</h3>
                <a href="mailto:hamburgrp20@gmail.com" className="text-blue-400 hover:text-blue-300 text-lg">
                  hamburgrp20@gmail.com
                </a>
              </Card>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-bold mb-2 text-white">Technischer Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                    <li>Webseiten-Konfiguration</li>
                    <li>Technische Probleme</li>
                    <li>Account-Verwaltung</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-white">Rechtliche Anfragen</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                    <li>Datenschutz</li>
                    <li>Impressum</li>
                    <li>Urheberrecht</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-400">Antwortzeit: In der Regel innerhalb von 48 Stunden</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">Widerspruch und Beschwerden</h2>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Widerspruch gegen Kontosperrung:</h3>
                <p className="mb-2">Wenn dein Account gesperrt wurde, kannst du Widerspruch einlegen:</p>
                <p>
                  → Nutze unser{' '}
                  <Link href="/widerspruch" className="text-blue-400 hover:text-blue-300">
                    Widerspruchsformular
                  </Link>
                  {' '}oder sende eine E-Mail
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Allgemeine Beschwerden:</h3>
                <p className="mb-2">Für sonstige Beschwerden oder Feedback:</p>
                <p>
                  → E-Mail an:{' '}
                  <a href="mailto:hamburgrp20@gmail.com" className="text-blue-400 hover:text-blue-300 font-bold">
                    hamburgrp20@gmail.com
                  </a>
                </p>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Wir nehmen alle Anliegen ernst und bemühen uns um eine schnelle und faire Lösung.
              </p>
            </section>

            <section className="border-t border-blue-500/20 pt-8">
              <p className="text-sm text-slate-400">Stand: 4. November 2025</p>
              <p className="text-sm text-slate-400 mt-2">Alle Angaben ohne Gewähr</p>
            </section>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}