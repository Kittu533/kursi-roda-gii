import { defineStore } from 'pinia'
import {
  fetchAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent
} from '@/composables/consume-api/agent.api'
import type {
  Agent,
  CreateAgentPayload,
  AgentFilter,
  AgentPagination
} from '~/types/agent'

interface AgentStoreState {
  agents: Agent[]
  pagination: AgentPagination | null
  filter: AgentFilter
  selectedAgent: Agent | null
  isLoading: boolean
  error: string | null
}

export const useAgentStore = defineStore('agent', {
  state: (): AgentStoreState => ({
    agents: [],
    pagination: null,
    filter: {
      name: '',
      status: '',
      page: 1,
      itemsPerPage: 5
    },
    selectedAgent: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async loadAgents(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        const res = await fetchAgents(this.filter)
        this.agents = res.response.records

        this.pagination = {
          currentPage: res.response.page.batch_number,
          total: res.response.page.total_record_count,
          totalPages: Math.ceil(res.response.page.total_record_count / res.response.page.batch_size),
          itemsPerPage: res.response.page.batch_size,
          data: res.response.records
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load agents'
        console.error('Error loading agents:', error)
      } finally {
        this.isLoading = false
      }
    },

    async getAgentDetail(id: string): Promise<Agent | null> {
      try {
        this.isLoading = true
        this.error = null
        const res = await getAgentById(id)
        this.selectedAgent = res.response
        return this.selectedAgent
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get agent detail'
        console.error('Error getting agent detail:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    clearSelectedAgent(): void {
      this.selectedAgent = null
    },

    setFilter(filter: Partial<AgentFilter>): void {
      this.filter = { ...this.filter, ...filter }
      this.loadAgents()
    },

    resetFilter(): void {
      this.filter = {
        name: '',
        status: '',
        page: 1,
        itemsPerPage: 5
      }
      this.loadAgents()
    },

    async createNewAgent(data: CreateAgentPayload): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await createAgent(data)
        await this.loadAgents()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create agent'
        console.error('Error creating agent:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateAgent(id: string, data: Partial<CreateAgentPayload>): Promise<unknown> {
      try {
        this.isLoading = true
        this.error = null
        const result = await updateAgent(id, data)
        if (this.selectedAgent?.id === id) {
          await this.getAgentDetail(id)
        }
        await this.loadAgents()
        return result
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update agent'
        console.error('Error updating agent:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteAgent(id: string): Promise<void> {
      try {
        this.isLoading = true
        this.error = null
        await deleteAgent(id)
        this.agents = this.agents.filter(agent => agent.id !== id)
        if (this.selectedAgent?.id === id) this.clearSelectedAgent()
        await this.loadAgents()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete agent'
        console.error('Error deleting agent:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})
