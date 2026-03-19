import axios from 'axios'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from '@app/api/tokenStorage'

const baseURL = import.meta.env.VITE_URL_BASE as string | undefined

export const httpClient = axios.create({
  baseURL: baseURL ?? 'http://127.0.0.1:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

httpClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const isRefreshRequest = original?.url?.includes('/token/refresh/')
    if (err.response?.status === 401 && !original._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(httpClient(original))
          })
        })
      }
      original._retry = true
      isRefreshing = true
      const refresh = getStoredRefreshToken()
      if (refresh) {
        try {
          const { auth_service } = await import('@app/api/auth_service')
          const { access } = await auth_service.refresh()
          setStoredTokens(access, refresh)
          onTokenRefreshed(access)
          original.headers.Authorization = `Bearer ${access}`
          return httpClient(original)
        } catch {
          clearStoredTokens()
          window.location.href = '/login'
        } finally {
          isRefreshing = false
        }
      } else {
        clearStoredTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

