import { ref, computed } from "vue"
import type { Package, PackageFilter, PackagePagination } from "~/types/package"
import { usePackageApi } from "~/composables/consume-api/package.api"

export function usePackages() {
  const packageApi = usePackageApi()

  // State
  const packages = ref<Package[]>([])
  const selectedPackage = ref<Package | null>(null)
  const pagination = ref<PackagePagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: 5,
  })

  // Methods
  const fetchPackages = async (filter?: PackageFilter) => {
    const result = await packageApi.getPackages(filter)
    pagination.value = result
    packages.value = result.data
    return result
  }

  const fetchPackageById = async (id: string) => {
    selectedPackage.value = await packageApi.getPackageById(id)
    return selectedPackage.value
  }

  const savePackage = async (packageData: Partial<Package>) => {
    if (packageData.id) {
      // Update existing package
      selectedPackage.value = (await packageApi.updatePackage(packageData.id, packageData)) as Package
    } else {
      // Create new package
      selectedPackage.value = await packageApi.createPackage(packageData as Omit<Package, "id">)
    }

    return selectedPackage.value
  }

  const removePackage = async (id: string) => {
    return await packageApi.deletePackage(id)
  }

  // Computed
  const isLoading = computed(() => packageApi.isLoading.value)
  const error = computed(() => packageApi.error.value)

  return {
    // State
    packages,
    selectedPackage,
    pagination,
    isLoading,
    error,

    // Methods
    fetchPackages,
    fetchPackageById,
    savePackage,
    removePackage,
  }
}