import { defineStore } from 'pinia'
import {
    fetchWheelchairs,
    getWheelchairById,
    createWheelchair,
    updateWheelchair,
    deleteWheelchair
} from '@/composables/consume-api/wheelchair.api'

import type {
    Wheelchair,
    WheelchairPagination,
    WheelchairFilter,
    CreateWheelchairPayload
} from '~/types/wheelchair'

interface WheelchairStoreState {
    wheelchairs: Wheelchair[]
    pagination: WheelchairPagination | null
    filter: WheelchairFilter
    selectedWheelchair: Wheelchair | null
    isLoading: boolean
    error: string | null
}

export const useWheelchairStore = defineStore('wheelchair', {
    state: (): WheelchairStoreState => ({
        wheelchairs: [],
        pagination: null,
        filter: {
            agent_id: '',
            model_id: '',
            status: '',
            page: 1,
            itemsPerPage: 10
        },
        selectedWheelchair: null,
        isLoading: false,
        error: null
    }),

    actions: {
        async loadWheelchairs(): Promise<void> {
            try {
                this.isLoading = true
                this.error = null
                const res = await fetchWheelchairs(this.filter)
                this.wheelchairs = res.response.records

                this.pagination = {
                    currentPage: res.response.page.batch_number,
                    total: res.response.page.total_record_count,
                    totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
                    itemsPerPage: res.response.page.batch_size,
                    data: res.response.records
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Gagal memuat data wheelchair'
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },

        async getWheelchairDetail(id: string): Promise<Wheelchair | null> {
            try {
                this.isLoading = true
                this.error = null
                const res = await getWheelchairById(id)
                this.selectedWheelchair = res.response
                return this.selectedWheelchair
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Gagal memuat detail'
                return null
            } finally {
                this.isLoading = false
            }
        },

        async createNewWheelchair(data: CreateWheelchairPayload) {
            try {
                this.isLoading = true
                this.error = null
                await createWheelchair(data)
                await this.loadWheelchairs()
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Gagal menambahkan data'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updateWheelchair(id: string, data: Partial<CreateWheelchairPayload>) {
            try {
                this.isLoading = true
                this.error = null
                await updateWheelchair(id, data)
                if (this.selectedWheelchair?.id === id) {
                    await this.getWheelchairDetail(id)
                }
                await this.loadWheelchairs()
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Gagal memperbarui data'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async deleteWheelchair(id: string) {
            try {
                this.isLoading = true
                this.error = null
                await deleteWheelchair(id)
                await this.loadWheelchairs()
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Gagal menghapus data'
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },

        setFilter(filter: Partial<WheelchairFilter>): void {
            this.filter = { ...this.filter, ...filter }
            this.loadWheelchairs()
        },

        resetFilter(): void {
            this.filter = {
                agent_id: '',
                model_id: '',
                status: '',
                page: 1,
                itemsPerPage: 10
            }
            this.loadWheelchairs()
        }
    }
})
