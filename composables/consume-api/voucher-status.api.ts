// ~/consume-api/voucher-status.api.ts
import { useApi } from '@/composables/use-fetch-api'

export interface VoucherStatus {
  id: string
  status: string
}

interface VoucherStatusApiResponse {
  response: {
    records: VoucherStatus[]
  }
}

// Ambil semua status voucher
export const fetchVoucherStatusesApi = async (): Promise<VoucherStatus[]> => {
  const { response } = await useApi<VoucherStatusApiResponse>('/voucher-status/admin', {
    method: 'GET',
    service: 'masterdata'
  })

  return response.records || []
}
