import { useApi } from '@/composables/use-fetch-api'
import type {
  CreateAgentPayload,
  AgentApiListResponse,
  AgentApiSingleResponse
} from '~/types/agent'

export const fetchAgents = async (params: Record<string, any> = {}) => {
  return await useApi<AgentApiListResponse>('/agent', {
    method: 'GET',
    service: 'auth', // Ensure the correct service is used
    query: params
  })
}



export const getAgentById = async (id: string) => {
  return await useApi<AgentApiSingleResponse>(`/agent/${id}`, {
    method: 'GET',
    service: 'auth' // Ensure the correct service is used
  })
}

export const createAgent = async (payload: CreateAgentPayload) => {
  return await useApi('/agent', {
    method: 'POST',
    service: 'auth', // Ensure the correct service is used
    body: payload
  })
}

export const updateAgent = async (id: string, payload: Partial<CreateAgentPayload>) => {
  return await useApi(`/agent/${id}`, {
    method: 'PUT',
    service: 'auth', // Ensure the correct service is used
    body: payload
  })
}

export const deleteAgent = async (id: string) => {
  return await useApi(`/agent/${id}`, {
    method: 'DELETE',
    service: 'auth' // Ensure the correct service is used
  })
}
