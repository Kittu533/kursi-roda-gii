import { useApi } from '@/composables/use-fetch-api'
import type {
  GuideApiListResponse,
  GuideApiSingleResponse,
  CreateGuidePayload
} from '~/types/guide'

export const fetchGuides = async (params: Record<string, any> = {}) => {
  return await useApi<GuideApiListResponse>('/guides', {
    method: 'GET',
    query: params
  })
}

export const getGuideById = async (id: string) => {
  return await useApi<GuideApiSingleResponse>(`/guides/${id}`, {
    method: 'GET'
  })
}

export const createGuide = async (payload: CreateGuidePayload) => {
  return await useApi('/guides', {
    method: 'POST',
    body: payload
  })
}

export const updateGuide = async (id: string, payload: Partial<CreateGuidePayload>) => {
  return await useApi(`/guides/${id}`, {
    method: 'PUT',
    body: payload
  })
}

export const deleteGuide = async (id: string) => {
  return await useApi(`/guides/${id}`, {
    method: 'DELETE'
  })
}
