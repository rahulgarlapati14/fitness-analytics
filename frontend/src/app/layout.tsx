import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Analytics - AI-Powered Instagram Insights',
  description: 'Predict Instagram post performance and optimize your gym marketing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
