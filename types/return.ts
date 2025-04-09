export interface Return {
    id: string;
    transactionId: string;
    customerId: string;
    amount: number;
    reason: string;
    returnDate: string;
    returnTime: string;
    status: 'berhasil' | 'rusak' | 'menunggu' | 'ditolak';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ReturnFilter {
    page: number;
    limit: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }
  
  export interface Pagination {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
  }