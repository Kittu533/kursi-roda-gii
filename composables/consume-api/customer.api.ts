import { ref } from "vue"
import type { Customer, CustomerFilter, CustomerPagination } from "~/types/customer"
import { useApiClient } from "~/composables/use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockCustomers: Customer[] = [
  {
    id: "P0001",
    name: "Harman Prakoso",
    phone: "+6281234567890",
    email: "harman123@gmail.com",
    gender: "laki-laki",
    registerDate: "01/03/2025",
    lastLogin: "01/03/2025",
    status: "menunggu",
  },
  {
    id: "P0002",
    name: "Nasisa Fadilla",
    phone: "+6281234567890",
    email: "nasifadilla.26@gmail.com",
    gender: "perempuan",
    registerDate: "02/03/2025",
    lastLogin: "07/03/2025",
    status: "menunggu",
  },
  {
    id: "P0003",
    name: "Mia Anggreni",
    phone: "+6281234567890",
    email: "miaanggreni@gmail.com",
    gender: "perempuan",
    registerDate: "03/03/2025",
    lastLogin: "04/03/2025",
    status: "aktif",
  },
  {
    id: "P0004",
    name: "Finda Alifa",
    phone: "+6281234567890",
    email: "findal123@gmail.com",
    gender: "perempuan",
    registerDate: "04/03/2025",
    lastLogin: "09/03/2025",
    status: "dibatalkan",
  },
  {
    id: "P0005",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilhamdean0123@gmail.com",
    gender: "laki-laki",
    registerDate: "05/03/2025",
    lastLogin: "08/03/2025",
    status: "nonaktif",
  },
]

export function useCustomerApi() {
  const apiClient = useApiClient()
  const customers = ref<Customer[]>([...mockCustomers])

  // Get customers with filtering and pagination
  const getCustomers = async (filter?: CustomerFilter): Promise<CustomerPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<CustomerPagination>('/api/customers', filter)
    // return response.data

    // Filter logic
    let filteredCustomers = [...mockCustomers]

    if (filter?.status && filter.status !== "semua") {
      filteredCustomers = filteredCustomers.filter((customer) => customer.status === filter.status)
    }

    if (filter?.date) {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.registerDate === filter.date || customer.lastLogin === filter.date,
      )
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredCustomers.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredCustomers.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single customer by ID
  const getCustomerById = async (id: string): Promise<Customer | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Customer>(`/api/customers/${id}`)
    // return response.data

    const customer = mockCustomers.find((customer) => customer.id === id)
    return customer || null
  }

  // Create a new customer
  const createCustomer = async (customerData: Omit<Customer, "id">): Promise<Customer> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Customer>('/api/customers', customerData)
    // return response.data

    // Generate a new ID
    const newId = `P${String(mockCustomers.length + 1).padStart(4, "0")}`

    const newCustomer: Customer = {
      id: newId,
      ...customerData,
    }

    // Add to mock data
    mockCustomers.push(newCustomer)
    customers.value = [...mockCustomers]

    return newCustomer
  }

  // Update an existing customer
  const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Customer>(`/api/customers/${id}`, customerData)
    // return response.data

    const customerIndex = mockCustomers.findIndex((customer) => customer.id === id)

    if (customerIndex === -1) {
      return null
    }

    // Update the customer
    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...customerData,
    }

    mockCustomers[customerIndex] = updatedCustomer
    customers.value = [...mockCustomers]

    return updatedCustomer
  }

  // Delete a customer
  const deleteCustomer = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/customers/${id}`)

    const customerIndex = mockCustomers.findIndex((customer) => customer.id === id)

    if (customerIndex === -1) {
      return false
    }

    // Remove the customer
    mockCustomers.splice(customerIndex, 1)
    customers.value = [...mockCustomers]

    return true
  }

  return {
    ...apiClient,
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}

