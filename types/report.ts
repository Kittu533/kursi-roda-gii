export interface Report {
    id: string;
    agentId: string;
    reportDate: string;
    totalPendapatan: number;
    totalPengembalian: number;
    totalTransaksi: number;
    totalTersedia: number;
    totalTersewa: number;
    totalKerusakan: number;
    jumlahPerawatan: number;
    pembayaranMenunggu: number;
    catatanTambahan: string;
    tanggalDibuat: string;
    terakhirDiperbarui: string;
    status: 'berhasil' | 'rusak' | 'menunggu';
  }
  
  export interface ReportFilter {
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