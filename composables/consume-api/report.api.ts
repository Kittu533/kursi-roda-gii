import { ref } from 'vue'
import type { Report, ReportFilter, Pagination } from '~/types/report'

export function useReportApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for reports
  const mockReports: Report[] = [
    {
      id: 'L0001',
      agentId: 'A0001',
      reportDate: '01/03/2025',
      totalPendapatan: 1201000,
      totalPengembalian: 0,
      totalTransaksi: 23,
      totalTersedia: 22,
      totalTersewa: 8,
      totalKerusakan: 1,
      jumlahPerawatan: 3,
      pembayaranMenunggu: 5,
      catatanTambahan: '',
      tanggalDibuat: '01/03/2025',
      terakhirDiperbarui: '12/03/2025',
      status: 'berhasil'
    },
    {
      id: 'L0002',
      agentId: 'A0002',
      reportDate: '01/03/2025',
      totalPendapatan: 350000,
      totalPengembalian: 0,
      totalTransaksi: 35,
      totalTersedia: 12,
      totalTersewa: 3,
      totalKerusakan: 0,
      jumlahPerawatan: 2,
      pembayaranMenunggu: 3,
      catatanTambahan: '',
      tanggalDibuat: '01/03/2025',
      terakhirDiperbarui: '12/03/2025',
      status: 'menunggu'
    },
    {
      id: 'L0003',
      agentId: 'A0003',
      reportDate: '01/03/2025',
      totalPendapatan: 240000,
      totalPengembalian: 0,
      totalTransaksi: 10,
      totalTersedia: 9,
      totalTersewa: 0,
      totalKerusakan: 0,
      jumlahPerawatan: 1,
      pembayaranMenunggu: 2,
      catatanTambahan: '',
      tanggalDibuat: '01/03/2025',
      terakhirDiperbarui: '12/03/2025',
      status: 'berhasil'
    },
    {
      id: 'L0004',
      agentId: 'A0004',
      reportDate: '01/03/2025',
      totalPendapatan: 780000,
      totalPengembalian: 0,
      totalTransaksi: 31,
      totalTersedia: 20,
      totalTersewa: 1,
      totalKerusakan: 0,
      jumlahPerawatan: 4,
      pembayaranMenunggu: 1,
      catatanTambahan: '',
      tanggalDibuat: '01/03/2025',
      terakhirDiperbarui: '12/03/2025',
      status: 'rusak'
    },
    {
      id: 'L0005',
      agentId: 'A0005',
      reportDate: '01/03/2025',
      totalPendapatan: 1000000,
      totalPengembalian: 0,
      totalTransaksi: 14,
      totalTersedia: 16,
      totalTersewa: 0,
      totalKerusakan: 0,
      jumlahPerawatan: 2,
      pembayaranMenunggu: 4,
      catatanTambahan: '',
      tanggalDibuat: '01/03/2025',
      terakhirDiperbarui: '12/03/2025',
      status: 'menunggu'
    }
  ]

  const getReports = async (filter: ReportFilter): Promise<{ data: Report[], pagination: Pagination }> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data with pagination
      return {
        data: mockReports,
        pagination: {
          currentPage: filter.page || 1,
          totalPages: 2,
          total: mockReports.length,
          itemsPerPage: filter.limit || 10
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch reports'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const getReportById = async (id: string): Promise<Report> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const report = mockReports.find(r => r.id === id)
      
      if (!report) {
        throw new Error('Report not found')
      }
      
      return report
    } catch (err) {
      error.value = 'Failed to fetch report details'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getReports,
    getReportById
  }
}