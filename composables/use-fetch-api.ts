export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: Record<string, unknown>
  body?: Record<string, any> | BodyInit | null
  headers?: HeadersInit
  service?: 'core' | 'masterdata' | 'auth' | 'log' // ← tambahkan ini
}

export const useApi = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const config = useRuntimeConfig()

  // Pilih base URL berdasarkan service
  const baseUrls = {
    core: config.public.coreServiceBaseUrl,
    masterdata: config.public.masterdataServiceBaseUrl,
    auth: config.public.authenticationServiceBaseUrl,
    log: config.public.logServiceBaseUrl
  }

  const selectedBaseUrl = baseUrls[options.service ?? 'core'] // default ke 'core' jika tidak di-set

  const token = import.meta.client ? localStorage.getItem('token') : null
  const key = import.meta.client ? localStorage.getItem('key') : null

  return await $fetch<T>(`${selectedBaseUrl}${url}`, {
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
