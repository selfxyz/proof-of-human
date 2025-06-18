// import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'

// Temporarily disabled due to Next.js 15 type issues
// export const metadata: Metadata = {
//   title: 'Prove You\'re Human - Self Verification',
//   description: 'Verify your humanity using Self protocol passport verification',
// }

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}