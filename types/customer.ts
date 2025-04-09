export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  gender: string
  registerDate: string
  lastLogin: string
  status: string
}

export interface CustomerFilter {
  status?: string
  date?: string
  page: number
  itemsPerPage: number
}

export interface CustomerPagination {
  currentPage: number
  totalPages: number
  total: number
  itemsPerPage: number
  data: Customer[]
}

export interface CustomerAction {
  type: "view" | "edit" | "delete"
  row: Customer
}

export interface Column {
  key: string
  label: string
  render?: (value: any, row?: any) => any
}

