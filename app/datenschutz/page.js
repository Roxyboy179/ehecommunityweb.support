'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Globe } from 'lucide-react'

export default function Datenschutz() {
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
            <Shield className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Datenschutzerklärung
            </h1>
          </div>

          <div className="space-y-8 text-white">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-xl font-bold mb-3 text-white">Allgemeine Hinweise</h3>
              <p className="mb-4 text-white">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
                denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-bold mb-3 text-white">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
              <p className="mb-4 text-white">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser Datenschutzerklärung 
                entnehmen.
              </p>

              <h3 className="text-xl font-bold mb-3 text-white">Wie erfassen wir Ihre Daten?</h3>
              <p className="mb-4 text-white">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
              </p>
              <p className="mb-4 text-white">
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere 
                IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem 
                oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese 
                Website betreten.
              </p>

              <h3 className="text-xl font-bold mb-3 text-white">Wofür nutzen wir Ihre Daten?</h3>
              <p className="mb-4 text-white">
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>

              <h3 className="text-xl font-bold mb-3 text-white">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
              <p className="mb-4 text-white">
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
                gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung 
                oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt 
                haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das 
                Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten 
                zu verlangen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Hosting</h2>
              <p className="mb-4 text-white">
                Wir hosten die Inhalte unserer Website bei einem externen Dienstleister. Die personenbezogenen 
                Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. 
                Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, 
                Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website 
                generiert werden, handeln.
              </p>
              <p className="mb-4 text-white">
                Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen 
                und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen 
                und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter 
                (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Allgemeine Hinweise und Pflichtinformationen</h2>
              <h3 className="text-xl font-bold mb-3 text-white">Datenschutz</h3>
              <p className="mb-4 text-white">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
                Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften 
                sowie dieser Datenschutzerklärung.
              </p>
              <p className="mb-4 text-white">
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die 
                vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. 
                Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Hinweis zur verantwortlichen Stelle</h2>
              <p className="mb-4 text-white">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <Card className="bg-slate-800/50 border-green-500/30 p-4 mb-4">
                <p className="mb-2 text-white"><strong className="text-green-400">Künstlername:</strong> Roxyboy#2474</p>
                <p className="text-white"><strong className="text-green-400">E-Mail:</strong> <a href="mailto:hamburgrp20@gmail.com" className="text-green-300 hover:text-green-200 font-semibold">hamburgrp20@gmail.com</a></p>
              </Card>
              <p className="mb-4 text-white">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit 
                anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, 
                E-Mail-Adressen o. Ä.) entscheidet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Speicherdauer</h2>
              <p className="mb-4 text-white">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
                verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. 
                Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung 
                widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für 
                die Speicherung Ihrer personenbezogenen Daten haben.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Ihre Rechte</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Auskunftsrecht</h3>
                  <p className="text-white">Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Recht auf Berichtigung</h3>
                  <p className="text-white">Sie haben das Recht, die Berichtigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Recht auf Löschung</h3>
                  <p className="text-white">Sie haben das Recht, die Löschung Ihrer gespeicherten personenbezogenen Daten zu verlangen.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Recht auf Einschränkung der Verarbeitung</h3>
                  <p className="text-white">Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Recht auf Datenübertragbarkeit</h3>
                  <p className="text-white">Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Widerspruchsrecht</h3>
                  <p className="text-white">Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten zu widersprechen.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">Beschwerderecht</h3>
                  <p className="text-white">Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Kontakt</h2>
              <p className="mb-4 text-white">Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:</p>
              <Card className="bg-slate-800/50 border-green-500/30 p-4">
                <p className="text-white"><strong className="text-green-400">E-Mail:</strong> <a href="mailto:hamburgrp20@gmail.com" className="text-green-300 hover:text-green-200 font-semibold">hamburgrp20@gmail.com</a></p>
              </Card>
            </section>

            <section className="border-t border-green-500/20 pt-8">
              <p className="text-sm text-gray-300">Stand: 4. November 2025</p>
              <p className="text-sm text-gray-300 mt-2">Alle Angaben ohne Gewähr</p>
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
