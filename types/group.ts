
export interface Group {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  memberCount: number
  status: string
}

export interface GroupFilter {
  status?: string
  search?: string
  page: number
  itemsPerPage: number
}

export interface GroupPagination {
  currentPage: number
  totalPages: number
  total: number
  itemsPerPage: number
  data: Group[]
}
