export interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  gender: string
  created_at: string
  updated_at: string
  status: {
    id: string
    status: string
  }
}

export interface CreateCustomerPayload {
  full_name: string
  email: string
  phone: string
  gender: string
  status: string
}

export interface CustomerApiResponse {
  response: {
    page: {
      total_record_count: number
      batch_number: number
      batch_size: number
      max_batch_size: number
    },
    records: Customer[]
  },
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

export interface CustomerFilter {
  name?: string
  status?: string
  page: number
  itemsPerPage: number
}

export interface CustomerPagination {
  page: number
  totalItems: number
  totalPages: number
  itemsPerPage: number
}

export interface CustomerAction {
  type: "view" | "edit" | "delete"
  row: Customer
}

export interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row?: Customer) => unknown
}