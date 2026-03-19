import { httpClient } from '@app/api/httpClient'

export type DashboardTruck = {
  id: string
  license_plate: string
  brand: string
  model: string
  manufacturing_year: number
  fipe_price: string
}

export type TimelinePoint = {
  period: string
  total: number
  count: number
}

export type DashboardData = {
  cheapest_truck: DashboardTruck | null
  most_expensive_truck: DashboardTruck | null
  average_value: number
  total_trucks: number
  timeline: TimelinePoint[]
}

export const dashboard_service = {
  async get(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<DashboardData> {
    const res = await httpClient.get<DashboardData>('/api/dashboard/', {
      params: { period },
    })
    return res.data
  },
}
