import { httpClient } from '@app/api/httpClient'

export type FipeBrand = { code: string; name: string }
export type FipeModel = { code: string; name: string }
export type FipeYear = { year: number }

export const fipe_service = {
  async getBrands(): Promise<FipeBrand[]> {
    const res = await httpClient.get<FipeBrand[]>('/api/fipe/brands/')
    return res.data ?? []
  },

  async getModels(brandId: string): Promise<FipeModel[]> {
    const res = await httpClient.get<FipeModel[]>(`/api/fipe/brands/${brandId}/models/`)
    return res.data ?? []
  },

  async getYears(brandId: string, modelId: string): Promise<FipeYear[]> {
    const res = await httpClient.get<FipeYear[]>(
      `/api/fipe/brands/${brandId}/models/${modelId}/years/`
    )
    return res.data ?? []
  },
}
