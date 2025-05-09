export interface Guide {
    id: string
    photo: string
    name: string
    phone: string
    ktp: string
    accountNumber: string
    createdAt: string
    status: string
  }
  
  export interface CreateGuidePayload {
    name: string
    phone: string
    ktp: string
    accountNumber: string
    photo: string
    status: string
  }
  
  export interface GuideFilter {
    status?: string
    date?: string
    page: number
    itemsPerPage: number
  }
  
  export interface GuidePagination {
    currentPage: number
    totalPages: number
    total: number
    itemsPerPage: number
    data: Guide[]
  }
  
  export interface GuideApiListResponse {
    response: {
      page: {
        total_record_count: number
        batch_number: number
        batch_size: number
        max_batch_size?: number
      }
      records: Guide[]
    }
    metaData: {
      message: string
      code: number
      response_code: string
    }
  }
  
  export interface GuideApiSingleResponse {
    response: Guide
    metaData: {
      message: string
      code: number
      response_code: string
    }
  }
  