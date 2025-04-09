import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BookingTransaction, TransactionFilter, Pagination } from '~/types/transaction'
import { useBookingApi } from '~/composables/consume-api/booking.api'

export const useBookingStore = defineStore('booking', () => {
  const bookingApi = useBookingApi()
  
  // State
  const bookings = ref<BookingTransaction[]>([])
  const selectedBooking = ref<BookingTransaction | null>(null)
  const pagination = ref<Pagination | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<TransactionFilter>({
    page: 1,
    limit: 10,
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  })

  // Actions
  const loadBookings = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await bookingApi.getBookings(filter.value)
      bookings.value = result.data
      pagination.value = result.pagination
    } catch (err) {
      error.value = 'Failed to load booking transactions'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const loadBookingDetails = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      selectedBooking.value = await bookingApi.getBookingById(id)
    } catch (err) {
      error.value = 'Failed to load booking transaction details'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const setFilter = (newFilter: Partial<TransactionFilter>) => {
    filter.value = { ...filter.value, ...newFilter }
    loadBookings()
  }

  const resetFilter = () => {
    filter.value = {
      page: 1,
      limit: 10,
      status: '',
      startDate: '',
      endDate: '',
      search: ''
    }
    loadBookings()
  }

  return {
    bookings,
    selectedBooking,
    pagination,
    isLoading,
    error,
    filter,
    loadBookings,
    loadBookingDetails,
    setFilter,
    resetFilter
  }
})