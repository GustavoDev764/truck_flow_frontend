import { isPlateValid } from '@app/utils/plateMask'

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/-/g, '')
}

export function validatePlate(plate: string): string | undefined {
  const normalized = plate.trim().toUpperCase().replace(/-/g, '')
  if (!normalized) return 'Placa é obrigatória.'
  if (!isPlateValid(plate)) return 'Placa inválida. Use o formato antigo (ABC-1234) ou Mercosul (ABC1D23).'
  return undefined
}

export function validateNonEmpty(value: string, fieldName: string): string | undefined {
  if (!value.trim()) return `${fieldName} é obrigatório.`
  return undefined
}

export function validateManufacturingYear(year: number): string | undefined {
  const currentYear = new Date().getUTCFullYear()
  if (Number.isNaN(year)) return 'Ano de fabricação inválido.'
  if (year < 1900 || year > currentYear + 1) return 'Ano de fabricação fora do intervalo permitido.'
  return undefined
}

