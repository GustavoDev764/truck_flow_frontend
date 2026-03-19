import { httpClient } from '@app/api/httpClient'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from '@app/api/tokenStorage'

export type UserInfo = {
  id: number
  username: string
  groups: string[]
  is_manage: boolean
}

export type LoginResponse = {
  access: string
  refresh: string
  user: UserInfo
}

export { getStoredAccessToken, getStoredRefreshToken }

export function setTokens(access: string, refresh: string): void {
  setStoredTokens(access, refresh)
}

export function clearTokens(): void {
  clearStoredTokens()
}

export const auth_service = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await httpClient.post<LoginResponse>('/api/auth/token/', { username, password })
    const data = res.data
    setStoredTokens(data.access, data.refresh)
    return data
  },

  async refresh(): Promise<{ access: string }> {
    const refresh = getStoredRefreshToken()
    if (!refresh) throw new Error('Sem refresh token')
    const res = await httpClient.post<{ access: string }>('/api/auth/token/refresh/', { refresh })
    setStoredTokens(res.data.access, refresh)
    return res.data
  },

  async me(): Promise<UserInfo> {
    const res = await httpClient.get<UserInfo>('/api/auth/me/')
    return res.data
  },

  async logout(): Promise<void> {
    const token = getStoredAccessToken()
    if (token) {
      try {
        await httpClient.post('/api/auth/logout/', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // Ignora erro - sempre limpa tokens
      }
    }
    clearStoredTokens()
  },
}
