import { defineStore } from 'pinia'
import {
  fetchVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from '@/composables/consume-api/voucher.api'
import { useApi } from '@/composables/use-fetch-api'
import type {
  Voucher,
  CreateVoucherPayload,
  VoucherFilter,
  VoucherPagination
} from '~/types/voucher'

interface VoucherStoreState {
  vouchers: Voucher[]
  pagination: VoucherPagination | null
  filter: VoucherFilter
  selectedVoucher: Voucher | null
  isLoading: boolean
  error: string | null
}

export const useVoucherStore = defineStore('voucher', {
  state: (): VoucherStoreState => ({
    vouchers: [],
    pagination: null,
    filter: {
      status: '',
      page: 1,
      itemsPerPage: 10
    },
    selectedVoucher: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadVouchers(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const res = await fetchVouchers(this.filter)
        this.vouchers = res.response.records

        this.pagination = {
          page: res.response.page.batch_number,
          totalItems: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memuat data voucher'
        console.error('Error loading vouchers:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getVoucherDetail(id: string): Promise<Voucher | null> {
      try {
        this.isLoading = true
        this.error = null

        const response = await getVoucherById(id)
        this.selectedVoucher = response.response
        return this.selectedVoucher
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memuat detail voucher'
        console.error('Error getting voucher detail:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedVoucher(): void {
      this.selectedVoucher = null
    },

    setFilter(filter: Partial<VoucherFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadVouchers()
    },

    resetFilter(): void {
      this.filter = {
        status: '',
        page: 1,
        itemsPerPage: 10
      }
      this.loadVouchers()
    },

    async createNewVoucher(data: CreateVoucherPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await createVoucher(data)
        await this.loadVouchers()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal membuat voucher'
        console.error('Error creating voucher:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createVoucherRaw(payload: CreateVoucherPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await useApi('/voucher/admin', {
          method: 'POST',
          body: payload,
          service: 'core'
        })

        await this.loadVouchers()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal create voucher raw'
        console.error('Error creating voucher (raw):', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateVoucher(id: string, data: Partial<Voucher>): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await updateVoucher(id, data)

        if (this.selectedVoucher?.id === id) {
          await this.getVoucherDetail(id)
        }

        await this.loadVouchers()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal memperbarui voucher'
        console.error('Error updating voucher:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteVoucher(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        await deleteVoucher(id)
        this.vouchers = this.vouchers.filter(v => v.id !== id)

        if (this.selectedVoucher?.id === id) {
          this.clearSelectedVoucher()
        }

        await this.loadVouchers()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Gagal menghapus voucher'
        console.error('Error deleting voucher:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
