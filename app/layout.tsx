import type { Metadata } from 'next'
import { Caveat, Kalam, Patrick_Hand } from 'next/font/google'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const kalam = Kalam({
  subsets: ['latin'],
  variable: '--font-kalam',
  display: 'swap',
  weight: ['300', '400', '700'],
})

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  variable: '--font-patrick',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'PromptMaster',
  description: "Learn what's possible. Master how to achieve it.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${kalam.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="font-label min-h-full flex flex-col">{children}</body>
    </html>
  )
}
