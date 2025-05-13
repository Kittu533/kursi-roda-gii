export interface Guide {
  id: string
  full_name: string
  email: string
  phone: string
  photo_profile: string
  identity_document: string
  bank_account_number: string
  emergency_phone_number: string
  created_at: string
  status: {
    id: string
    status: string
  }
}

export interface CreateGuidePayload {
  full_name: string
  email: string
  phone: string
  photo_profile: string
  identity_document: string
  bank_account_number: string
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
