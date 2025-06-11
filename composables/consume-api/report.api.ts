import { useApi } from '@/composables/use-fetch-api'
import type { Report, ReportListResponse, CreateReportPayload, ReportSingleResponse } from '~/types/report'

// GET /report/admin (list)
export const fetchReports = async (params: Record<string, any> = {}) => {
  return await useApi<ReportListResponse>('/report/admin', {
    method: 'GET',
    query: params,
    service: 'core', // Ganti sesuai kebutuhan, misal 'core'
  })
}

// GET /report/admin/:id
export const getReportById = async (id: string) => {
  return await useApi<ReportSingleResponse>(`/report/admin/${id}`, {
    method: 'GET',
    service: 'core',
  })
}

// POST /report/admin
export const createReport = async (payload: CreateReportPayload) => {
  return await useApi('/report/admin', {
    method: 'POST',
    body: payload,
    service: 'core',
  })
}
