import { defineStore } from 'pinia'
import {
  fetchGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
} from '@/composables/consume-api/guide.api'
import { useApi } from '@/composables/use-fetch-api'
import type {
  Guide,
  CreateGuidePayload,
  GuideFilter,
  GuidePagination
} from '~/types/guide'

interface GuideStoreState {
  guides: Guide[]
  pagination: GuidePagination | null
  filter: GuideFilter
  selectedGuide: Guide | null
  isLoading: boolean
  error: string | null
}

export const useGuideStore = defineStore('guide', {
  state: (): GuideStoreState => ({
    guides: [],
    pagination: null,
    filter: {
      status: '',
      date: '',
      page: 1,
      itemsPerPage: 5
    },
    selectedGuide: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadGuides(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const res = await fetchGuides(this.filter)
        this.guides = res.response.records

        this.pagination = {
          page: res.response.page.batch_number,
          totalItems: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load guides'
        console.error('Error loading guides:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getGuideDetail(id: string): Promise<Guide | null> {
      try {
        this.isLoading = true
        this.error = null

        const response = await getGuideById(id)
        this.selectedGuide = response.response
        return this.selectedGuide
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get guide details'
        console.error('Error getting guide details:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedGuide(): void {
      this.selectedGuide = null
    },

    setFilter(filter: Partial<GuideFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadGuides()
    },

    resetFilter(): void {
      this.filter = {
        status: '',
        date: '',
        page: 1,
        itemsPerPage: 5
      }
      this.loadGuides()
    },

    async createNewGuide(data: CreateGuidePayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await createGuide(data)
        await this.loadGuides()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create guide'
        console.error('Error creating guide:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createGuideRaw(payload: CreateGuidePayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await useApi<unknown>('/guide', {
          method: 'POST',
          body: payload
        })

        await this.loadGuides()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create guide'
        console.error('Error creating guide (raw):', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateGuide(id: string, data: Partial<Guide>): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null

        const result = await updateGuide(id, data)

        if (this.selectedGuide?.id === id) {
          await this.getGuideDetail(id)
        }

        await this.loadGuides()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update guide'
        console.error('Error updating guide:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteGuide(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        await deleteGuide(id)
        this.guides = this.guides.filter(g => g.id !== id)

        if (this.selectedGuide?.id === id) {
          this.clearSelectedGuide()
        }

        await this.loadGuides()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete guide'
        console.error('Error deleting guide:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
