// ~/stores/voucher-status.ts
import { defineStore } from 'pinia'
import { fetchVoucherStatusesApi, type VoucherStatus } from '~/composables/consume-api/voucher-status.api'

export const useVoucherStatusStore = defineStore('voucherStatus', {
  state: () => ({
    statuses: [] as VoucherStatus[],
    isLoaded: false
  }),

  actions: {
    async fetchStatuses() {
      if (this.isLoaded) return
      try {
        this.statuses = await fetchVoucherStatusesApi()
        this.isLoaded = true
      } catch (error) {
        console.error('Gagal mengambil daftar voucher status:', error)
      }
    },

    getStatusIdByName(name: string): string | null {
      const found = this.statuses.find(s => s.status.toLowerCase() === name.toLowerCase())
      return found?.id ?? null
    }
  }
})
