import { useApi } from '@/composables/use-fetch-api'
import type {
  CreateAgentPayload,
  AgentApiListResponse,
  AgentApiSingleResponse
} from '~/types/agent'

export const fetchAgents = async (params: Record<string, any> = {}) => {
  return await useApi<AgentApiListResponse>('/agent', {
    method: 'GET',
    query: params
  })
}



export const getAgentById = async (id: string) => {
  return await useApi<AgentApiSingleResponse>(`/agent/${id}`, {
    method: 'GET'
  })
}

export const createAgent = async (payload: CreateAgentPayload) => {
  return await useApi('/agent', {
    method: 'POST',
    body: payload
  })
}

export const updateAgent = async (id: string, payload: Partial<CreateAgentPayload>) => {
  return await useApi(`/agent/${id}`, {
    method: 'PUT',
    body: payload
  })
}

export const deleteAgent = async (id: string) => {
  return await useApi(`/agent/${id}`, {
    method: 'DELETE'
  })
}
