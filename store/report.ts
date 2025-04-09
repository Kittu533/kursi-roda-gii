import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Report, ReportFilter, Pagination } from '~/types/report'
import { useReportApi } from '~/composables/consume-api/report.api'

export const useReportStore = defineStore('report', () => {
  const reportApi = useReportApi()
  
  // State
  const reports = ref<Report[]>([])
  const selectedReport = ref<Report | null>(null)
  const pagination = ref<Pagination | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<ReportFilter>({
    page: 1,
    limit: 10,
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  })

  // Actions
  const loadReports = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await reportApi.getReports(filter.value)
      reports.value = result.data
      pagination.value = result.pagination
    } catch (err) {
      error.value = 'Failed to load reports'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const loadReportDetails = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      selectedReport.value = await reportApi.getReportById(id)
    } catch (err) {
      error.value = 'Failed to load report details'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const setFilter = (newFilter: Partial<ReportFilter>) => {
    filter.value = { ...filter.value, ...newFilter }
    loadReports()
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
    loadReports()
  }

  return {
    reports,
    selectedReport,
    pagination,
    isLoading,
    error,
    filter,
    loadReports,
    loadReportDetails,
    setFilter,
    resetFilter
  }
})