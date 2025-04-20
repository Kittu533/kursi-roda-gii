import { ref } from 'vue'
import type { ReturnItem, ReturnFilter, Pagination } from '~/types/return-agent'

export function useReturnApi() {
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Mock data for returns
    const mockReturns: ReturnItem[] = [
        {
            idPengembalian: 'P80001',
            idTransaksi: 'T0001',
            jenisKerusakan: 'Kerusakan ringan',
            biayaTambahan: 525000,
            catatan: 'Produk rusak',
            tanggalPengembalian: '01/03/2025',
            bukti: 'https://example.com/foto1.jpg',
            status: 'Menunggu'
        },
        {
            idPengembalian: 'P80002',
            idTransaksi: 'T0002',
            jenisKerusakan: 'Kerusakan berat',
            biayaTambahan: 350000,
            catatan: 'Produk tidak sesuai',
            tanggalPengembalian: '01/03/2025',
            bukti: 'https://example.com/foto2.jpg',
            status: 'Selesai'
        },
        {
            idPengembalian: 'P80003',
            idTransaksi: 'T0003',
            jenisKerusakan: 'Kerusakan ringan',
            biayaTambahan: 240000,
            catatan: 'Pengiriman terlambat',
            tanggalPengembalian: '01/03/2025',
            bukti: 'https://example.com/foto3.jpg',
            status: 'Menunggu'
        },
        {
            idPengembalian: 'P80004',
            idTransaksi: 'T0004',
            jenisKerusakan: 'Kerusakan total',
            biayaTambahan: 780000,
            catatan: 'Garansi tidak sesuai',
            tanggalPengembalian: '01/03/2025',
            bukti: 'https://example.com/foto4.jpg',
            status: 'Ditolak'
        },
        {
            idPengembalian: 'P80005',
            idTransaksi: 'T0005',
            jenisKerusakan: 'Kerusakan ringan',
            biayaTambahan: 1000000,
            catatan: 'Produk rusak',
            tanggalPengembalian: '01/03/2025',
            bukti: 'https://example.com/foto5.jpg',
            status: 'Menunggu'
        }
    ]

    const getReturns = async (filter: ReturnFilter): Promise<{ data: ReturnItem[], pagination: Pagination }> => {
        isLoading.value = true
        error.value = null
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            return {
                data: mockReturns,
                pagination: {
                    currentPage: filter.page,
                    totalPages: 2,
                    total: mockReturns.length,
                    itemsPerPage: filter.limit
                }
            }
        } catch (err) {
            error.value = 'Failed to fetch returns'
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    const getReturnById = async (id: string): Promise<ReturnItem> => {
        isLoading.value = true
        error.value = null
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const returnItem = mockReturns.find(r => r.idPengembalian === id)
            
            if (!returnItem) {
                throw new Error('Return not found')
            }
            
            return returnItem
        } catch (err) {
            error.value = 'Failed to fetch return details'
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        error,
        getReturns,
        getReturnById
    }
}
