export interface Maintenance {
    id: string;
    maintenanceId: string;
    productId: string;
    date: string; 
    description: string;
    photoUrl: string;
    status: 'Maintenance' | 'Repaired' | 'Pending' | 'Cancelled';
}

export interface MaintenancePagination {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
}

export interface MaintenanceFilter {
    page?: number;
    maintenanceId?: string;
    productId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}
