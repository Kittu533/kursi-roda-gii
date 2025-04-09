import { ref } from "vue"
import type { Guide, GuideFilter, GuidePagination } from "~/types/guide"
import { useApiClient } from "../use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockGuides: Guide[] = [
  {
    id: "G0001",
    photo: "/avatar.webp",
    name: "Herman Prakoso",
    phone: "+6281234567890",
    ktp: "1234567890987654",
    accountNumber: "1234567890987654",
    createdAt: "01/03/2025",
    status: "menunggu",
  },
  {
    id: "G0002",
    photo: "/avatar.webp",
    name: "Nasisa Fadilla",
    phone: "+6281234567890",
    ktp: "1234567890987654",
    accountNumber: "1234567890987654",
    createdAt: "02/03/2025",
    status: "menunggu",
  },
  {
    id: "G0003",
    photo: "/avatar.webp",
    name: "Mia Anggreni",
    phone: "+6281234567890",
    ktp: "1234567890987654",
    accountNumber: "1234567890987654",
    createdAt: "03/03/2025",
    status: "aktif",
  },
  {
    id: "G0004",
    photo: "/avatar.webp",
    name: "Finda Alifa",
    phone: "+6281234567890",
    ktp: "1234567890987654",
    accountNumber: "1234567890987654",
    createdAt: "04/03/2025",
    status: "dibatalkan",
  },
  {
    id: "G0005",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    ktp: "1234567890987654",
    accountNumber: "1234567890987654",
    createdAt: "05/03/2025",
    status: "nonaktif",
  },
]

export function useGuideApi() {
  const apiClient = useApiClient()
  const guides = ref<Guide[]>([...mockGuides])

  // Get guides with filtering and pagination
  const getGuides = async (filter?: GuideFilter): Promise<GuidePagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<GuidePagination>('/api/guides', filter)
    // return response.data

    // Filter logic
    let filteredGuides = [...mockGuides]

    if (filter?.status && filter.status !== "semua") {
      filteredGuides = filteredGuides.filter((guide) => guide.status === filter.status)
    }

    if (filter?.date) {
      filteredGuides = filteredGuides.filter((guide) => guide.createdAt === filter.date)
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredGuides.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredGuides.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single guide by ID
  const getGuideById = async (id: string): Promise<Guide | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Guide>(`/api/guides/${id}`)
    // return response.data

    const guide = mockGuides.find((guide) => guide.id === id)
    return guide || null
  }

  // Create a new guide
  const createGuide = async (guideData: Omit<Guide, "id">): Promise<Guide> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Guide>('/api/guides', guideData)
    // return response.data

    // Generate a new ID
    const newId = `G${String(mockGuides.length + 1).padStart(4, "0")}`

    const newGuide: Guide = {
      id: newId,
      ...guideData,
    }

    // Add to mock data
    mockGuides.push(newGuide)
    guides.value = [...mockGuides]

    return newGuide
  }

  // Update an existing guide
  const updateGuide = async (id: string, guideData: Partial<Guide>): Promise<Guide | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Guide>(`/api/guides/${id}`, guideData)
    // return response.data

    const guideIndex = mockGuides.findIndex((guide) => guide.id === id)

    if (guideIndex === -1) {
      return null
    }

    // Update the guide
    const updatedGuide = {
      ...mockGuides[guideIndex],
      ...guideData,
    }

    mockGuides[guideIndex] = updatedGuide
    guides.value = [...mockGuides]

    return updatedGuide
  }

  // Delete a guide
  const deleteGuide = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/guides/${id}`)

    const guideIndex = mockGuides.findIndex((guide) => guide.id === id)

    if (guideIndex === -1) {
      return false
    }

    // Remove the guide
    mockGuides.splice(guideIndex, 1)
    guides.value = [...mockGuides]

    return true
  }

  return {
    ...apiClient,
    getGuides,
    getGuideById,
    createGuide,
    updateGuide,
    deleteGuide,
  }
}

