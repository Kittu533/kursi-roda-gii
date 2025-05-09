import { defineStore } from 'pinia'
import {
  fetchCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomerApi,
} from '@/composables/consume-api/customer.api'
import { useApi } from '@/composables/use-fetch-api'
import type { 
  Customer, 
  CreateCustomerPayload, 
  CustomerFilter,
  CustomerPagination
} from '~/types/customer'

interface CustomerStoreState {
  customers: Customer[]
  pagination: CustomerPagination | null
  filter: CustomerFilter
  selectedCustomer: Customer | null
  isLoading: boolean
  error: string | null
}

export const useCustomerStore = defineStore('customer', {
  state: (): CustomerStoreState => ({
    customers: [],
    pagination: null,
    filter: {
      name: '',
      status: '',
      page: 1,
      itemsPerPage: 5
    },
    selectedCustomer: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadCustomers(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        const res = await fetchCustomers(this.filter)
        this.customers = res.response.records

        this.pagination = {
          page: res.response.page.batch_number,
          totalItems: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load customers'
        console.error('Error loading customers:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getCustomerDetail(id: string): Promise<Customer | null> {
      try {
        this.isLoading = true
        this.error = null
        const response = await getCustomerById(id)
        this.selectedCustomer = response.response
        return this.selectedCustomer
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get customer details'
        console.error('Error getting customer details:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedCustomer(): void {
      this.selectedCustomer = null
    },

    setFilter(filter: Partial<CustomerFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadCustomers()
    },

    resetFilter(): void {
      this.filter = {
        name: '',
        status: '',
        page: 1,
        itemsPerPage: 5
      }
      this.loadCustomers()
    },

    async createNewCustomer(data: CreateCustomerPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await createCustomer(data)
        // Refresh the customer list after creating a new customer
        await this.loadCustomers()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create customer'
        console.error('Error creating customer:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Updated to use proper type definitions instead of 'any'
    async createCustomerRaw(payload: CreateCustomerPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        // Direct API call using useApi
        const result = await useApi<unknown>('/customers', {
          method: 'POST',
          body: payload
        })

        // Refresh the customer list after creating a new customer
        await this.loadCustomers()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create customer'
        console.error('Error creating customer:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateCustomer(id: string, data: Partial<Customer>): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        // Use the imported updateCustomer function
        const result = await updateCustomer(id, data)

        // Refresh customer data
        if (this.selectedCustomer?.id === id) {
          await this.getCustomerDetail(id)
        }
        await this.loadCustomers()

        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update customer'
        console.error('Error updating customer:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteCustomer(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        await deleteCustomerApi(id)
        this.customers = this.customers.filter(c => c.id !== id)
        if (this.selectedCustomer?.id === id) this.clearSelectedCustomer()
        await this.loadCustomers()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete customer'
      } finally {
        this.isLoading = false
      }
    }
  }
})