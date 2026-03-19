import { useCallback, useState } from 'react'
import type { Truck } from '@app/types/truck'
import { useTruckContext } from '@app/app/context/TruckContext'

type FormValues = {
  license_plate: string
  brand: string
  model: string
  manufacturing_year: number
}

export function useTruckUpsert({
  mode,
  initialTruck,
}: {
  mode: 'create' | 'edit'
  initialTruck?: Truck
}) {
  const { createTruck, updateTruck, actionLoading } = useTruckContext()
  const [apiError, setApiError] = useState<string | null>(null)

  const submit = useCallback(
    async (values: FormValues) => {
      setApiError(null)

      try {
        if (mode === 'create') {
          await createTruck({
            license_plate: values.license_plate,
            brand: values.brand,
            model: values.model,
            manufacturing_year: values.manufacturing_year,
          })
          return
        }

        if (!initialTruck) throw new Error('Caminhão não encontrado para atualização.')

        await updateTruck(initialTruck.id, {
          brand: values.brand,
          model: values.model,
          manufacturing_year: values.manufacturing_year,
        })
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Ocorreu um erro ao salvar.'
        setApiError(msg)
        throw e
      }
    },
    [actionLoading, createTruck, initialTruck, mode, updateTruck]
  )

  return {
    submit,
    isSubmitting: actionLoading,
    apiError,
  }
}

