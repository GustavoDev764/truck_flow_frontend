import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Ocorreu um erro inesperado.'

  const data = error.response?.data
  if (!data) return error.message || 'Erro de comunicação com a API.'

  if (typeof data === 'string') return data

  if (typeof data === 'object' && data !== null) {
    const anyData = data as Record<string, unknown>
    if (typeof anyData.detail === 'string') return anyData.detail

    // DRF frequentemente retorna { field: [mensagens...] }.
    const messages: string[] = []
    for (const [key, value] of Object.entries(anyData)) {
      if (Array.isArray(value)) {
        const parts = value.filter((v) => typeof v === 'string') as string[]
        if (parts.length) messages.push(...parts)
      } else if (typeof value === 'string') {
        messages.push(value)
      } else if (key !== 'detail') {
        messages.push(`${key}`)
      }
    }

    if (messages.length) return messages.join(' ')
  }

  try {
    return JSON.stringify(data)
  } catch {
    return 'Erro ao processar resposta da API.'
  }
}

