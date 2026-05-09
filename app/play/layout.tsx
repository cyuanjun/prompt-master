import type { ReactNode } from 'react'
import { GameStateProvider } from '@/components/game/GameStateProvider'

export default function PlayLayout({ children }: { children: ReactNode }) {
  return <GameStateProvider>{children}</GameStateProvider>
}
