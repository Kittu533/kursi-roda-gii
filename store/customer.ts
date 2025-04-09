import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Customer, CustomerFilter } from "~/types/customer"
import { useCustomers } from "~/composables/users/use-customer"
import { useNotification } from "~/composables/use-notification"

export const useCustomerStore = defineStore("customer", () => {
  // Composables
  const {
    customers: customersRef,
    selectedCustomer: selectedCustomerRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchCustomers,
    fetchCustomerById,
    saveCustomer,
    removeCustomer,
  } = useCustomers()

  const notification = useNotification()

  // State
  const filter = ref<CustomerFilter>({
    status: "",
    date: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadCustomers = async () => {
    try {
      const result = await fetchCustomers(filter.value)
      return result
    } catch (e) {
      notification.error("Failed to load customers")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<CustomerFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadCustomers()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      date: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadCustomers()
  }

  const loadCustomerDetails = async (id: string) => {
    try {
      return await fetchCustomerById(id)
    } catch (e) {
      notification.error("Failed to load customer details")
      throw e
    }
  }

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const result = await saveCustomer({ id, ...customerData })
      notification.success("Customer updated successfully")
      return result
    } catch (e) {
      notification.error("Failed to update customer")
      throw e
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const result = await removeCustomer(id)
      if (result) {
        notification.success("Customer deleted successfully")
        await loadCustomers()
      }
      return result
    } catch (e) {
      notification.error("Failed to delete customer")
      throw e
    }
  }

  // Getters
  const customers = computed(() => customersRef.value)
  const selectedCustomer = computed(() => selectedCustomerRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    customers,
    selectedCustomer,
    pagination,
    isLoading,
    error,

    // Actions
    loadCustomers,
    setFilter,
    resetFilter,
    loadCustomerDetails,
    updateCustomer,
    deleteCustomer,
  }
})

