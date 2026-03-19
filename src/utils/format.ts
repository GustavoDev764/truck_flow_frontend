export function formatBRL(value: string): string {
  const num = Number.parseFloat(value)
  if (Number.isNaN(num)) return value

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

