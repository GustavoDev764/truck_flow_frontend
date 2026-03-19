import { httpClient } from '@app/api/httpClient'
import type { Truck, TruckCreatePayload, TruckUpdatePayload } from '@app/types/truck'

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function extractPaginated<T>(data: unknown): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data as T[] }
  }
  const maybe = data as PaginatedResponse<T>
  if (maybe?.results) {
    return maybe
  }
  return { count: 0, next: null, previous: null, results: [] }
}

export const truck_service = {
  async list(page = 1): Promise<PaginatedResponse<Truck>> {
    const res = await httpClient.get('/api/trucks/', { params: { page } })
    return extractPaginated<Truck>(res.data)
  },

  async create(payload: TruckCreatePayload): Promise<Truck> {
    const res = await httpClient.post('/api/trucks/', payload)
    return res.data as Truck
  },

  async update(truckId: string, payload: TruckUpdatePayload): Promise<Truck> {
    const res = await httpClient.put(`/api/trucks/${truckId}/`, payload)
    return res.data as Truck
  },

  async delete(truckId: string): Promise<void> {
    await httpClient.delete(`/api/trucks/${truckId}/`)
  },
}

