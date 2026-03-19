export type Truck = {
  id: string
  license_plate: string
  brand: string
  model: string
  manufacturing_year: number
  fipe_price: string
}

export type TruckCreatePayload = {
  license_plate: string
  brand: string
  model: string
  manufacturing_year: number
}

export type TruckUpdatePayload = {
  brand: string
  model: string
  manufacturing_year: number
}

