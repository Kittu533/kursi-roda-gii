import { useApi } from '@/composables/use-fetch-api'
import type {
  GuideApiListResponse,
  GuideApiSingleResponse,
  CreateGuidePayload
} from '~/types/guide'

export const fetchGuides = async (params: Record<string, any> = {}) => {
  return await useApi<GuideApiListResponse>('/guide', {
    method: 'GET',
    query: params
  })
}

export const getGuideById = async (id: string) => {
  return await useApi<GuideApiSingleResponse>(`/guide/${id}`, {
    method: 'GET'
  })
}

export const createGuide = async (payload: CreateGuidePayload) => {
  return await useApi('/guide', {
    method: 'POST',
    body: payload
  })
}

export const updateGuide = async (id: string, payload: Partial<CreateGuidePayload>) => {
  return await useApi(`/guide/${id}`, {
    method: 'PUT',
    body: payload
  })
}

export const deleteGuide = async (id: string) => {
  return await useApi(`/guide/${id}`, {
    method: 'DELETE'
  })
}
