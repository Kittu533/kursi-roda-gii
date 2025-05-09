// ~/composables/consume-api/auth.api.ts

import { useApi } from '@/composables/use-fetch-api'
import type { LoginPayload, LoginResponse } from '@/types/auth'

export const loginApi = (payload: LoginPayload) => {
  return useApi<LoginResponse>('/auth/login/administrator', {
    method: 'POST',
    body: payload
  })
}
