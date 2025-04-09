import { ref, computed } from "vue"
import type { Product, ProductFilter, ProductPagination } from "~/types/product"
import { useProductApi } from "~/composables/consume-api/product.api"

export function useProducts() {
  const productApi = useProductApi()

  // State
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
  const pagination = ref<ProductPagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: 5,
    data: [],
  })

  // Methods
  const fetchProducts = async (filter?: ProductFilter) => {
    const result = await productApi.getProducts(filter)
    pagination.value = result
    products.value = result.data
    return result
  }

  const fetchProductById = async (id: string) => {
    selectedProduct.value = await productApi.getProductById(id)
    return selectedProduct.value
  }

  const saveProduct = async (productData: Partial<Product>) => {
    if (selectedProduct.value) {
      // Update existing product
      selectedProduct.value = (await productApi.updateProduct(selectedProduct.value.id, productData)) as Product
    } else {
      // Create new product
      selectedProduct.value = await productApi.createProduct(productData as Omit<Product, "id">)
    }

    return selectedProduct.value
  }

  const removeProduct = async (id: string) => {
    return await productApi.deleteProduct(id)
  }

  // Computed
  const isLoading = computed(() => productApi.isLoading.value)
  const error = computed(() => productApi.error.value)

  return {
    // State
    products,
    selectedProduct,
    pagination,
    isLoading,
    error,

    // Methods
    fetchProducts,
    fetchProductById,
    saveProduct,
    removeProduct,
  }
}