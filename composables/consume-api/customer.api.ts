import { useApi } from '@/composables/use-fetch-api'
import type { Customer, CreateCustomerPayload, CustomerApiResponse } from '~/types/customer'


export const fetchCustomers = async (params: Record<string, any> = {}) => {
  return await useApi<CustomerApiResponse>('/customers', {
    method: 'GET',
    query: params
  })
}
export const getCustomerById = async (id: string) => {
  return await useApi<{ response: Customer }>(`/customers/${id}`, {
    method: 'GET',
    
  })
}

export const createCustomer = async (payload: CreateCustomerPayload) => {
  return await useApi('/customers', {
    method: 'POST',
    body: payload
  })
}
export const updateCustomer = async (id: string, payload: Partial<Customer>) => {
  return await useApi(`/customers/${id}`, {
    method: 'PUT',
    body: payload
  })
}


export const deleteCustomerApi = async (id: string) => {
  return await useApi(`/customers/${id}`, { method: 'DELETE' })
}
