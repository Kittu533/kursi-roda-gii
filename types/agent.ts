export interface Agent {
    id: string
    full_name: string
    email: string
    phone: string
    phone_code: string | null
    gender: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    status: {
      id: string
      status: string
    }
  }
  
  export interface CreateAgentPayload {
    full_name: string
    email: string
    phone: string
    gender: string
    status: string
  }
  
  export interface AgentFilter {
    name?: string
    status?: string
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
  
  export interface AgentApiListResponse {
    response: {
      page: {
        total_record_count: number
        batch_number: number
        batch_size: number
        max_batch_size?: number
      }
      records: Agent[]
    }
    metaData: {
      message: string
      code: number
      response_code: string
    }
  }
  
  export interface AgentApiSingleResponse {
    response: Agent
    metaData: {
      message: string
      code: number
      response_code: string
    }
  }
  