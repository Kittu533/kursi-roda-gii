import { ref } from "vue"
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
  }
]

export function useComplaintApi() {
  const apiClient = useApiClient()
  const complaints = ref<Complaint[]>([...mockComplaints])

  // Get complaints with filtering and pagination
  const getComplaints = async (filter?: ComplaintFilter): Promise<ComplaintPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<ComplaintPagination>('/api/complaints', filter)
    // return response.data

    // Filter logic
    let filteredComplaints = [...mockComplaints]

    if (filter?.complaintId) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        complaint.complaintId.toLowerCase().includes(filter.complaintId!.toLowerCase()))
    }

    if (filter?.customerId) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        complaint.customerId.toLowerCase().includes(filter.customerId!.toLowerCase()))
    }

    if (filter?.transactionId) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        complaint.transactionId.toLowerCase().includes(filter.transactionId!.toLowerCase()))
    }

    if (filter?.type) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        complaint.type.toLowerCase().includes(filter.type!.toLowerCase()))
    }

    if (filter?.status) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        complaint.status === filter.status)
    }

    if (filter?.startDate) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        new Date(complaint.startDate) >= new Date(filter.startDate!))
    }

    if (filter?.endDate) {
      filteredComplaints = filteredComplaints.filter(complaint => 
        new Date(complaint.completionDate) <= new Date(filter.endDate!))
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredComplaints.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredComplaints.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single complaint by ID
  const getComplaintById = async (id: string): Promise<Complaint | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Complaint>(`/api/complaints/${id}`)
    // return response.data

    const complaint = mockComplaints.find((complaint) => complaint.id === id)
    return complaint || null
  }

  // Create a new complaint
  const createComplaint = async (complaintData: Omit<Complaint, "id">): Promise<Complaint> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Complaint>('/api/complaints', complaintData)
    // return response.data

    // Generate a new ID
    const newId = String(mockComplaints.length + 1)
    const newComplaintId = `K${String(mockComplaints.length + 1).padStart(4, "0")}`

    const newComplaint: Complaint = {
      id: newId,
      complaintId: newComplaintId,
      ...complaintData,
    }

    // Add to mock data
    mockComplaints.push(newComplaint)
    complaints.value = [...mockComplaints]

    return newComplaint
  }

  // Update an existing complaint
  const updateComplaint = async (id: string, complaintData: Partial<Complaint>): Promise<Complaint | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Complaint>(`/api/complaints/${id}`, complaintData)
    // return response.data

    const complaintIndex = mockComplaints.findIndex((complaint) => complaint.id === id)

    if (complaintIndex === -1) {
      return null
    }

    // Update the complaint
    const updatedComplaint = {
      ...mockComplaints[complaintIndex],
      ...complaintData,
    }

    mockComplaints[complaintIndex] = updatedComplaint
    complaints.value = [...mockComplaints]

    return updatedComplaint
  }

  // Delete a complaint
  const deleteComplaint = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/complaints/${id}`)

    const complaintIndex = mockComplaints.findIndex((complaint) => complaint.id === id)

    if (complaintIndex === -1) {
      return false
    }

    // Remove the complaint
    mockComplaints.splice(complaintIndex, 1)
    complaints.value = [...mockComplaints]

    return true
  }

  return {
    ...apiClient,
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
  }
}