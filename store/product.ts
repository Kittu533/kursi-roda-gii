import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Product, ProductFilter } from "~/types/product"
import { useProducts } from "~/composables/product/use-product"
import { useProductApi } from '@/composables/consume-api/product.api'
import { useNotification } from "~/composables/use-notification"

export const useProductStore = defineStore("product", () => {
  // Composables
  const {
    products: productsRef,
    selectedProduct: selectedProductRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    saveProduct,
    removeProduct,
  } = useProducts()

  const notification = useNotification()

  // State
  const filter = ref<ProductFilter>({
    status: "",
    date: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadProducts = async () => {
    try {
      const result = await fetchProducts(filter.value)
      return result
    } catch (e) {
      notification.error("Failed to load products")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<ProductFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadProducts()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      date: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadProducts()
  }

  const loadProductDetails = async (id: string) => {
    try {
      return await fetchProductById(id)
    } catch (e) {
      notification.error("Failed to load product details")
      throw e
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const result = await saveProduct({ id, ...productData })
      notification.success("Product updated successfully")
      return result
    } catch (e) {
      notification.error("Failed to update product")
      throw e
    }
  }

  const createProduct = async (productData: Omit<Product, "id">) => {
    try {
      const result = await saveProduct(productData)
      notification.success("Product created successfully")
      return result
    } catch (e) {
      notification.error("Failed to create product")
      throw e
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const result = await removeProduct(id)
      if (result) {
        notification.success("Product deleted successfully")
        await loadProducts()
      }
      return result
    } catch (e) {
      notification.error("Failed to delete product")
      throw e
    }
  }

  // Getters
  const products = computed(() => productsRef.value)
  const selectedProduct = computed(() => selectedProductRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    products,
    selectedProduct,
    pagination,
    isLoading,
    error,

    // Actions
    loadProducts,
    setFilter,
    resetFilter,
    loadProductDetails,
    updateProduct,
    createProduct,
    deleteProduct,
  }
})

interface ProductWithQuantity extends Product {
  quantity: number;
  guideSelected: boolean;
  pricePerDay: number;
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as ProductWithQuantity[],
    selectedDates: {
      startDate: '10 Februari 2025',
      endDate: '21 Februari 2025'
    },
    isLoading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchProducts(filter?: ProductFilter) {
      this.isLoading = true
      this.error = null
      const productApi = useProductApi() // Move the hook call outside the try block

      try {
        const { data } = await productApi.getProducts(filter)
        
        // Transform API data to include quantity and guide selection
        this.products = data.map(product => ({
          ...product,
          quantity: 0,
          guideSelected: false,
          pricePerDay: 130000 // Fixed price for all products in the example
        }))
      } catch (err) {
        this.error = 'Failed to fetch products'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    
    incrementQuantity(productId: string) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        product.quantity++
      }
    },
    
    decrementQuantity(productId: string) {
      const product = this.products.find(p => p.id === productId)
      if (product && product.quantity > 0) {
        product.quantity--
      }
    },
    
    toggleGuide(productId: string) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        product.guideSelected = !product.guideSelected
      }
    },
    
    setDates(startDate: string, endDate: string) {
      this.selectedDates.startDate = startDate
      this.selectedDates.endDate = endDate
    },
    
    resetSelection() {
      this.products.forEach(product => {
        product.quantity = 0
        product.guideSelected = false
      })
    }
  },
  
  getters: {
    selectedProducts: (state) => state.products.filter(p => p.quantity > 0),
    
    totalAmount: (state) => {
      return state.products.reduce((total, product) => {
        return total + (product.quantity * product.pricePerDay)
      }, 0)
    },
    
    availableProducts: (state) => state.products.filter(p => p.status === 'tersedia')
  }
})