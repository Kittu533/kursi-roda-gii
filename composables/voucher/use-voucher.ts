import { ref, computed } from "vue"
import type { Voucher, VoucherFilter, VoucherPagination } from "~/types/voucher"
import { useVoucherApi } from "~/composables/consume-api/voucher.api"

export function useVouchers() {
  const voucherApi = useVoucherApi()
  
  // State
  const vouchers = ref<Voucher[]>([])
  const selectedVoucher = ref<Voucher | null>(null)
  const pagination = ref<Omit<VoucherPagination, 'data'> | null>(null)
  const isLoading = computed(() => voucherApi.isLoading.value)
  const error = computed(() => voucherApi.error.value)
  
  // Fetch vouchers with optional filtering
  const fetchVouchers = async (filter?: VoucherFilter) => {
    try {
      const result = await voucherApi.getVouchers(filter)
      vouchers.value = result.data
      
      // Set pagination info
      pagination.value = {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        total: result.total,
        itemsPerPage: result.itemsPerPage
      }
      
      return result
    } catch (error) {
      console.error("Error fetching vouchers:", error)
      throw error
    }
  }
  
  // Fetch a single voucher by ID
  const fetchVoucherById = async (id: string) => {
    try {
      const result = await voucherApi.getVoucherById(id)
      if (result) {
        selectedVoucher.value = result
      }
      return result
    } catch (error) {
      console.error("Error fetching voucher:", error)
      throw error
    }
  }
  
  // Save (create or update) a voucher
  const saveVoucher = async (voucherData: Partial<Voucher>) => {
    try {
      let result
      
      if (voucherData.idVoucher) {
        // Update existing voucher
        result = await voucherApi.updateVoucher(
          voucherData.idVoucher,
          voucherData
        )
      } else {
        // Create new voucher
        result = await voucherApi.createVoucher(voucherData as Omit<Voucher, "idVoucher">)
      }
      
      return result
    } catch (error) {
      console.error("Error saving voucher:", error)
      throw error
    }
  }
  
  // Remove a voucher
  const removeVoucher = async (id: string) => {
    try {
      return await voucherApi.deleteVoucher(id)
    } catch (error) {
      console.error("Error removing voucher:", error)
      throw error
    }
  }
  
  return {
    vouchers,
    selectedVoucher,
    pagination,
    isLoading,
    error,
    fetchVouchers,
    fetchVoucherById,
    saveVoucher,
    removeVoucher
  }
}