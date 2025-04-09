import { ref, computed } from "vue"
import type { Customer, CustomerFilter, CustomerPagination } from "~/types/customer"
import { useCustomerApi } from "~/composables/consume-api/customer.api"

export function useCustomers() {
  const customerApi = useCustomerApi()

  // State
  const customers = ref<Customer[]>([])
  const selectedCustomer = ref<Customer | null>(null)
  const pagination = ref<CustomerPagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: 5,
    data: [],
  })

  // Methods
  const fetchCustomers = async (filter?: CustomerFilter) => {
    const result = await customerApi.getCustomers(filter)
    pagination.value = result
    customers.value = result.data
    return result
  }

  const fetchCustomerById = async (id: string) => {
    selectedCustomer.value = await customerApi.getCustomerById(id)
    return selectedCustomer.value
  }

  const saveCustomer = async (customerData: Partial<Customer>) => {
    if (selectedCustomer.value) {
      // Update existing customer
      selectedCustomer.value = (await customerApi.updateCustomer(selectedCustomer.value.id, customerData)) as Customer
    } else {
      // Create new customer
      selectedCustomer.value = await customerApi.createCustomer(customerData as Omit<Customer, "id">)
    }

    return selectedCustomer.value
  }

  const removeCustomer = async (id: string) => {
    return await customerApi.deleteCustomer(id)
  }

  // Computed
  const isLoading = computed(() => customerApi.isLoading.value)
  const error = computed(() => customerApi.error.value)

  return {
    // State
    customers,
    selectedCustomer,
    pagination,
    isLoading,
    error,

    // Methods
    fetchCustomers,
    fetchCustomerById,
    saveCustomer,
    removeCustomer,
  }
}

