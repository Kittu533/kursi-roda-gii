import { ref, computed } from "vue"
import type { Agent, AgentFilter, AgentPagination } from "~/types/agent"
import { useAgentApi } from "~/composables/consume-api/agent.api"

export function useAgents() {
  const agentApi = useAgentApi()

  // State
  const agents = ref<Agent[]>([])
  const selectedAgent = ref<Agent | null>(null)
  const pagination = ref<AgentPagination>({
    currentPage: 1,
    totalPages: 0,
    total: 0,
    itemsPerPage: 5,
    data: [],
  })

  // Methods
  const fetchAgents = async (filter?: AgentFilter) => {
    const result = await agentApi.getAgents(filter)
    pagination.value = result
    agents.value = result.data
    return result
  }

  const fetchAgentById = async (id: string) => {
    selectedAgent.value = await agentApi.getAgentById(id)
    return selectedAgent.value
  }

  const saveAgent = async (agentData: Partial<Agent>) => {
    if (selectedAgent.value) {
      // Update existing agent
      selectedAgent.value = (await agentApi.updateAgent(selectedAgent.value.id, agentData)) as Agent
    } else {
      // Create new agent
      selectedAgent.value = await agentApi.createAgent(agentData as Omit<Agent, "id">)
    }

    return selectedAgent.value
  }

  const removeAgent = async (id: string) => {
    return await agentApi.deleteAgent(id)
  }

  // Computed
  const isLoading = computed(() => agentApi.isLoading.value)
  const error = computed(() => agentApi.error.value)

  return {
    // State
    agents,
    selectedAgent,
    pagination,
    isLoading,
    error,

    // Methods
    fetchAgents,
    fetchAgentById,
    saveAgent,
    removeAgent,
  }
}

