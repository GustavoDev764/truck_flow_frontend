/**
 * Máscara para placas brasileiras: modelo antigo (ABC-1234) e Mercosul (ABC1D23).
 *
 * - Antiga: 3 letras + hífen + 4 números (ABC-1234)
 * - Mercosul: 3 letras + 1 número + 1 letra + 2 números (ABC1D23)
 */

export function formatPlateInput(value: string): string {
  const raw = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7)
  if (raw.length <= 3) {
    return raw.replace(/[^A-Z]/g, '').slice(0, 3)
  }

  const letters = raw.slice(0, 3).replace(/[^A-Z]/g, '')
  if (letters.length < 3) return letters

  const rest = raw.slice(3)

  // Mercosul: 1 número + 1 letra + 2 números
  if (/^\d[A-Z]/.test(rest)) {
    const n1 = rest[0]
    const l1 = rest[1]
    const n2 = rest.slice(2).replace(/[^0-9]/g, '').slice(0, 2)
    return letters + n1 + l1 + n2
  }

  // Antiga: 4 números
  if (/^\d+$/.test(rest)) {
    return letters + '-' + rest.slice(0, 4)
  }

  // 4º caractere é número, 5º ainda não ou é número → tende para antiga
  if (/^\d\d?$/.test(rest) || /^\d\d\d$/.test(rest)) {
    return letters + '-' + rest.replace(/[^0-9]/g, '').slice(0, 4)
  }

  return letters + rest.replace(/[^0-9A-Z]/g, '').slice(0, 4)
}

/** Formato antigo: ABC-1234 */
export const PLATE_OLD_REGEX = /^[A-Z]{3}-?[0-9]{4}$/

/** Formato Mercosul: ABC1D23 */
export const PLATE_MERCOSUL_REGEX = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

export function isPlateValid(value: string): boolean {
  const clean = value.replace(/\s|-/g, '').toUpperCase()
  if (clean.length !== 7) return false
  return /^[A-Z]{3}[0-9]{4}$/.test(clean) || PLATE_MERCOSUL_REGEX.test(clean)
}
