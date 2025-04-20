export interface ReturnItem {
    idPengembalian: string;       // Contoh: "P80001"
    idTransaksi: string;          // Contoh: "T0001"
    jenisKerusakan: string;       // Contoh: "Kerusakan ringan"
    biayaTambahan: number;        // Contoh: 390000 (dalam angka, tanpa "Rp")
    catatan: string;              // Contoh: "Produk rusak"
    tanggalPengembalian: string;  // Contoh: "21/03/2025" (format tanggal bisa disesuaikan)
    bukti: string;                // Contoh: "Lihat Foto" atau URL gambar
    status: string;               // Contoh: "Menunggu"
}

export interface ReturnItemFilter {
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