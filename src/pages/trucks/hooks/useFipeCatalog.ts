import { useCallback, useEffect, useState } from 'react'
import type { FipeBrand, FipeModel, FipeYear } from '@app/api/fipe_service'
import { fipe_service } from '@app/api/fipe_service'

function matchIgnoreCase(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function useFipeCatalog(initialBrand?: string, initialModel?: string) {
  const [brands, setBrands] = useState<FipeBrand[]>([])
  const [models, setModels] = useState<FipeModel[]>([])
  const [years, setYears] = useState<FipeYear[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)
  const [modelId, setModelId] = useState<string | null>(null)
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoadingBrands(true)
    fipe_service
      .getBrands()
      .then((data) => {
        if (!cancelled) setBrands(data)
      })
      .finally(() => {
        if (!cancelled) setLoadingBrands(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!brandId) {
      setModels([])
      setModelId(null)
      setYears([])
      return
    }
    let cancelled = false
    setLoadingModels(true)
    fipe_service
      .getModels(brandId)
      .then((data) => {
        if (!cancelled) {
          setModels(data)
          if (initialModel && data.length > 0) {
            const found = data.find((m) => matchIgnoreCase(m.name, initialModel))
            if (found) setModelId(found.code)
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false)
      })
    return () => {
      cancelled = true
    }
  }, [brandId])

  useEffect(() => {
    if (!brandId || !modelId) {
      setYears([])
      return
    }
    let cancelled = false
    setLoadingYears(true)
    fipe_service
      .getYears(brandId, modelId)
      .then((data) => {
        if (!cancelled) setYears(data)
      })
      .finally(() => {
        if (!cancelled) setLoadingYears(false)
      })
    return () => {
      cancelled = true
    }
  }, [brandId, modelId])

  useEffect(() => {
    if (initialBrand && brands.length > 0 && !brandId) {
      const found = brands.find((b) => matchIgnoreCase(b.name, initialBrand))
      if (found) setBrandId(found.code)
    }
  }, [initialBrand, brands, brandId])

  const selectBrand = useCallback((code: string | undefined) => {
    setBrandId(code ?? null)
    setModelId(null)
    setModels([])
    setYears([])
  }, [])

  const selectModel = useCallback((code: string | undefined) => {
    setModelId(code ?? null)
    setYears([])
  }, [])

  return {
    brands,
    models,
    years,
    brandId,
    modelId,
    loadingBrands,
    loadingModels,
    loadingYears,
    selectBrand,
    selectModel,
  }
}
