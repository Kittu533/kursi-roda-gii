import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Voucher, VoucherFilter } from "~/types/voucher"
import { useVouchers } from "~/composables/voucher/use-voucher"
import { useNotification } from "~/composables/use-notification"

export const useVoucherStore = defineStore("voucher", () => {
  // Composables
  const {
    vouchers: vouchersRef,
    selectedVoucher: selectedVoucherRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchVouchers,
    fetchVoucherById,
    saveVoucher,
    removeVoucher,
  } = useVouchers()

  const notification = useNotification()

  // State
  const filter = ref<VoucherFilter>({
    status: "",
    startDate: "",
    endDate: "",
    search: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadVouchers = async () => {
    try {
      const result = await fetchVouchers(filter.value)
      return result
    } catch (e) {
      notification.error("Gagal memuat data voucher")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<VoucherFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadVouchers()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      startDate: "",
      endDate: "",
      search: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadVouchers()
  }

  const loadVoucherDetails = async (id: string) => {
    try {
      return await fetchVoucherById(id)
    } catch (e) {
      notification.error("Gagal memuat detail voucher")
      throw e
    }
  }

  const updateVoucher = async (id: string, voucherData: Partial<Voucher>) => {
    try {
      const result = await saveVoucher({ idVoucher: id, ...voucherData })
      notification.success("Voucher berhasil diperbarui")
      return result
    } catch (e) {
      notification.error("Gagal memperbarui voucher")
      throw e
    }
  }

  const createVoucher = async (voucherData: Omit<Voucher, "idVoucher">) => {
    try {
      const result = await saveVoucher(voucherData)
      notification.success("Voucher berhasil dibuat")
      return result
    } catch (e) {
      notification.error("Gagal membuat voucher")
      throw e
    }
  }

  const deleteVoucher = async (id: string) => {
    try {
      const result = await removeVoucher(id)
      if (result) {
        notification.success("Voucher berhasil dihapus")
        await loadVouchers()
      }
      return result
    } catch (e) {
      notification.error("Gagal menghapus voucher")
      throw e
    }
  }

  // Getters
  const vouchers = computed(() => vouchersRef.value)
  const selectedVoucher = computed(() => selectedVoucherRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    vouchers,
    selectedVoucher,
    pagination,
    isLoading,
    error,

    // Actions
    loadVouchers,
    setFilter,
    resetFilter,
    loadVoucherDetails,
    updateVoucher,
    createVoucher,
    deleteVoucher,
  }
})