import './globals.css'

export const metadata = {
  title: 'EHE Community Webseite Studio',
  description: 'Unsere Hauptseite der EHE Community Webseite Studio',
icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
