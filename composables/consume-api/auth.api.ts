// ~/composables/consume-api/auth.api.ts
import { useApi } from '@/composables/use-fetch-api'
import type { LoginPayload, LoginResponse } from '@/types/auth'

export const login = (payload: LoginPayload) => {
  return useApi<LoginResponse>('/auth/login/administrator', {
    method: 'POST',
    body: payload,
    service: 'auth' // ✅ penting agar base URL-nya benar
  })
}
