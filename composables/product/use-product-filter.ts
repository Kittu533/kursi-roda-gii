import { ref, reactive } from "vue"
import type { ProductFilter } from "~/types/product"

export function useProductFilter() {
  // Default filter state
  const filter = reactive<ProductFilter>({
    status: "",
    date: "",
    page: 1,
    itemsPerPage: 5,
  })

  const showFilter = ref(false)

  // Methods
  const setFilter = (newFilter: Partial<ProductFilter>) => {
    Object.assign(filter, {
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    })
  }

  const resetFilter = () => {
    Object.assign(filter, {
      status: "",
      date: "",
      page: 1,
      itemsPerPage: 5,
    })
    showFilter.value = false
  }

  const toggleFilter = () => {
    showFilter.value = !showFilter.value
  }

  return {
    filter,
    showFilter,
    setFilter,
    resetFilter,
    toggleFilter,
  }
}