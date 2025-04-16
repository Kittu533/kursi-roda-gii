export interface Package {
    id: string;
    packageId: string;
    voucherId: string;
    name: string;
    price: string;
    creationDate: string;
    updateDate: string;
    status: 'Active' | 'Inactive' | 'Pending';
}

export interface PackagePagination {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
}

export interface PackageFilter {
    page?: number;
    packageId?: string;
    voucherId?: string;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}