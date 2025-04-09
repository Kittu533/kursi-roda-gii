export interface Agent {
    id: string
    photo: string
    name: string
    phone: string
    email: string
    username: string
    password: string
    location: string
    openHour: string
    closeHour: string
    latitude: string
    longitude: string
    createdAt: string
    updatedAt: string
    status: string
}

export interface AgentFilter {
    status?: string
    date?: string
    page: number
    itemsPerPage: number
}

export interface AgentPagination {
    currentPage: number
    totalPages: number
    total: number
    itemsPerPage: number
    data: Agent[]
}

export interface AgentAction {
    type: "view" | "edit" | "delete"
    row: Agent
}

export interface Column {
    key: string
    label: string
    render?: (value: any, row?: any) => any
}

