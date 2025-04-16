import { ref } from "vue"
import type { Package, PackageFilter, PackagePagination } from "~/types/package"

// Mock data - would be replaced with actual API calls
const mockPackages: Package[] = [
  {
    id: "1",
    packageId: "PK0001",
    voucherId: "V0001",
    name: "Poket Sci1",
    price: "Rp150.000",
    creationDate: "01/01/2025",
    updateDate: "10/01/2025",
    status: "Active"
  },
  {
    id: "2",
    packageId: "PK0002",
    voucherId: "V0002",
    name: "Poket Towaf",
    price: "Rp150.000",
    creationDate: "01/01/2025",
    updateDate: "10/01/2025",
    status: "Active"
  },
  {
    id: "3",
    packageId: "PK0003",
    voucherId: "V0003",
    name: "Poket A",
    price: "Rp200.000",
    creationDate: "02/01/2025",
    updateDate: "11/01/2025",
    status: "Inactive"
  },
  {
    id: "4",
    packageId: "PK0004",
    voucherId: "V0004",
    name: "Poket B",
    price: "Rp250.000",
    creationDate: "03/01/2025",
    updateDate: "12/01/2025",
    status: "Pending"
  },
  {
    id: "5",
    packageId: "PK0005",
    voucherId: "V0005",
    name: "Poket C",
    price: "Rp300.000",
    creationDate: "04/01/2025",
    updateDate: "13/01/2025",
    status: "Active"
  },
  {
    id: "6",
    packageId: "PK0006",
    voucherId: "V0006",
    name: "Poket D",
    price: "Rp350.000",
    creationDate: "05/01/2025",
    updateDate: "14/01/2025",
    status: "Inactive"
  },
  {
    id: "7",
    packageId: "PK0007",
    voucherId: "V0007",
    name: "Poket E",
    price: "Rp400.000",
    creationDate: "06/01/2025",
    updateDate: "15/01/2025",
    status: "Active"
  },
  {
    id: "8",
    packageId: "PK0008",
    voucherId: "V0008",
    name: "Poket F",
    price: "Rp450.000",
    creationDate: "07/01/2025",
    updateDate: "16/01/2025",
    status: "Pending"
  },
  {
    id: "9",
    packageId: "PK0009",
    voucherId: "V0009",
    name: "Poket G",
    price: "Rp500.000",
    creationDate: "08/01/2025",
    updateDate: "17/01/2025",
    status: "Active"
  }
]

export function usePackageApi() {
  const packages = ref<Package[]>([...mockPackages])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Get packages with filtering and pagination
  const getPackages = async (filter?: PackageFilter): Promise<PackagePagination & { data: Package[] }> => {
    isLoading.value = true
    try {
      // Filter logic
      let filteredPackages = [...mockPackages]

      if (filter?.status && filter.status !== "semua") {
        filteredPackages = filteredPackages.filter(pkg => pkg.status === filter.status)
      }

      if (filter?.name) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.name.toLowerCase().includes(filter.name!.toLowerCase())
        )
      }

      if (filter?.packageId) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.packageId.includes(filter.packageId!)
        )
      }

      if (filter?.voucherId) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.voucherId.includes(filter.voucherId!)
        )
      }

      if (filter?.startDate && filter?.endDate) {
        filteredPackages = filteredPackages.filter(pkg => {
          const creationDate = new Date(pkg.creationDate.split('/').reverse().join('-'))
          const startDate = new Date(filter.startDate!)
          const endDate = new Date(filter.endDate!)
          return creationDate >= startDate && creationDate <= endDate
        })
      }

      // Price range filtering
      if (filter?.minPrice || filter?.maxPrice) {
        filteredPackages = filteredPackages.filter(pkg => {
          const priceValue = parseInt(pkg.price.replace(/\D/g, ''))
          return (
            (!filter.minPrice || priceValue >= filter.minPrice) &&
            (!filter.maxPrice || priceValue <= filter.maxPrice)
          )
        })
      }

      // Pagination logic
      const page = filter?.page || 1
      const itemsPerPage = filter?.itemsPerPage || 5
      const total = filteredPackages.length
      const totalPages = Math.ceil(total / itemsPerPage)

      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage
      const paginatedData = filteredPackages.slice(start, end)

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

  // Get a single package by ID
  const getPackageById = async (id: string): Promise<Package | null> => {
    isLoading.value = true
    try {
      const pkg = mockPackages.find(pkg => pkg.id === id)
      return pkg || null
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Create a new package
  const createPackage = async (packageData: Omit<Package, "id">): Promise<Package> => {
    isLoading.value = true
    try {
      // Generate a new ID
      const newId = String(mockPackages.length + 1)
      const newPackageId = `PK${String(mockPackages.length + 1).padStart(4, "0")}`
      const newVoucherId = `V${String(mockPackages.length + 1).padStart(4, "0")}`

      const newPackage: Package = {
        id: newId,
        packageId: newPackageId,
        voucherId: newVoucherId,
        ...packageData,
        creationDate: new Date().toLocaleDateString('en-GB'),
        updateDate: new Date().toLocaleDateString('en-GB')
      }

      // Add to mock data
      mockPackages.push(newPackage)
      packages.value = [...mockPackages]

      return newPackage
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing package
  const updatePackage = async (id: string, packageData: Partial<Package>): Promise<Package | null> => {
    isLoading.value = true
    try {
      const packageIndex = mockPackages.findIndex(pkg => pkg.id === id)

      if (packageIndex === -1) {
        return null
      }

      // Update the package
      const updatedPackage = {
        ...mockPackages[packageIndex],
        ...packageData,
        updateDate: new Date().toLocaleDateString('en-GB')
      }

      mockPackages[packageIndex] = updatedPackage
      packages.value = [...mockPackages]

      return updatedPackage
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // Delete a package
  const deletePackage = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const packageIndex = mockPackages.findIndex(pkg => pkg.id === id)

      if (packageIndex === -1) {
        return false
      }

      // Remove the package
      mockPackages.splice(packageIndex, 1)
      packages.value = [...mockPackages]

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
    packages,
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
  }
}