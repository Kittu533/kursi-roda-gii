import { defineStore } from 'pinia'
import { fetchVoucherStatuses } from '@/composables/consume-api/voucher-status.api'
import type { VoucherStatus } from '@/composables/consume-api/voucher-status.api'

interface VoucherStatusState {
  statuses: VoucherStatus[]
  isLoading: boolean
  error: string | null
}

export const useVoucherStatusStore = defineStore('voucherStatus', {
  state: (): VoucherStatusState => ({
    statuses: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async loadVoucherStatuses() {
      this.isLoading = true
      this.error = null
      try {
        const res = await fetchVoucherStatuses()
        this.statuses = res.response.records
      } catch (error: any) {
        this.error = error?.metaData?.message || error?.message || 'Gagal memuat status voucher'
        this.statuses = []
      } finally {
        this.isLoading = false
      }
    }
  }
})
