// consume-api/voucher-status.api.ts
import { useApi } from '@/composables/use-fetch-api'

export interface VoucherStatus {
  id: string
  status: string
}

export interface VoucherStatusApiResponse {
  response: {
    records: VoucherStatus[]
  }
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

const BASE_URL = '/voucher-status/admin'

export const fetchVoucherStatuses = async () => {
  return await useApi<VoucherStatusApiResponse>(BASE_URL, {
    method: 'GET',
    service: 'masterdata'
  })
}
