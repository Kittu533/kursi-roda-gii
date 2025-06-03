export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  query?: Record<string, unknown>
  body?: BodyInit | null  // Tipe BodyInit lebih tepat digunakan untuk body
  headers?: HeadersInit
  service?: 'core' | 'masterdata' | 'auth' | 'log' // Menambahkan service seperti 'core', 'auth', dsb
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

  // Pilih base URL sesuai dengan service yang ditentukan
  const selectedBaseUrl = baseUrls[options.service ?? 'core'] // default ke 'core' jika tidak di-set

  // Mendapatkan token dan API key di client-side
  const token = import.meta.client ? localStorage.getItem('token') : null
  const key = import.meta.client ? localStorage.getItem('key') : null

  try {
    // Mengirim request dengan $fetch
    const response = await $fetch<T>(`${selectedBaseUrl}${url}`, {
      method: options.method ?? 'GET', // Default method 'GET'
      query: options.query,
      body: options.body ?? null,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : '',
        'x-api-key': key ?? ''
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error('An error occurred while fetching data')
  }
}
