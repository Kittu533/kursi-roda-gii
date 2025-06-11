import { defineStore } from 'pinia'
import { fetchReports, getReportById, createReport } from '@/composables/consume-api/report.api'
import type { Report, ReportListResponse, ReportSingleResponse, CreateReportPayload } from '~/types/report'

interface ReportPagination {
  currentPage: number
  total: number
  totalPages: number
  itemsPerPage: number
  data: Report[]
}

interface ReportFilter {
  agent_id?: string
  report_date?: string
  page?: number
  itemsPerPage?: number
}

interface ReportStoreState {
  reports: Report[]
  pagination: ReportPagination | null
  filter: ReportFilter
  selectedReport: Report | null
  isLoading: boolean
  error: string | null
}

export const useReportStore = defineStore('report', {
  state: (): ReportStoreState => ({
    reports: [],
    pagination: null,
    filter: {
      agent_id: '',
      report_date: '',
      page: 1,
      itemsPerPage: 10
    },
    selectedReport: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadReports(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        const res = await fetchReports(this.filter)
        this.reports = res.response.records

        this.pagination = {
          currentPage: res.response.page.batch_number,
          total: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size,
          data: res.response.records
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load reports'
        console.error('Error loading reports:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getReportDetail(id: string): Promise<Report | null> {
      try {
        this.isLoading = true
        this.error = null
        const res = await getReportById(id)
        this.selectedReport = res.response
        return this.selectedReport
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get report detail'
        console.error('Error getting report detail:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedReport(): void {
      this.selectedReport = null
    },

    setFilter(filter: Partial<ReportFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadReports()
    },

    resetFilter(): void {
      this.filter = {
        agent_id: '',
        report_date: '',
        page: 1,
        itemsPerPage: 10
      }
      this.loadReports()
    },

    async createNewReport(data: CreateReportPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await createReport(data)
        await this.loadReports()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create report'
        console.error('Error creating report:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
