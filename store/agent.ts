import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Agent, AgentFilter } from "~/types/agent"
import { useAgents } from "~/composables/agent/use-agent"
import { useNotification } from "~/composables/use-notification"

export const useAgentStore = defineStore("agent", () => {
  // Composables
  const {
    agents: agentsRef,
    selectedAgent: selectedAgentRef,
    pagination: paginationRef,
    isLoading,
    error,
    fetchAgents,
    fetchAgentById,
    saveAgent,
    removeAgent,
  } = useAgents()

  const notification = useNotification()

  // State
  const filter = ref<AgentFilter>({
    status: "",
    date: "",
    page: 1,
    itemsPerPage: 5,
  })

  // Actions
  const loadAgents = async () => {
    try {
      const result = await fetchAgents(filter.value)
      return result
    } catch (e) {
      notification.error("Failed to load agents")
      throw e
    }
  }

  const setFilter = async (newFilter: Partial<AgentFilter>) => {
    filter.value = {
      ...filter.value,
      ...newFilter,
      // Reset to page 1 when filter changes (except when explicitly changing page)
      page: newFilter.page || 1,
    }

    return await loadAgents()
  }

  const resetFilter = async () => {
    filter.value = {
      status: "",
      date: "",
      page: 1,
      itemsPerPage: 5,
    }

    return await loadAgents()
  }

  const loadAgentDetails = async (id: string) => {
    try {
      return await fetchAgentById(id)
    } catch (e) {
      notification.error("Failed to load agent details")
      throw e
    }
  }

  const updateAgent = async (id: string, agentData: Partial<Agent>) => {
    try {
      const result = await saveAgent({ id, ...agentData })
      notification.success("Agent updated successfully")
      return result
    } catch (e) {
      notification.error("Failed to update agent")
      throw e
    }
  }

  const createAgent = async (agentData: Omit<Agent, "id">) => {
    try {
      const result = await saveAgent(agentData)
      notification.success("Agent created successfully")
      return result
    } catch (e) {
      notification.error("Failed to create agent")
      throw e
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const result = await removeAgent(id)
      if (result) {
        notification.success("Agent deleted successfully")
        await loadAgents()
      }
      return result
    } catch (e) {
      notification.error("Failed to delete agent")
      throw e
    }
  }

  // Getters
  const agents = computed(() => agentsRef.value)
  const selectedAgent = computed(() => selectedAgentRef.value)
  const pagination = computed(() => paginationRef.value)

  return {
    // State
    filter,
    agents,
    selectedAgent,
    pagination,
    isLoading,
    error,

    // Actions
    loadAgents,
    setFilter,
    resetFilter,
    loadAgentDetails,
    updateAgent,
    createAgent,
    deleteAgent,
  }
})

