import { useApi } from '@/composables/use-fetch-api'
import type {
  GuideApiListResponse,
  GuideApiSingleResponse,
  CreateGuidePayload
} from '~/types/guide'

export const fetchGuides = async (params: Record<string, any> = {}) => {
  return await useApi<GuideApiListResponse>('/guide', {
    method: 'GET',
    service: 'auth', // Pastikan service yang benar digunakan
    query: params
  })
}

export const getGuideById = async (id: string) => {
  return await useApi<GuideApiSingleResponse>(`/guide/${id}`, {
    method: 'GET',
    service: 'auth'
  })
}

export const createGuide = async (payload: CreateGuidePayload) => {
  return await useApi('/guide', {
    method: 'POST',
    service: 'auth', // Pastikan service yang benar digunakan
    body: payload
  })
}

export const updateGuide = async (id: string, payload: Partial<CreateGuidePayload>) => {
  return await useApi(`/guide/${id}`, {
    method: 'PUT',
    service: 'auth', // Pastikan service yang benar digunakan
    body: payload
  })
}

export const deleteGuide = async (id: string) => {
  return await useApi(`/guide/${id}`, {
    method: 'DELETE',
    service: 'auth' // Pastikan service yang benar digunakan
  })
}
