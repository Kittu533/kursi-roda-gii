import { useApi } from '@/composables/use-fetch-api'
import type {
  ModelApiListResponse,
  ModelApiSingleResponse,
  CreateModelPayload
} from '~/types/model'

const BASE_PATH = '/model/admin' // sesuai backend kamu

export const fetchModels = async (params: Record<string, any> = {}) => {
  return await useApi<ModelApiListResponse>(BASE_PATH, {
    method: 'GET',
    service: 'masterdata', // ✅ ini WAJIB!
    query: params
  })
}

export const getModelById = async (id: string) => {
  return await useApi<ModelApiSingleResponse>(`${BASE_PATH}/${id}`, {
    method: 'GET',
    service: 'masterdata' // ✅ ini juga!
  })
}

export const createModel = async (payload: CreateModelPayload) => {
  return await useApi(`${BASE_PATH}`, {
    method: 'POST',
    service: 'masterdata',
    body: payload
  })
}

export const updateModel = async (id: string, payload: Partial<CreateModelPayload>) => {
  return await useApi(`${BASE_PATH}/${id}`, {
    method: 'PATCH',
    service: 'masterdata',
    body: payload
  })
}

export const deleteModel = async (id: string) => {
  return await useApi(`${BASE_PATH}/${id}`, {
    method: 'DELETE',
    service: 'masterdata'
  })
}
