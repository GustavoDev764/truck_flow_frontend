import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { UserInfo } from '@app/api/auth_service'
import { auth_service, getStoredAccessToken } from '@app/api/auth_service'

type AuthState = {
  user: UserInfo | null
  loading: boolean
  error: string | null
}

type AuthContextValue = AuthState & {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isManage: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null })

  const refreshUser = useCallback(async () => {
    if (!getStoredAccessToken()) {
      setState((s) => ({ ...s, user: null, loading: false }))
      return
    }
    try {
      const user = await auth_service.me()
      setState((s) => ({ ...s, user, loading: false, error: null }))
    } catch {
      auth_service.logout()
      setState((s) => ({ ...s, user: null, loading: false }))
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (username: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const { user } = await auth_service.login(username, password)
      setState((s) => ({ ...s, user, loading: false, error: null }))
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Usuário ou senha inválidos.'
      setState((s) => ({ ...s, user: null, loading: false, error: msg }))
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    auth_service.logout()
    setState((s) => ({ ...s, user: null }))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      isManage: state.user?.is_manage ?? false,
      refreshUser,
    }),
    [state, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
