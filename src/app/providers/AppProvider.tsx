import { AuthProvider } from '@app/app/context/AuthContext'
import { TruckProvider } from '@app/app/context/TruckContext'
import type { ReactNode } from 'react'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TruckProvider>{children}</TruckProvider>
    </AuthProvider>
  )
}

