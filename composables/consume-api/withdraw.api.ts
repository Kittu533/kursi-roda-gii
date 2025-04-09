import { ref } from 'vue'
import type { WithdrawTransaction, TransactionFilter, Pagination } from '~/types/transaction'

export function useWithdrawApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for withdrawals
  const mockWithdraws: WithdrawTransaction[] = [
    {
      id: 'T0001',
      voucherId: 'V0001',
      guideId: 'G0001',
      agentId: 'A0001',
      amount: 350000,
      income: 350000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BRI',
      description: 'Pembayaran Berhasil',
      withdrawDate: '01/03/2025',
      transactionDate: '01/03/2025',
      transactionTime: '08:00',
      status: 'batal',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'T0002',
      voucherId: 'V0002',
      guideId: 'G0002',
      agentId: 'A0002',
      amount: 1200000,
      income: 1200000,
      paymentMethod: 'QRIS',
      paymentDetail: 'QRIS',
      description: 'Pembayaran Berhasil',
      withdrawDate: '01/03/2025',
      transactionDate: '01/03/2025',
      transactionTime: '11:00',
      status: 'berhasil',
      createdAt: '01/03/2025',
      updatedAt: '01/03/2025'
    },
    {
      id: 'T0003',
      voucherId: 'V0003',
      guideId: 'G0003',
      agentId: 'A0003',
      amount: 525000,
      income: 525000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BCA',
      description: 'Pembayaran Berhasil',
      withdrawDate: '02/03/2025',
      transactionDate: '02/03/2025',
      transactionTime: '09:20',
      status: 'berhasil',
      createdAt: '02/03/2025',
      updatedAt: '02/03/2025'
    },
    {
      id: 'T0004',
      voucherId: 'V0004',
      guideId: 'G0004',
      agentId: 'A0004',
      amount: 560000,
      income: 560000,
      paymentMethod: 'Transfer bank',
      paymentDetail: 'BRI',
      description: 'Pembayaran Gagal',
      withdrawDate: '03/03/2025',
      transactionDate: '03/03/2025',
      transactionTime: '07:00',
      status: 'gagal',
      createdAt: '03/03/2025',
      updatedAt: '03/03/2025'
    },
    {
      id: 'T0005',
      voucherId: 'V0005',
      guideId: 'G0005',
      agentId: 'A0005',
      amount: 810000,
      income: 810000,
      paymentMethod: 'CC',
      paymentDetail: 'CIMB',
      description: 'Menunggu Konfirmasi',
      withdrawDate: '05/03/2025',
      transactionDate: '05/03/2025',
      transactionTime: '06:15',
      status: 'tertunda',
      createdAt: '05/03/2025',
      updatedAt: '05/03/2025'
    }
  ]

  const getWithdraws = async (filter: TransactionFilter): Promise<{ data: WithdrawTransaction[], pagination: Pagination }> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data with pagination
      return {
        data: mockWithdraws,
        pagination: {
          currentPage: filter.page || 1,
          totalPages: 2,
          total: mockWithdraws.length,
          itemsPerPage: filter.limit || 10
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch withdraw transactions'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const getWithdrawById = async (id: string): Promise<WithdrawTransaction> => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const withdraw = mockWithdraws.find(w => w.id === id)
      
      if (!withdraw) {
        throw new Error('Withdraw transaction not found')
      }
      
      return withdraw
    } catch (err) {
      error.value = 'Failed to fetch withdraw transaction details'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getWithdraws,
    getWithdrawById
  }
}