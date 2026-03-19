import { useEffect } from 'react'
import { useTruckContext } from '@app/app/context/TruckContext'

export function useTrucksList() {
  const { trucks, pagination, listLoading, error, refreshTrucks, deleteTruck } = useTruckContext()

  useEffect(() => {
    refreshTrucks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    trucks,
    pagination,
    loading: listLoading,
    error,
    refreshTrucks,
    deleteTruck,
  }
}

