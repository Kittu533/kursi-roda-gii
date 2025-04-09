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


export interface GuideAction {
    type: 'view' | 'edit' | 'delete'
    row: Guide
}

export interface Column {
    key: keyof Guide | 'actions'
    label: string
    render?: (value: any, row: Guide) => string | number | { component: string; class: string; text?: string; slots?: { default: string } }
}
