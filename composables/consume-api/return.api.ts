import { ref } from 'vue'
import type { Return, ReturnFilter, Pagination } from '~/types/return'

export function useReturnApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for returns
  const mockReturns: Return[] = [
    {
      id: 'R0001',
      transactionId: 'T0001',
      customerId: 'P0001',
      amount: 525000,
      reason: 'Produk rusak',
      returnDate: '01/03/2025',
      returnTime: '08:00',
      status: 'berhasil',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'R0002',
      transactionId: 'T0002',
      customerId: 'P0002',
      amount: 350000,
      reason: 'Produk tidak sesuai',
      returnDate: '01/03/2025',
      returnTime: '08:00',
      status: 'menunggu',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'R0003',
      transactionId: 'T0003',
      customerId: 'P0003',
      amount: 240000,
      reason: 'Pengiriman terlambat',
      returnDate: '01/03/2025',
      returnTime: '09:00',
      status: 'berhasil',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'R0004',
      transactionId: 'T0004',
      customerId: 'P0004',
      amount: 780000,
      reason: 'Garansi tidak sesuai',
      returnDate: '01/03/2025',
      returnTime: '08:00',
      status: 'rusak',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'R0005',
      transactionId: 'T0005',
      customerId: 'P0005',
      amount: 1000000,
      reason: 'Produk rusak',
      returnDate: '01/03/2025',
      returnTime: '09:00',
      status: 'menunggu',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    }
  ]

  const getReturns = async (filter: ReturnFilter): Promise<{ data: Return[], pagination: Pagination }> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data with pagination
      return {
        data: mockReturns,
        pagination: {
          currentPage: filter.page || 1,
          totalPages: 2,
          total: mockReturns.length,
          itemsPerPage: filter.limit || 10
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch returns'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const getReturnById = async (id: string): Promise<Return> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const returnItem = mockReturns.find(r => r.id === id)
      
      if (!returnItem) {
        throw new Error('Return not found')
      }
      
      return returnItem
    } catch (err) {
      error.value = 'Failed to fetch return details'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getReturns,
    getReturnById
  }
}