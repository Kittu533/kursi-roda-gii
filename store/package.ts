import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Package, PackageFilter, PackagePagination } from "~/types/package"
import { usePackages } from "~/composables/package/use-package"
import { useNotification } from "~/composables/use-notification"

export const usePackageStore = defineStore("package", () => {
  // Composables
  const {
    packages: packagesRef,
    selectedPackage: selectedPackageRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchPackages,
    fetchPackageById,
    savePackage,
    removePackage,
  } = usePackages()

  const notification = useNotification()

  // State
  const filter = ref<PackageFilter>({
    status: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadPackages = async () => {
    try {
      const result = await fetchPackages(filter.value)
      return result
    } catch (e) {
      notification.error("Failed to load packages")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<PackageFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadPackages()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadPackages()
  }

  const loadPackageDetails = async (id: string) => {
    try {
      return await fetchPackageById(id)
    } catch (e) {
      notification.error("Failed to load package details")
      throw e
    }
  }

  const updatePackage = async (id: string, packageData: Partial<Package>) => {
    try {
      const result = await savePackage({ id, ...packageData })
      notification.success("Package updated successfully")
      return result
    } catch (e) {
      notification.error("Failed to update package")
      throw e
    }
  }

  const createPackage = async (packageData: Omit<Package, "id">) => {
    try {
      const result = await savePackage(packageData)
      notification.success("Package created successfully")
      return result
    } catch (e) {
      notification.error("Failed to create package")
      throw e
    }
  }

  const deletePackage = async (id: string) => {
    try {
      const result = await removePackage(id)
      if (result) {
        notification.success("Package deleted successfully")
        await loadPackages()
      }
      return result
    } catch (e) {
      notification.error("Failed to delete package")
      throw e
    }
  }

  // Getters
  const packages = computed(() => packagesRef.value)
  const selectedPackage = computed(() => selectedPackageRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    packages,
    selectedPackage,
    pagination,
    isLoading,
    error,

    // Actions
    loadPackages,
    setFilter,
    resetFilter,
    loadPackageDetails,
    updatePackage,
    createPackage,
    deletePackage,
  }
})