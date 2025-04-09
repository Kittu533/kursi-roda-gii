import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WithdrawTransaction, TransactionFilter, Pagination } from '~/types/transaction'
import { useWithdrawApi } from '~/composables/consume-api/withdraw.api'

export const useWithdrawStore = defineStore('withdraw', () => {
  const withdrawApi = useWithdrawApi()
  
  // State
  const withdraws = ref<WithdrawTransaction[]>([])
  const selectedWithdraw = ref<WithdrawTransaction | null>(null)
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
  const loadWithdraws = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await withdrawApi.getWithdraws(filter.value)
      withdraws.value = result.data
      pagination.value = result.pagination
    } catch (err) {
      error.value = 'Failed to load withdraw transactions'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const loadWithdrawDetails = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      selectedWithdraw.value = await withdrawApi.getWithdrawById(id)
    } catch (err) {
      error.value = 'Failed to load withdraw transaction details'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const setFilter = (newFilter: Partial<TransactionFilter>) => {
    filter.value = { ...filter.value, ...newFilter }
    loadWithdraws()
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
    loadWithdraws()
  }

  return {
    withdraws,
    selectedWithdraw,
    pagination,
    isLoading,
    error,
    filter,
    loadWithdraws,
    loadWithdrawDetails,
    setFilter,
    resetFilter
  }
})