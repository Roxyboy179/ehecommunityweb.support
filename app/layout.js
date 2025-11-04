import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieProvider } from '@/contexts/CookieContext'
import CookieBanner from '@/components/CookieBanner'

export const metadata = {
  title: 'EHE Community Webseite Studio',
  description: 'Unsere Hauptseite der EHE Community Webseite Studio',
icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <CookieProvider>
          <AuthProvider>
            {children}
            <CookieBanner />
          </AuthProvider>
        </CookieProvider>
      </body>
    </html>
  )
}
