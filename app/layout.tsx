import { Analytics } from '@vercel/analytics/next'
import { Noto_Sans_JP } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { PrototypeProvider } from '@/components/prototype-store'
import Header from '@/components/Header'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: {
    default: 'Work Connect | 社内コミュニティ',
    template: '%s | Work Connect',
  },
  description: '現場の気づきやアイデアを、匿名で安心して共有する社内コミュニティ。',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
  themeColor: '#0F766E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="light" data-scroll-behavior="smooth">
      <body className={`${notoSansJP.variable} antialiased`}>
        <PrototypeProvider>
          <Header />
          {children}
          </PrototypeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
