export interface Product {
    id: string
    agentId: string
    serialNumber: string
    productName: string
    model: string
    weight: string
    stock: number
    status: string
    createdAt: string
    updatedAt: string
    lastRented?: string
  }
  
  export interface ProductFilter {
    status?: string
    date?: string
    page: number
    itemsPerPage: number
  }
  
  export interface ProductPagination {
    currentPage: number
    totalPages: number
    total: number
    itemsPerPage: number
    data: Product[]
  }
  
  export interface ProductAction {
    type: "view" | "edit" | "delete"
    row: Product
  }
  
  export interface Column {
    key: string
    label: string
    render?: (value: any, row?: any) => any
  }