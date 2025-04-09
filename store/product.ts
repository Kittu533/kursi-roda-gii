import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Product, ProductFilter } from "~/types/product"
import { useProducts } from "~/composables/product/use-product"
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