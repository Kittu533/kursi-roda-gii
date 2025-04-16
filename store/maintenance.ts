import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Maintenance, MaintenanceFilter } from "~/types/maintenance"
import { useMaintenances } from "~/composables/maintenance/use-maintenance"
import { useNotification } from "~/composables/use-notification"

export const useMaintenanceStore = defineStore("maintenance", () => {
  // Composables
  const {
    maintenances: maintenancesRef,
    selectedMaintenance: selectedMaintenanceRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchMaintenances,
    fetchMaintenanceById,
    saveMaintenance,
    removeMaintenance,
  } = useMaintenances()

  const notification = useNotification()

  // State
  const filter = ref<MaintenanceFilter>({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadMaintenances = async () => {
    try {
      const result = await fetchMaintenances(filter.value)
      return result
    } catch (e) {
      notification.error("Failed to load maintenances")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<MaintenanceFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadMaintenances()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      startDate: "",
      endDate: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadMaintenances()
  }

  const loadMaintenanceDetails = async (id: string) => {
    try {
      return await fetchMaintenanceById(id)
    } catch (e) {
      notification.error("Failed to load maintenance details")
      throw e
    }
  }

  const updateMaintenance = async (id: string, maintenanceData: Partial<Maintenance>) => {
    try {
      const result = await saveMaintenance({ id, ...maintenanceData })
      notification.success("Maintenance updated successfully")
      return result
    } catch (e) {
      notification.error("Failed to update maintenance")
      throw e
    }
  }

  const createMaintenance = async (maintenanceData: Omit<Maintenance, "id">) => {
    try {
      const result = await saveMaintenance(maintenanceData)
      notification.success("Maintenance created successfully")
      return result
    } catch (e) {
      notification.error("Failed to create maintenance")
      throw e
    }
  }

  const deleteMaintenance = async (id: string) => {
    try {
      const result = await removeMaintenance(id)
      if (result) {
        notification.success("Maintenance deleted successfully")
        await loadMaintenances()
      }
      return result
    } catch (e) {
      notification.error("Failed to delete maintenance")
      throw e
    }
  }

  // Getters
  const maintenances = computed(() => maintenancesRef.value)
  const selectedMaintenance = computed(() => selectedMaintenanceRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    maintenances,
    selectedMaintenance,
    pagination,
    isLoading,
    error,

    // Actions
    loadMaintenances,
    setFilter,
    resetFilter,
    loadMaintenanceDetails,
    updateMaintenance,
    createMaintenance,
    deleteMaintenance,
  }
})