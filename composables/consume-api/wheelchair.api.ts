import { useApi } from '@/composables/use-fetch-api'
import type {
  WheelchairApiListResponse,
  WheelchairApiSingleResponse,
  CreateWheelchairPayload
} from '~/types/wheelchair'

const BASE_PATH = '/wheelchair/admin'

export const fetchWheelchairs = async (params: Record<string, any> = {}) => {
  return await useApi<WheelchairApiListResponse>(BASE_PATH, {
    method: 'GET',
    query: params,
    service: 'core' // ✅ Tambahkan ini
  })
}

export const getWheelchairById = async (id: string) => {
  return await useApi<WheelchairApiSingleResponse>(`${BASE_PATH}/${id}`, {
    method: 'GET',
    service: 'core' // ✅ Tambahkan ini
  })
}

export const createWheelchair = async (payload: CreateWheelchairPayload) => {
  return await useApi(BASE_PATH, {
    method: 'POST',
    body: payload,
    service: 'core' // ✅ Tambahkan ini
  })
}

export const updateWheelchair = async (id: string, payload: Partial<CreateWheelchairPayload>) => {
  return await useApi(`${BASE_PATH}/${id}`, {
    method: 'PATCH',
    body: payload,
    service: 'core' // ✅ Tambahkan ini
  })
}

export const deleteWheelchair = async (id: string) => {
  return await useApi(`${BASE_PATH}/${id}`, {
    method: 'DELETE',
    service: 'core' // ✅ Tambahkan ini
  })
}
