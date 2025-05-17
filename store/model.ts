import { defineStore } from 'pinia'
import {
  fetchModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel
} from '@/composables/consume-api/model.api'
import type {
  WheelchairModel,
  CreateModelPayload,
  ModelFilter,
  ModelPagination
} from '~/types/model'

interface ModelStoreState {
  models: WheelchairModel[]
  pagination: ModelPagination | null
  filter: ModelFilter
  selectedModel: WheelchairModel | null
  isLoading: boolean
  error: string | null
}

export const useModelStore = defineStore('model', {
  state: (): ModelStoreState => ({
    models: [],
    pagination: null,
    filter: {
      name: '',
      guide_compatible: '',
      page: 1,
      itemsPerPage: 5
    },
    selectedModel: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadModels(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        const res = await fetchModels(this.filter)
        this.models = res.response.records

        this.pagination = {
          currentPage: res.response.page.batch_number,
          total: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size,
          data: res.response.records
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load models'
        console.error('Error loading models:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getModelDetail(id: string): Promise<WheelchairModel | null> {
      try {
        this.isLoading = true
        this.error = null
        const res = await getModelById(id)
        this.selectedModel = res.response
        return this.selectedModel
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get model detail'
        console.error('Error getting model detail:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedModel(): void {
      this.selectedModel = null
    },

    setFilter(filter: Partial<ModelFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadModels()
    },

    resetFilter(): void {
      this.filter = {
        name: '',
        guide_compatible: '',
        page: 1,
        itemsPerPage: 5
      }
      this.loadModels()
    },

    async createNewModel(data: CreateModelPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await createModel(data)
        await this.loadModels()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create model'
        console.error('Error creating model:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateModel(id: string, data: Partial<CreateModelPayload>): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await updateModel(id, data)
        if (this.selectedModel?.id === id) {
          await this.getModelDetail(id)
        }
        await this.loadModels()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update model'
        console.error('Error updating model:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteModel(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        await deleteModel(id)
        this.models = this.models.filter(model => model.id !== id)
        if (this.selectedModel?.id === id) this.clearSelectedModel()
        await this.loadModels()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete model'
        console.error('Error deleting model:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
