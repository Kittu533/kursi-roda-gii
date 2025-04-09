export interface Transaction {
    id: string;
    voucherId: string;
    amount: number;
    paymentMethod: string;
    paymentDetail: string;
    transactionDate: string;
    transactionTime: string;
    status: 'batal' | 'berhasil' | 'gagal' | 'tertunda' | 'masuk';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BookingTransaction extends Transaction {
    bookingId: string;
  }
  
  export interface WithdrawTransaction extends Transaction {
    guideId: string;
    agentId: string;
    withdrawDate: string;
    income: number;
    description: string;
  }
  
  export interface TransactionFilter {
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