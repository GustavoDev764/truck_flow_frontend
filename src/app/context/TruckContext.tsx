import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Truck, TruckCreatePayload, TruckUpdatePayload } from '@app/types/truck'
import { truck_service } from '@app/api/truck_service'
import { getApiErrorMessage } from '@app/utils/apiError'

type TruckContextValue = {
  trucks: Truck[]
  pagination: { count: number; page: number; totalPages: number }
  listLoading: boolean
  actionLoading: boolean
  error: string | null
  refreshTrucks: (page?: number) => Promise<void>
  createTruck: (payload: TruckCreatePayload) => Promise<Truck>
  updateTruck: (truckId: string, payload: TruckUpdatePayload) => Promise<Truck>
  deleteTruck: (truckId: string) => Promise<void>
}

const TruckContext = createContext<TruckContextValue | undefined>(undefined)

const PAGE_SIZE = 10

export function TruckProvider({ children }: { children: ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [listLoading, setListLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshTrucks = useCallback(async (pageNum = 1) => {
    setListLoading(true)
    setError(null)
    try {
      const data = await truck_service.list(pageNum)
      setTrucks(data.results)
      setCount(data.count)
      setPage(pageNum)
    } catch (e: unknown) {
      setError(getApiErrorMessage(e))
    } finally {
      setListLoading(false)
    }
  }, [])

  const createTruck = useCallback(
    async (payload: TruckCreatePayload) => {
      setActionLoading(true)
      try {
        const created = await truck_service.create(payload)
        await refreshTrucks(1)
        return created
      } catch (e: unknown) {
        throw new Error(getApiErrorMessage(e))
      } finally {
        setActionLoading(false)
      }
    },
    [refreshTrucks]
  )

  const updateTruck = useCallback(
    async (truckId: string, payload: TruckUpdatePayload) => {
      setActionLoading(true)
      try {
        const updated = await truck_service.update(truckId, payload)
        await refreshTrucks(page)
        return updated
      } catch (e: unknown) {
        throw new Error(getApiErrorMessage(e))
      } finally {
        setActionLoading(false)
      }
    },
    [refreshTrucks, page]
  )

  const deleteTruck = useCallback(
    async (truckId: string) => {
      setActionLoading(true)
      try {
        await truck_service.delete(truckId)
        await refreshTrucks(page)
      } catch (e: unknown) {
        throw new Error(getApiErrorMessage(e))
      } finally {
        setActionLoading(false)
      }
    },
    [refreshTrucks, page]
  )

  const totalPages = Math.ceil(count / PAGE_SIZE) || 1

  const value = useMemo<TruckContextValue>(
    () => ({
      trucks,
      pagination: { count, page, totalPages },
      listLoading,
      actionLoading,
      error,
      refreshTrucks,
      createTruck,
      updateTruck,
      deleteTruck,
    }),
    [
      trucks,
      count,
      page,
      totalPages,
      listLoading,
      actionLoading,
      error,
      refreshTrucks,
      createTruck,
      updateTruck,
      deleteTruck,
    ]
  )

  return <TruckContext.Provider value={value}>{children}</TruckContext.Provider>
}

export function useTruckContext(): TruckContextValue {
  const ctx = useContext(TruckContext)
  if (!ctx) throw new Error('useTruckContext deve ser usado dentro do TruckProvider.')
  return ctx
}

