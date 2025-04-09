import { ref } from "vue"
import type { Agent, AgentFilter, AgentPagination } from "~/types/agent"
import { useApiClient } from "../use-fetch-api"

// Mock data - would be replaced with actual API calls
const mockAgents: Agent[] = [
  {
    id: "A0001",
    photo: "/avatar.webp",
    name: "Herman Prakoso",
    phone: "+6281234567890",
    email: "hermanp@gmail.com",
    username: "AgentX",
    password: "12345",
    location: "Makkah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "01/03/2025",
    updatedAt: "01/03/2025",
    status: "menunggu",
  },
  {
    id: "A0002",
    photo: "/avatar.webp",
    name: "Nasisa Fadilla",
    phone: "+6281234567890",
    email: "nasisa@gmail.com",
    username: "AgentY",
    password: "12345",
    location: "Makkah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "02/03/2025",
    updatedAt: "07/03/2025",
    status: "menunggu",
  },
  {
    id: "A0003",
    photo: "/avatar.webp",
    name: "Mia Anggreni",
    phone: "+6281234567890",
    email: "mia@gmail.com",
    username: "AgentZ",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "03/03/2025",
    updatedAt: "04/03/2025",
    status: "aktif",
  },
  {
    id: "A0004",
    photo: "/avatar.webp",
    name: "Finda Alifa",
    phone: "+6281234567890",
    email: "finda@gmail.com",
    username: "AgentA",
    password: "12345",
    location: "Makkah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "04/03/2025",
    updatedAt: "09/03/2025",
    status: "dibatalkan",
  },
  {
    id: "A0005",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilham@gmail.com",
    username: "AgentB",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025",
    status: "nonaktif",
  },{
    id: "A0006",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilham@gmail.com",
    username: "AgentB",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025",
    status: "nonaktif",
  },{
    id: "A0007",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilham@gmail.com",
    username: "AgentB",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025",
    status: "nonaktif",
  },{
    id: "A0008",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilham@gmail.com",
    username: "AgentB",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025",
    status: "nonaktif",
  },{
    id: "A0009",
    photo: "/avatar.webp",
    name: "Ilham Dean",
    phone: "+6281234567890",
    email: "ilham@gmail.com",
    username: "AgentB",
    password: "12345",
    location: "Madinah",
    openHour: "08:00",
    closeHour: "17:00",
    latitude: "41°24'12.2\"N 2°10'26.5\"E",
    longitude: "41°24.2028, 2.10.4418",
    createdAt: "05/03/2025",
    updatedAt: "08/03/2025",
    status: "nonaktif",
  },
]

export function useAgentApi() {
  const apiClient = useApiClient()
  const agents = ref<Agent[]>([...mockAgents])

  // Get agents with filtering and pagination
  const getAgents = async (filter?: AgentFilter): Promise<AgentPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<AgentPagination>('/api/agents', filter)
    // return response.data

    // Filter logic
    let filteredAgents = [...mockAgents]

    if (filter?.status && filter.status !== "semua") {
      filteredAgents = filteredAgents.filter((agent) => agent.status === filter.status)
    }

    if (filter?.date) {
      filteredAgents = filteredAgents.filter(
        (agent) => agent.createdAt === filter.date || agent.updatedAt === filter.date,
      )
    }

    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredAgents.length
    const totalPages = Math.ceil(total / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredAgents.slice(start, end)

    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData,
    }
  }

  // Get a single agent by ID
  const getAgentById = async (id: string): Promise<Agent | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Agent>(`/api/agents/${id}`)
    // return response.data

    const agent = mockAgents.find((agent) => agent.id === id)
    return agent || null
  }

  // Create a new agent
  const createAgent = async (agentData: Omit<Agent, "id">): Promise<Agent> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Agent>('/api/agents', agentData)
    // return response.data

    // Generate a new ID
    const newId = `A${String(mockAgents.length + 1).padStart(4, "0")}`

    const newAgent: Agent = {
      id: newId,
      ...agentData,
    }

    // Add to mock data
    mockAgents.push(newAgent)
    agents.value = [...mockAgents]

    return newAgent
  }

  // Update an existing agent
  const updateAgent = async (id: string, agentData: Partial<Agent>): Promise<Agent | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Agent>(`/api/agents/${id}`, agentData)
    // return response.data

    const agentIndex = mockAgents.findIndex((agent) => agent.id === id)

    if (agentIndex === -1) {
      return null
    }

    // Update the agent
    const updatedAgent = {
      ...mockAgents[agentIndex],
      ...agentData,
    }

    mockAgents[agentIndex] = updatedAgent
    agents.value = [...mockAgents]

    return updatedAgent
  }

  // Delete an agent
  const deleteAgent = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/agents/${id}`)

    const agentIndex = mockAgents.findIndex((agent) => agent.id === id)

    if (agentIndex === -1) {
      return false
    }

    // Remove the agent
    mockAgents.splice(agentIndex, 1)
    agents.value = [...mockAgents]

    return true
  }

  return {
    ...apiClient,
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}

