export interface Voucher {
    idVoucher: string;
    kodeVoucher: string;
    nilaiVoucher: string;
    persenVoucher: string;
    tanggalBerlaku: string;
    tanggalBerakhir: string;
    jumlahVoucher: number;
    voucherTerpakai: number;
    status: string;
  }
  
  export interface VoucherFilter {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page: number;
    itemsPerPage: number;
  }
  
  export interface VoucherPagination {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsPerPage: number;
    data: Voucher[];
  }
  
  export interface VoucherAction {
    type: 'view' | 'edit' | 'delete';
    row: Voucher;
  }
  
  export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row?: any) => any;
  }