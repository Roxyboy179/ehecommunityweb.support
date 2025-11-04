'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Globe } from 'lucide-react'

export default function Nutzungsbedingungen() {
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
          <div className="flex items-center space-x-4 mb-8">
            <FileText className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Nutzungsbedingungen
            </h1>
          </div>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Geltungsbereich</h2>
              <p className="mb-4">
                Diese Nutzungsbedingungen gelten für die Nutzung der Website und der Dienste von 
                EHE Community Webseite Studio. Mit der Nutzung unserer Services erklären Sie sich mit 
                diesen Bedingungen einverstanden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Leistungsbeschreibung</h2>
              <p className="mb-4">
                EHE Community Webseite Studio ist eine kostenlose Plattform, die Webseiten für Unternehmen 
                und Privatpersonen erstellt. Die Dienste werden im Rahmen unserer Community-Initiative 
                angeboten.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Unsere Services umfassen:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Erstellung von Webseiten</li>
                  <li>Design und UX-Optimierung</li>
                  <li>Performance-Optimierung</li>
                  <li>Community-Support</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Kostenlose Nutzung</h2>
              <p className="mb-4">
                Alle angebotenen Services sind grundsätzlich kostenlos. Es werden keine versteckten Gebühren 
                erhoben. Die Plattform wird durch die Community getragen und ist nicht kommerziell ausgerichtet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Nutzerpflichten</h2>
              <p className="mb-4">Bei der Nutzung unserer Services verpflichten Sie sich:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Keine illegalen Inhalte zu verbreiten</li>
                <li>Die Rechte Dritter zu respektieren</li>
                <li>Keine schädlichen Inhalte (Viren, Malware) hochzuladen</li>
                <li>Wahrheitsgemäße Angaben zu machen</li>
                <li>Die Plattform nicht zu missbrauchen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Urheberrecht und Nutzungsrechte</h2>
              <p className="mb-4">
                Alle von uns erstellten Inhalte (Code, Design, Texte) bleiben in unserem Eigentum, werden 
                Ihnen aber zur Nutzung bereitgestellt. Sie erhalten ein nicht-exklusives Nutzungsrecht für 
                die erstellten Webseiten.
              </p>
              <p className="mb-4">
                Inhalte, die Sie uns zur Verfügung stellen, bleiben Ihr Eigentum. Sie räumen uns jedoch das 
                Recht ein, diese für die Erstellung Ihrer Webseite zu verwenden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Haftungsausschluss</h2>
              <p className="mb-4">
                Die Nutzung unserer Services erfolgt auf eigenes Risiko. Wir bemühen uns um höchste Qualität, 
                können jedoch keine Garantie für:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Ständige Verfügbarkeit der Services</li>
                <li>Fehlerfreiheit der erstellten Webseiten</li>
                <li>Eignung für einen bestimmten Zweck</li>
              </ul>
              <p className="mb-4">
                Wir haften nicht für Schäden, die durch die Nutzung oder Nicht-Nutzung unserer Services 
                entstehen, es sei denn, diese beruhen auf Vorsatz oder grober Fahrlässigkeit unsererseits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Datenschutz</h2>
              <p className="mb-4">
                Der Schutz Ihrer Daten ist uns wichtig. Details zur Datenverarbeitung finden Sie in unserer{' '}
                <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300 font-bold">
                  Datenschutzerklärung
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Account-Sperrung</h2>
              <p className="mb-4">
                Wir behalten uns das Recht vor, Accounts zu sperren, wenn:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Gegen diese Nutzungsbedingungen verstoßen wird</li>
                <li>Illegale Aktivitäten festgestellt werden</li>
                <li>Die Plattform missbraucht wird</li>
                <li>Rechte Dritter verletzt werden</li>
              </ul>
              <p className="mb-4">
                Bei einer Sperrung können Sie Widerspruch über unser{' '}
                <Link href="/widerspruch" className="text-blue-400 hover:text-blue-300 font-bold">
                  Widerspruchsformular
                </Link>
                {' '}einlegen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">9. Änderungen der Nutzungsbedingungen</h2>
              <p className="mb-4">
                Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu ändern. Über wesentliche 
                Änderungen werden wir Sie informieren. Die fortgesetzte Nutzung nach Änderungen gilt als 
                Zustimmung zu den neuen Bedingungen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">10. Kündigung</h2>
              <p className="mb-4">
                Sie können die Nutzung unserer Services jederzeit ohne Angabe von Gründen beenden. 
                Kontaktieren Sie uns einfach per E-Mail, wenn Sie Ihre Daten löschen lassen möchten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">11. Salvatorische Klausel</h2>
              <p className="mb-4">
                Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder werden, 
                berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">12. Anwendbares Recht</h2>
              <p className="mb-4">
                Es gilt das Recht der Bundesrepublik Deutschland.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">13. Kontakt</h2>
              <p className="mb-4">Bei Fragen zu diesen Nutzungsbedingungen erreichen Sie uns unter:</p>
              <Card className="bg-slate-800/50 border-blue-500/20 p-4">
                <p className="mb-2"><strong>E-Mail:</strong> <a href="mailto:hamburgrp20@gmail.com" className="text-blue-400 hover:text-blue-300">hamburgrp20@gmail.com</a></p>
                <p className="text-sm text-slate-400 mt-2">Antwortzeit: In der Regel innerhalb von 48 Stunden</p>
              </Card>
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