import { computed } from 'vue'
import type { Pagination } from '~/types/common'
import { getPaginationRange } from '~/utils/helpers'

export function usePagination<T>(pagination: Pagination<T>) {
    // Computed properties
    const currentPage = computed(() => pagination.currentPage)
    const totalPages = computed(() => pagination.totalPages)
    const total = computed(() => pagination.total)
    const itemsPerPage = computed(() => pagination.itemsPerPage)
    const data = computed(() => pagination.data)
    
    // Pagination range for UI
    const paginationRange = computed(() => 
        getPaginationRange(currentPage.value, totalPages.value)
    )
    
    // Helper methods
    const canGoPrevious = computed(() => currentPage.value > 1)
    const canGoNext = computed(() => currentPage.value < totalPages.value)
    
    const startItem = computed(() => 
        (currentPage.value - 1) * itemsPerPage.value + 1
    )
    
    const endItem = computed(() => 
        Math.min(currentPage.value * itemsPerPage.value, total.value)
    )
    
    return {
        currentPage,
        totalPages,
        total,
        itemsPerPage,
        data,
        paginationRange,
        canGoPrevious,
        canGoNext,
        startItem,
        endItem
    }
}