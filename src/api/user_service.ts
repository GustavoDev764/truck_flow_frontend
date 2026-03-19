import { httpClient } from '@app/api/httpClient'

export type PaginatedUsers = {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  groups_display: string[]
  date_joined: string
}

export type UserCreatePayload = {
  username: string
  email?: string
  password: string
  first_name?: string
  last_name?: string
  groups?: string[]
}

export type UserUpdatePayload = {
  email?: string
  first_name?: string
  last_name?: string
  groups?: string[]
}

function extractPaginatedUsers(data: unknown): PaginatedUsers {
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data as User[] }
  }
  const maybe = data as PaginatedUsers
  if (maybe?.results) return maybe
  return { count: 0, next: null, previous: null, results: [] }
}

export const user_service = {
  async list(page = 1): Promise<PaginatedUsers> {
    const res = await httpClient.get('/api/users/', { params: { page } })
    return extractPaginatedUsers(res.data)
  },

  async create(payload: UserCreatePayload): Promise<User> {
    const res = await httpClient.post<User>('/api/users/', payload)
    return res.data
  },

  async get(id: number): Promise<User> {
    const res = await httpClient.get<User>(`/api/users/${id}/`)
    return res.data
  },

  async update(id: number, payload: UserUpdatePayload): Promise<User> {
    const res = await httpClient.put<User>(`/api/users/${id}/`, payload)
    return res.data
  },

  async deactivate(id: number, isActive: boolean): Promise<User> {
    const res = await httpClient.patch<User>(`/api/users/${id}/deactivate/`, { is_active: isActive })
    return res.data
  },

  async changePassword(id: number, newPassword: string): Promise<void> {
    await httpClient.post(`/api/users/${id}/change-password/`, { new_password: newPassword })
  },
}
