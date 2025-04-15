import { ref } from "vue"
import type { Voucher, VoucherFilter, VoucherPagination } from "~/types/voucher"
import { useApiClient } from "~/composables/use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockVouchers: Voucher[] = [
  {
    idVoucher: "V0001",
    kodeVoucher: "A0003",
    nilaiVoucher: "Rp50.000",
    persenVoucher: "25%",
    tanggalBerlaku: "01/01/2025",
    tanggalBerakhir: "10/01/2025",
    jumlahVoucher: 50,
    voucherTerpakai: 4,
    status: "nonaktif"
  },
  {
    idVoucher: "V0002",
    kodeVoucher: "A0003",
    nilaiVoucher: "Rp50.000",
    persenVoucher: "25%",
    tanggalBerlaku: "01/01/2025",
    tanggalBerakhir: "10/01/2025",
    jumlahVoucher: 50,
    voucherTerpakai: 5,
    status: "nonaktif"
  },
  {
    idVoucher: "V0003",
    kodeVoucher: "A0003",
    nilaiVoucher: "Rp50.000",
    persenVoucher: "25%",
    tanggalBerlaku: "01/01/2025",
    tanggalBerakhir: "10/01/2025",
    jumlahVoucher: 50,
    voucherTerpakai: 4,
    status: "aktif"
  },
  {
    idVoucher: "V0004",
    kodeVoucher: "A0003",
    nilaiVoucher: "Rp50.000",
    persenVoucher: "25%",
    tanggalBerlaku: "01/01/2025",
    tanggalBerakhir: "10/01/2025",
    jumlahVoucher: 50,
    voucherTerpakai: 5,
    status: "expired"
  },
  {
    idVoucher: "V0005",
    kodeVoucher: "A0003",
    nilaiVoucher: "Rp50.000",
    persenVoucher: "25%",
    tanggalBerlaku: "01/01/2025",
    tanggalBerakhir: "10/01/2025",
    jumlahVoucher: 50,
    voucherTerpakai: 4,
    status: "nonaktif"
  },
  {
    idVoucher: "V0006",
    kodeVoucher: "B0001",
    nilaiVoucher: "Rp100.000",
    persenVoucher: "30%",
    tanggalBerlaku: "05/01/2025",
    tanggalBerakhir: "15/01/2025",
    jumlahVoucher: 30,
    voucherTerpakai: 10,
    status: "aktif"
  },
  {
    idVoucher: "V0007",
    kodeVoucher: "B0002",
    nilaiVoucher: "Rp75.000",
    persenVoucher: "20%",
    tanggalBerlaku: "10/01/2025",
    tanggalBerakhir: "20/01/2025",
    jumlahVoucher: 40,
    voucherTerpakai: 0,
    status: "nonaktif"
  }
]

export function useVoucherApi() {
  const apiClient = useApiClient()
  const vouchers = ref<Voucher[]>([...mockVouchers])

  // Get vouchers with filtering and pagination
  const getVouchers = async (filter?: VoucherFilter): Promise<VoucherPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<VoucherPagination>('/api/vouchers', filter)
    // return response.data

    // Filter logic
    let filteredVouchers = [...mockVouchers]

    if (filter?.status && filter.status !== "semua") {
      filteredVouchers = filteredVouchers.filter((voucher) => voucher.status === filter.status)
    }

    if (filter?.startDate) {
      filteredVouchers = filteredVouchers.filter(
        (voucher) => new Date(voucher.tanggalBerlaku) >= new Date(filter.startDate!)
      )
    }

    if (filter?.endDate) {
      filteredVouchers = filteredVouchers.filter(
        (voucher) => new Date(voucher.tanggalBerakhir) <= new Date(filter.endDate!)
      )
    }

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      filteredVouchers = filteredVouchers.filter(
        (voucher) => 
          voucher.idVoucher.toLowerCase().includes(searchLower) || 
          voucher.kodeVoucher.toLowerCase().includes(searchLower)
      )
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredVouchers.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredVouchers.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single voucher by ID
  const getVoucherById = async (id: string): Promise<Voucher | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Voucher>(`/api/vouchers/${id}`)
    // return response.data

    const voucher = mockVouchers.find((voucher) => voucher.idVoucher === id)
    return voucher || null
  }

  // Create a new voucher
  const createVoucher = async (voucherData: Omit<Voucher, "idVoucher">): Promise<Voucher> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Voucher>('/api/vouchers', voucherData)
    // return response.data

    // Generate a new ID
    const newId = `V${String(mockVouchers.length + 1).padStart(4, "0")}`

    const newVoucher: Voucher = {
      idVoucher: newId,
      ...voucherData,
    }

    // Add to mock data
    mockVouchers.push(newVoucher)
    vouchers.value = [...mockVouchers]

    return newVoucher
  }

  // Update an existing voucher
  const updateVoucher = async (id: string, voucherData: Partial<Voucher>): Promise<Voucher | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Voucher>(`/api/vouchers/${id}`, voucherData)
    // return response.data

    const voucherIndex = mockVouchers.findIndex((voucher) => voucher.idVoucher === id)

    if (voucherIndex === -1) {
      return null
    }

    // Update the voucher
    const updatedVoucher = {
      ...mockVouchers[voucherIndex],
      ...voucherData,
    }

    mockVouchers[voucherIndex] = updatedVoucher
    vouchers.value = [...mockVouchers]

    return updatedVoucher
  }

  // Delete a voucher
  const deleteVoucher = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/vouchers/${id}`)

    const voucherIndex = mockVouchers.findIndex((voucher) => voucher.idVoucher === id)

    if (voucherIndex === -1) {
      return false
    }

    // Remove the voucher
    mockVouchers.splice(voucherIndex, 1)
    vouchers.value = [...mockVouchers]

    return true
  }

  return {
    ...apiClient,
    getVouchers,
    getVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  }
}