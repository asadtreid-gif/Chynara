import type { Metadata } from 'next'
import '@/shared/styles/globals.css'
import { SITE } from '@/shared/config/site'

export const metadata: Metadata = {
  title: `${SITE.fullName} — Онлайн меню`,
  description: `${SITE.tagline} в самом сердце ${SITE.city}`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
