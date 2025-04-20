import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReturnItem, ReturnFilter, Pagination } from '~/types/return-agent'
import { useReturnApi } from '~/composables/consume-api/return-agent.api'

export const useReturnItemStore = defineStore('return', () => {
  const returnApi = useReturnApi()
  
  // State
  const returns = ref<ReturnItem[]>([])
  const selectedReturn = ref<ReturnItem | null>(null)
  const pagination = ref<Pagination | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<ReturnFilter>({
    page: 1,
    limit: 10,
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  })

  // Actions
  const loadReturns = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await returnApi.getReturns(filter.value)
      returns.value = result.data
      pagination.value = result.pagination
    } catch (err) {
      error.value = 'Failed to load returns'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const loadReturnDetails = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      selectedReturn.value = await returnApi.getReturnById(id)
    } catch (err) {
      error.value = 'Failed to load return details'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const setFilter = (newFilter: Partial<ReturnFilter>) => {
    filter.value = { ...filter.value, ...newFilter }
    loadReturns()
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
    loadReturns()
  }

  return {
    returns,
    selectedReturn,
    pagination,
    isLoading,
    error,
    filter,
    loadReturns,
    loadReturnDetails,
    setFilter,
    resetFilter
  }
})