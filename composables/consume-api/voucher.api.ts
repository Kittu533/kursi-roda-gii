import { useApi } from '@/composables/use-fetch-api'
import type {
  Voucher,
  CreateVoucherPayload,
  VoucherApiListResponse,
  VoucherApiSingleResponse
} from '~/types/voucher'

const BASE_URL = '/voucher/admin'

export const fetchVouchers = async (params: Record<string, any> = {}) => {
  return await useApi<VoucherApiListResponse>(BASE_URL, {
    method: 'GET',
    query: params,
    service: 'masterdata' // atau 'masterdata' jika pakai multi-service
  })
}

export const getVoucherById = async (id: string) => {
  return await useApi<VoucherApiSingleResponse>(`${BASE_URL}/${id}`, {
    method: 'GET',
    service: 'masterdata'
  })
}

export const createVoucher = async (payload: CreateVoucherPayload) => {
  return await useApi(BASE_URL, {
    method: 'POST',
    body: payload,
    service: 'masterdata'
  })
}

export const updateVoucher = async (id: string, payload: Partial<CreateVoucherPayload>) => {
  return await useApi(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: payload,
    service: 'masterdata'
  })
}

export const deleteVoucher = async (id: string) => {
  return await useApi(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    service: 'masterdata'
  })
}
