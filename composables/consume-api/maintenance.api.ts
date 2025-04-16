import { ref } from "vue"
import type { Maintenance, MaintenanceFilter, MaintenancePagination } from "~/types/maintenance"

// Mock data - would be replaced with actual API calls
const mockMaintenances: Maintenance[] = [
  {
    id: "1",
    maintenanceId: "M0001",
    productId: "PR0001",
    date: "01/01/2025",
    description: "Roda rusak",
    photoUrl: "/images/maintenance/roda-rusak.jpg",
    status: "Maintenance"
  },
  {
    id: "2",
    maintenanceId: "M0002",
    productId: "PR0002",
    date: "02/01/2025",
    description: "Mesin tidak menyala",
    photoUrl: "/images/maintenance/mesin-mati.jpg",
    status: "Pending"
  },
  {
    id: "3",
    maintenanceId: "M0003",
    productId: "PR0003",
    date: "03/01/2025",
    description: "Lampu depan rusak",
    photoUrl: "/images/maintenance/lampu-rusak.jpg",
    status: "Repaired"
  },
  {
    id: "4",
    maintenanceId: "M0004",
    productId: "PR0004",
    date: "04/01/2025",
    description: "Rem blong",
    photoUrl: "/images/maintenance/rem-blong.jpg",
    status: "Cancelled"
  },
  {
    id: "5",
    maintenanceId: "M0005",
    productId: "PR0005",
    date: "05/01/2025",
    description: "AC tidak dingin",
    photoUrl: "/images/maintenance/ac-rusak.jpg",
    status: "Maintenance"
  },
  {
    id: "6",
    maintenanceId: "M0006",
    productId: "PR0006",
    date: "06/01/2025",
    description: "Ban bocor",
    photoUrl: "/images/maintenance/ban-bocor.jpg",
    status: "Repaired"
  },
  {
    id: "7",
    maintenanceId: "M0007",
    productId: "PR0007",
    date: "07/01/2025",
    description: "Oli bocor",
    photoUrl: "/images/maintenance/oli-bocor.jpg",
    status: "Pending"
  },
  {
    id: "8",
    maintenanceId: "M0008",
    productId: "PR0008",
    date: "08/01/2025",
    description: "Kursi rusak",
    photoUrl: "/images/maintenance/kursi-rusak.jpg",
    status: "Maintenance"
  },
  {
    id: "9",
    maintenanceId: "M0009",
    productId: "PR0009",
    date: "09/01/2025",
    description: "Kaca retak",
    photoUrl: "/images/maintenance/kaca-retak.jpg",
    status: "Repaired"
  }
]

export function useMaintenanceApi() {
  const maintenances = ref<Maintenance[]>([...mockMaintenances])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Get maintenances with filtering and pagination
  const getMaintenances = async (filter?: MaintenanceFilter): Promise<MaintenancePagination & { data: Maintenance[] }> => {
    isLoading.value = true
    try {
      // Filter logic
      let filteredData = [...mockMaintenances]

      if (filter?.status) {
        filteredData = filteredData.filter(m => m.status === filter.status)
      }

      if (filter?.maintenanceId) {
        filteredData = filteredData.filter(m => 
          m.maintenanceId.toLowerCase().includes(filter.maintenanceId.toLowerCase())
        )
      }

      if (filter?.productId) {
        filteredData = filteredData.filter(m => 
          m.productId.toLowerCase().includes(filter.productId.toLowerCase())
        )
      }

      if (filter?.startDate && filter?.endDate) {
        filteredData = filteredData.filter(m => {
          const maintenanceDate = new Date(m.date.split('/').reverse().join('-'))
          const startDate = new Date(filter.startDate!)
          const endDate = new Date(filter.endDate!)
          return maintenanceDate >= startDate && maintenanceDate <= endDate
        })
      }

      // Pagination logic
      const page = filter?.page || 1
      const itemsPerPage = filter?.itemsPerPage || 5
      const total = filteredData.length
      const totalPages = Math.ceil(total / itemsPerPage)

      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage
      const paginatedData = filteredData.slice(start, end)

      return {
        currentPage: page,
        totalPages,
        total,
        itemsPerPage,
        data: paginatedData
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Get a single maintenance by ID
  const getMaintenanceById = async (id: string): Promise<Maintenance | null> => {
    isLoading.value = true
    try {
      const maintenance = mockMaintenances.find(m => m.id === id)
      return maintenance || null
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Create a new maintenance
  const createMaintenance = async (maintenanceData: Omit<Maintenance, "id">): Promise<Maintenance> => {
    isLoading.value = true
    try {
      // Generate a new ID
      const newId = String(mockMaintenances.length + 1)
      const newMaintenanceId = `M${String(mockMaintenances.length + 1).padStart(4, "0")}`

      const newMaintenance: Maintenance = {
        id: newId,
        maintenanceId: newMaintenanceId,
        ...maintenanceData
      }

      // Add to mock data
      mockMaintenances.push(newMaintenance)
      maintenances.value = [...mockMaintenances]

      return newMaintenance
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing maintenance
  const updateMaintenance = async (id: string, maintenanceData: Partial<Maintenance>): Promise<Maintenance | null> => {
    isLoading.value = true
    try {
      const maintenanceIndex = mockMaintenances.findIndex(m => m.id === id)

      if (maintenanceIndex === -1) {
        return null
      }

      // Update the maintenance
      const updatedMaintenance = {
        ...mockMaintenances[maintenanceIndex],
        ...maintenanceData
      }

      mockMaintenances[maintenanceIndex] = updatedMaintenance
      maintenances.value = [...mockMaintenances]

      return updatedMaintenance
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Delete a maintenance
  const deleteMaintenance = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const maintenanceIndex = mockMaintenances.findIndex(m => m.id === id)

      if (maintenanceIndex === -1) {
        return false
      }

      // Remove the maintenance
      mockMaintenances.splice(maintenanceIndex, 1)
      maintenances.value = [...mockMaintenances]

      return true
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    maintenances,
    getMaintenances,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
  }
}