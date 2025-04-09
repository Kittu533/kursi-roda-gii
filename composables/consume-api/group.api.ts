import { ref } from 'vue'
import type { Group, GroupFilter, GroupPagination } from '~/types/group'
import { useApiClient } from '../use-fetch-api'

// Mock data - would be replaced with actual API calls
const mockGroups: Group[] = [
  {
    id: "G0001",
    name: "Marketing Team",
    description: "Group for marketing team members",
    createdAt: "01/03/2025",
    updatedAt: "05/03/2025",
    memberCount: 12,
    status: "aktif"
  },
  {
    id: "G0002",
    name: "Development Team",
    description: "Group for development team members",
    createdAt: "02/03/2025",
    updatedAt: "07/03/2025",
    memberCount: 8,
    status: "aktif"
  },
  {
    id: "G0003",
    name: "Sales Team",
    description: "Group for sales team members",
    createdAt: "03/03/2025",
    updatedAt: "04/03/2025",
    memberCount: 5,
    status: "nonaktif"
  }
]

export function useGroupApi() {
  const apiClient = useApiClient()
  const groups = ref<Group[]>([...mockGroups])
  
  // Get groups with filtering and pagination
  const getGroups = async (filter?: GroupFilter): Promise<GroupPagination> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<GroupPagination>('/api/groups', filter)
    // return response.data
    
    // Filter logic
    let filteredGroups = [...mockGroups]
    
    if (filter?.status) {
      filteredGroups = filteredGroups.filter(group => group.status === filter.status)
    }
    
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      filteredGroups = filteredGroups.filter(
        group => 
          group.name.toLowerCase().includes(searchLower) || 
          group.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Pagination logic
    const page = filter?.page || 1
    const itemsPerPage = filter?.itemsPerPage || 5
    const total = filteredGroups.length
    const totalPages = Math.ceil(total / itemsPerPage)
    
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedData = filteredGroups.slice(start, end)
    
    return {
      currentPage: page,
      totalPages,
      total,
      itemsPerPage,
      data: paginatedData
    }
  }
  
  // Get a single group by ID
  const getGroupById = async (id: string): Promise<Group | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.get<Group>(`/api/groups/${id}`)
    // return response.data
    
    const group = mockGroups.find(group => group.id === id)
    return group || null
  }
  
  // Create a new group
  const createGroup = async (groupData: Omit<Group, 'id'>): Promise<Group> => {
    // In a real app, this would call the API
    // const response = await apiClient.post<Group>('/api/groups', groupData)
    // return response.data
    
    // Generate a new ID
    const newId = `G${String(mockGroups.length + 1).padStart(4, '0')}`
    
    const newGroup: Group = {
      id: newId,
      ...groupData
    }
    
    // Add to mock data
    mockGroups.push(newGroup)
    groups.value = [...mockGroups]
    
    return newGroup
  }
  
  // Update an existing group
  const updateGroup = async (id: string, groupData: Partial<Group>): Promise<Group | null> => {
    // In a real app, this would call the API
    // const response = await apiClient.put<Group>(`/api/groups/${id}`, groupData)
    // return response.data
    
    const groupIndex = mockGroups.findIndex(group => group.id === id)
    
    if (groupIndex === -1) {
      return null
    }
    
    // Update the group
    const updatedGroup = {
      ...mockGroups[groupIndex],
      ...groupData,
      updatedAt: new Date().toLocaleDateString('en-GB')
    }
    
    mockGroups[groupIndex] = updatedGroup
    groups.value = [...mockGroups]
    
    return updatedGroup
  }
  
  // Delete a group
  const deleteGroup = async (id: string): Promise<boolean> => {
    // In a real app, this would call the API
    // await apiClient.delete(`/api/groups/${id}`)
    
    const groupIndex = mockGroups.findIndex(group => group.id === id)
    
    if (groupIndex === -1) {
      return false
    }
    
    // Remove the group
    mockGroups.splice(groupIndex, 1)
    groups.value = [...mockGroups]
    
    return true
  }
  
  return {
    ...apiClient,
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
  }
}