export interface Pagination {
    currentPage: number
    totalPages: number
    total: number
    itemsPerPage: number
    data: any[]
  }
  
  export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
  }
  
  export interface TableColumn {
    key: string
    label: string
    render?: (value: any, row?: any) => any
  }