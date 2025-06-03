import { useApi } from '@/composables/use-fetch-api'
import type { Customer, CreateCustomerPayload, CustomerApiResponse } from '~/types/customer'


export const fetchCustomers = async (params: Record<string, any> = {}) => {
  return await useApi<CustomerApiResponse>('/customers', {
    method: 'GET',
    service: 'auth', // Tambahkan ini untuk memastikan base URL yang benar
    query: params
  })
}
export const getCustomerById = async (id: string) => {
  return await useApi<{ response: Customer }>(`/customers/${id}`, {
    method: 'GET',
    service: 'auth' // Tambahkan ini untuk memastikan base URL yang benar
  })
}

export const createCustomer = async (payload: CreateCustomerPayload) => {
  return await useApi('/customers', {
    method: 'POST',
    service: 'auth', // Tambahkan ini untuk memastikan base URL yang benar
    body: payload
  })
}
export const updateCustomer = async (id: string, payload: Partial<Customer>) => {
  return await useApi(`/customers/${id}`, {
    method: 'PUT',
    service: 'auth', // Tambahkan ini untuk memastikan base URL yang benar
    body: payload
  })
}


export const deleteCustomerApi = async (id: string) => {
  return await useApi(`/customers/${id}`, { method: 'DELETE', service: 'auth' })
}
