import { ApiError } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = (await response.json()) as { code?: string; message?: string }
      throw new ApiError(
        response.status,
        error.code || 'UNKNOWN_ERROR',
        error.message || 'Erro desconhecido'
      )
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'FETCH_ERROR', 'Erro ao fazer requisição')
  }
}
