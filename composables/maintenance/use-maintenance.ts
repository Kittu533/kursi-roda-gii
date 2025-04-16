import { ref, computed } from "vue"
import type { Maintenance, MaintenanceFilter, MaintenancePagination } from "~/types/maintenance"
import { useMaintenanceApi } from "~/composables/consume-api/maintenance.api"

export function useMaintenances() {
  const maintenanceApi = useMaintenanceApi()

  // State
  const maintenances = ref<Maintenance[]>([])
  const selectedMaintenance = ref<Maintenance | null>(null)
  const pagination = ref<MaintenancePagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: 5,
    data: [],
  })

  // Methods
  const fetchMaintenances = async (filter?: MaintenanceFilter) => {
    const result = await maintenanceApi.getMaintenances(filter)
    pagination.value = result
    maintenances.value = result.data
    return result
  }

  const fetchMaintenanceById = async (id: string) => {
    selectedMaintenance.value = await maintenanceApi.getMaintenanceById(id)
    return selectedMaintenance.value
  }

  const saveMaintenance = async (maintenanceData: Partial<Maintenance>) => {
    if (maintenanceData.id) {
      // Update existing maintenance
      selectedMaintenance.value = (await maintenanceApi.updateMaintenance(
        maintenanceData.id, 
        maintenanceData
      )) as Maintenance
    } else {
      // Create new maintenance
      selectedMaintenance.value = await maintenanceApi.createMaintenance(
        maintenanceData as Omit<Maintenance, "id">
      )
    }

    return selectedMaintenance.value
  }

  const removeMaintenance = async (id: string) => {
    return await maintenanceApi.deleteMaintenance(id)
  }

  // Computed
  const isLoading = computed(() => maintenanceApi.isLoading.value)
  const error = computed(() => maintenanceApi.error.value)

  return {
    // State
    maintenances,
    selectedMaintenance,
    pagination,
    isLoading,
    error,

    // Methods
    fetchMaintenances,
    fetchMaintenanceById,
    saveMaintenance,
    removeMaintenance,
  }
}