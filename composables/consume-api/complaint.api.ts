import type { Complaint, ComplaintFilter, ComplaintPagination } from "~/types/complaint"
import { useApiClient } from "../use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockComplaints: Complaint[] = [
  {
    id: "1",
    complaintId: "K0001",
    customerId: "P0001",
    transactionId: "T0001",
    type: "Kerusakan produk",
    description: "Roda macet dan sulit digerakkan",
    startDate: "01/03/2025",
    completionDate: "03/03/2025",
    status: "Open"
  },
  {
    id: "2",
    complaintId: "K0002",
    customerId: "P0002",
    transactionId: "T0002",
    type: "Produk tidak sesuai",
    description: "Produk yang diterima tidak sesuai dengan yang dipesan",
    startDate: "01/03/2025",
    completionDate: "01/03/2025",
    status: "Forwarded"
  },
  {
    id: "3",
    complaintId: "K0003",
    customerId: "P0003",
    transactionId: "T0003",
    type: "Pelayanan agen",
    description: "Agen tidak responsif",
    startDate: "01/03/2025",
    completionDate: "01/03/2025",
    status: "Resolved"
  },
  {
    id: "4",
    complaintId: "K0004",
    customerId: "P0004",
    transactionId: "T0004",
    type: "Kerusakan produk",
    description: "Pijakan kaki rusak",
    startDate: "01/03/2025",
    completionDate: "01/03/2025",
    status: "Rejected"
  },
  {
    id: "5",
    complaintId: "K0005",
    customerId: "P0005",
    transactionId: "T0005",
    type: "Keterlambatan pengiriman",
    description: "Kurir terlambat mengirim",
    startDate: "01/03/2025",
    completionDate: "01/03/2025",
    status: "Resolved"
  },
  {
    id: "6",
    complaintId: "K0006",
    customerId: "P0006",
    transactionId: "T0006",
    type: "Kerusakan produk",
    description: "Rem tidak berfungsi dengan baik",
    startDate: "02/03/2025",
    completionDate: "04/03/2025",
    status: "Open"
  },
  {
    id: "7",
    complaintId: "K0007",
    customerId: "P0007",
    transactionId: "T0007",
    type: "Pelayanan agen",
    description: "Kesalahan informasi dari agen",
    startDate: "02/03/2025",
    completionDate: "03/03/2025",
    status: "Forwarded"
  },
  {
    id: "8",
    complaintId: "K0008",
    customerId: "P0008",
    transactionId: "T0008",
    type: "Produk tidak sesuai",
    description: "Warna kursi roda berbeda",
    startDate: "03/03/2025",
    completionDate: "05/03/2025",
    status: "Open"
  },
  {
    id: "9",
    complaintId: "K0009",
    customerId: "P0009",
    transactionId: "T0009",
    type: "Keterlambatan pengiriman",
    description: "Pengiriman melebihi estimasi",
    startDate: "03/03/2025",
    completionDate: "04/03/2025",
    status: "Resolved"
  },
  {
    id: "10",
    complaintId: "K0010",
    customerId: "P0010",
    transactionId: "T0010",
    type: "Kerusakan produk",
    description: "Sandaran punggung lepas",
    startDate: "04/03/2025",
    completionDate: "06/03/2025",
    status: "Open"
  },
  {
    id: "11",
    complaintId: "K0011",
    customerId: "P0011",
    transactionId: "T0011",
    type: "Pelayanan agen",
    description: "Agen tidak menjelaskan garansi",
    startDate: "04/03/2025",
    completionDate: "05/03/2025",
    status: "Forwarded"
  },
  {
    id: "12",
    complaintId: "K0012",
    customerId: "P0012",
    transactionId: "T0012",
    type: "Produk tidak sesuai",
    description: "Ukuran kursi terlalu kecil",
    startDate: "05/03/2025",
    completionDate: "07/03/2025",
    status: "Rejected"
  },
  {
    id: "13",
    complaintId: "K0013",
    customerId: "P0013",
    transactionId: "T0013",
    type: "Keterlambatan pengiriman",
    description: "Alamat pengiriman salah",
    startDate: "05/03/2025",
    completionDate: "06/03/2025",
    status: "Resolved"
  },
  {
    id: "14",
    complaintId: "K0014",
    customerId: "P0014",
    transactionId: "T0014",
    type: "Kerusakan produk",
    description: "Ban kempes setelah pengiriman",
    startDate: "06/03/2025",
    completionDate: "08/03/2025",
    status: "Open"
  },
  {
    id: "15",
    complaintId: "K0015",
    customerId: "P0015",
    transactionId: "T0015",
    type: "Pelayanan agen",
    description: "Kesulitan menghubungi layanan purna jual",
    startDate: "06/03/2025",
    completionDate: "07/03/2025",
    status: "Forwarded"
  }
]
// State lokal mock
const complaints = ref<Complaint[]>([...mockComplaints])

export function useComplaintApi() {
  const apiClient = useApiClient()

  const getComplaints = async (filter?: ComplaintFilter): Promise<ComplaintPagination> => {
    let filtered = [...complaints.value]

    if (filter?.complaintId) {
      filtered = filtered.filter(c => c.complaintId.toLowerCase().includes(filter.complaintId.toLowerCase()))
    }
    if (filter?.customerId) {
      filtered = filtered.filter(c => c.customerId.toLowerCase().includes(filter.customerId.toLowerCase()))
    }
    if (filter?.transactionId) {
      filtered = filtered.filter(c => c.transactionId.toLowerCase().includes(filter.transactionId.toLowerCase()))
    }
    if (filter?.type) {
      filtered = filtered.filter(c => c.type.toLowerCase().includes(filter.type.toLowerCase()))
    }
    if (filter?.status) {
      filtered = filtered.filter(c => c.status === filter.status)
    }
    if (filter?.startDate) {
      filtered = filtered.filter(c => new Date(c.startDate) >= new Date(filter.startDate))
    }
    if (filter?.endDate) {
      filtered = filtered.filter(c => new Date(c.completionDate) <= new Date(filter.endDate))
    }

    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filtered.length
    const totalPages = Math.ceil(total / itemsPerPage)
    const start = (page - 1) * itemsPerPage
    const paginatedData = filtered.slice(start, start + itemsPerPage)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  const getComplaintById = async (id: string): Promise<Complaint | null> => {
    return complaints.value.find(c => c.id === id) || null
  }

  const createComplaint = async (data: Omit<Complaint, "id">): Promise<Complaint> => {
    const id = String(complaints.value.length + 1)
    const complaintId = `K${String(complaints.value.length + 1).padStart(4, "0")}`
    const newComplaint = { id, complaintId, ...data }

    complaints.value.push(newComplaint)
    return newComplaint
  }

  const updateComplaint = async (id: string, data: Partial<Complaint>): Promise<Complaint | null> => {
    const index = complaints.value.findIndex(c => c.id === id)
    if (index === -1) return null

    const updated = { ...complaints.value[index], ...data }
    complaints.value[index] = updated
    return updated
  }

  const deleteComplaint = async (id: string): Promise<boolean> => {
    const index = complaints.value.findIndex(c => c.id === id)
    if (index === -1) return false

    complaints.value.splice(index, 1)
    return true
  }

  return {
    ...apiClient,
    complaints, // optional
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
  }
}