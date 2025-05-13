export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: Record<string, unknown>
  body?: Record<string, any> | BodyInit | null
  headers?: HeadersInit
}

export const useApi = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const config = useRuntimeConfig()

  // SSR-safe token/key access
  const token = import.meta.client ? localStorage.getItem('token') : null
  const key = import.meta.client ? localStorage.getItem('key') : null

  return await $fetch<T>(`${config.public.apiBase}${url}`, {
    method: options.method ?? 'GET',
    query: options.query,
    body: options.body ?? null,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
      'x-api-key': key ?? ''
    }
  })
}
