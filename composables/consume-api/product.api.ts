import { ref } from "vue"
import type { Product, ProductFilter, ProductPagination } from "~/types/product"
import { useApiClient } from "../use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockProducts: Product[] = [
  {
    id: "PR0001",
    agentId: "A0003",
    serialNumber: "KR001",
    productName: "JBL GO3",
    model: "Elektrik",
    weight: "120kg",
    stock: 10,
    status: "tersedia",
    createdAt: "01/03/2025",
    updatedAt: "01/03/2025"
  },
  {
    id: "PR0002",
    agentId: "A0003",
    serialNumber: "KR002",
    productName: "Casanova MS118",
    model: "Elektrik",
    weight: "120kg",
    stock: 8,
    status: "tersedia",
    createdAt: "02/03/2025",
    updatedAt: "07/03/2025"
  },
  {
    id: "PR0003",
    agentId: "A0003",
    serialNumber: "KR003",
    productName: "Kursi Roda",
    model: "Elektrik",
    weight: "120kg",
    stock: 12,
    status: "tersedia",
    createdAt: "03/03/2025",
    updatedAt: "04/03/2025"
  },
  {
    id: "PR0004",
    agentId: "A0003",
    serialNumber: "KR007",
    productName: "GEA D-89PL",
    model: "Elektrik",
    weight: "300kg",
    stock: 8,
    status: "rusak",
    createdAt: "04/03/2025",
    updatedAt: "09/03/2025"
  },
  {
    id: "PR0005",
    agentId: "A0003",
    serialNumber: "KR001",
    productName: "Onemed AL 46",
    model: "Elektrik",
    weight: "300kg",
    stock: 8,
    status: "tersedia",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025"
  },
  {
    id: "PR0006",
    agentId: "A0003",
    serialNumber: "KR001",
    productName: "Onemed AL 46",
    model: "Elektrik",
    weight: "300kg",
    stock: 8,
    status: "tersedia",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025"
  },
  {
    id: "PR0007",
    agentId: "A0003",
    serialNumber: "KR001",
    productName: "Onemed AL 46",
    model: "Elektrik",
    weight: "300kg",
    stock: 8,
    status: "tersedia",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025"
  }
]

export function useProductApi() {
  const apiClient = useApiClient()
  const products = ref<Product[]>([...mockProducts])

  // Get products with filtering and pagination
  const getProducts = async (filter?: ProductFilter): Promise<ProductPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<ProductPagination>('/api/products', filter)
    // return response.data

    // Filter logic
    let filteredProducts = [...mockProducts]

    if (filter?.status && filter.status !== "semua") {
      filteredProducts = filteredProducts.filter((product) => product.status === filter.status)
    }

    if (filter?.date) {
      filteredProducts = filteredProducts.filter(
        (product) => product.createdAt === filter.date || product.updatedAt === filter.date,
      )
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredProducts.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single product by ID
  const getProductById = async (id: string): Promise<Product | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Product>(`/api/products/${id}`)
    // return response.data

    const product = mockProducts.find((product) => product.id === id)
    return product || null
  }

  // Create a new product
  const createProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Product>('/api/products', productData)
    // return response.data

    // Generate a new ID
    const newId = `PR${String(mockProducts.length + 1).padStart(4, "0")}`

    const newProduct: Product = {
      id: newId,
      ...productData,
    }

    // Add to mock data
    mockProducts.push(newProduct)
    products.value = [...mockProducts]

    return newProduct
  }

  // Update an existing product
  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Product>(`/api/products/${id}`, productData)
    // return response.data

    const productIndex = mockProducts.findIndex((product) => product.id === id)

    if (productIndex === -1) {
      return null
    }

    // Update the product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: new Date().toLocaleDateString("en-GB"),
    }

    mockProducts[productIndex] = updatedProduct
    products.value = [...mockProducts]

    return updatedProduct
  }

  // Delete a product
  const deleteProduct = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/products/${id}`)

    const productIndex = mockProducts.findIndex((product) => product.id === id)

    if (productIndex === -1) {
      return false
    }

    // Remove the product
    mockProducts.splice(productIndex, 1)
    products.value = [...mockProducts]

    return true
  }

  return {
    ...apiClient,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}