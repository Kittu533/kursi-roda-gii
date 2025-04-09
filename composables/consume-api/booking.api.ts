import { ref } from 'vue'
import type { BookingTransaction, TransactionFilter, Pagination } from '~/types/transaction'

export function useBookingApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for bookings
  const mockBookings: BookingTransaction[] = [
    {
      id: 'T0001',
      voucherId: 'V0001',
      bookingId: 'B0001',
      amount: 350000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BRI',
      transactionDate: '01/03/2025',
      transactionTime: '08:00',
      status: 'batal',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'T0002',
      voucherId: 'V0002',
      bookingId: 'B0002',
      amount: 1200000,
      paymentMethod: 'QRIS',
      paymentDetail: 'QRIS',
      transactionDate: '01/03/2025',
      transactionTime: '11:00',
      status: 'berhasil',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'T0003',
      voucherId: 'V0003',
      bookingId: 'B0003',
      amount: 525000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BCA',
      transactionDate: '02/03/2025',
      transactionTime: '09:20',
      status: 'berhasil',
      createdAt: '02/03/2025',
      updatedAt: '02/03/2025'
    },
    {
      id: 'T0004',
      voucherId: 'V0004',
      bookingId: 'B0004',
      amount: 560000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BRI',
      transactionDate: '03/03/2025',
      transactionTime: '07:00',
      status: 'gagal',
      createdAt: '03/03/2025',
      updatedAt: '03/03/2025'
    },
    {
      id: 'T0005',
      voucherId: 'V0005',
      bookingId: 'B0005',
      amount: 810000,
      paymentMethod: 'CC',
      paymentDetail: 'CIMB',
      transactionDate: '05/03/2025',
      transactionTime: '06:15',
      status: 'tertunda',
      createdAt: '05/03/2025',
      updatedAt: '05/03/2025'
    }
    ,
    {
      id: 'T0006',
      voucherId: 'V0005',
      bookingId: 'B0005',
      amount: 810000,
      paymentMethod: 'CC',
      paymentDetail: 'CIMB',
      transactionDate: '05/03/2025',
      transactionTime: '06:15',
      status: 'tertunda',
      createdAt: '05/03/2025',
      updatedAt: '05/03/2025'
    },
    {
      id: 'T0007',
      voucherId: 'V0005',
      bookingId: 'B0005',
      amount: 810000,
      paymentMethod: 'CC',
      paymentDetail: 'CIMB',
      transactionDate: '05/03/2025',
      transactionTime: '06:15',
      status: 'tertunda',
      createdAt: '05/03/2025',
      updatedAt: '05/03/2025'
    }
  ]

  const getBookings = async (filter: TransactionFilter): Promise<{ data: BookingTransaction[], pagination: Pagination }> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data with pagination
      return {
        data: mockBookings,
        pagination: {
          currentPage: filter.page || 1,
          totalPages: 2,
          total: mockBookings.length,
          itemsPerPage: filter.limit || 10
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch booking transactions'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const getBookingById = async (id: string): Promise<BookingTransaction> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const booking = mockBookings.find(b => b.id === id)
      
      if (!booking) {
        throw new Error('Booking transaction not found')
      }
      
      return booking
    } catch (err) {
      error.value = 'Failed to fetch booking transaction details'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getBookings,
    getBookingById
  }
}