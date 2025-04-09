<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Data Laporan</h2>
        </div>
      </div>
  
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm">
        <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <NuxtLink to="/admin/report" class="text-muted-foreground hover:text-foreground">
          Laporan
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <span>Detail</span>
      </div>
  
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
  
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
        {{ error }}
      </div>
  
      <!-- Report Data Card -->
      <div v-else-if="report" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Data Laporan</h3>
        </div>
        <div class="p-4">
          <div class="rounded-md border"> 
            <table class="w-full">
              <tbody>
                <!-- ID Laporan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Laporan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.id }}
                  </td>
                </tr>
                
                <!-- ID Agen -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Agen
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.agentId }}
                  </td>
                </tr>
                
                <!-- Tanggal Laporan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Tanggal Laporan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.reportDate }}
                  </td>
                </tr>
                
                <!-- Total Tersedia -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Tersedia
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.totalTersedia }}
                  </td>
                </tr>
                
                <!-- Total Tersewa -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Tersewa
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.totalTersewa }}
                  </td>
                </tr>
                
                <!-- Total Kerusakan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Kerusakan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.totalKerusakan }}
                  </td>
                </tr>
                
                <!-- Jumlah Perawatan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Jumlah Perawatan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.jumlahPerawatan }}
                  </td>
                </tr>
                
                <!-- Total Pendapatan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Pendapatan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    Rp{{ formatCurrency(report.totalPendapatan) }}
                  </td>
                </tr>
                
                <!-- Total Pengembalian -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Pengembalian
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    Rp{{ formatCurrency(report.totalPengembalian) }}
                  </td>
                </tr>
                
                <!-- Total Transaksi -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Total Transaksi
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.totalTransaksi }}
                  </td>
                </tr>
                
                <!-- Pembayaran Menunggu -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Pembayaran Menunggu
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.pembayaranMenunggu }}
                  </td>
                </tr>
                
                <!-- Catatan Tambahan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Catatan Tambahan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.catatanTambahan || '-' }}
                  </td>
                </tr>
                
                <!-- Tanggal Dibuat -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Tanggal Dibuat
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.tanggalDibuat }}
                  </td>
                </tr>
                
                <!-- Terakhir Diperbarui -->
                <tr>
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Terakhir Diperbarui
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ report.terakhirDiperbarui }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div v-if="report" class="flex justify-end mt-6 gap-2">
        <button 
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/report')"
        >
          Kembali
        </button>
        <button 
          class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
          @click="router.push(`/admin/report/${report.id}/edit`)"
        >
          Simpan
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useReportStore } from '~/store/report'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const reportId = computed(() => route.params.id as string)
  
  // Store
  const reportStore = useReportStore()
  const report = computed(() => reportStore.selectedReport)
  const isLoading = computed(() => reportStore.isLoading)
  const error = computed(() => reportStore.error)
  
  // Methods
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('id-ID')
  }
  
  // Lifecycle
  onMounted(async () => {
    if (reportId.value) {
      try {
        await reportStore.loadReportDetails(reportId.value)
      } catch (error) {
        console.error('Error loading report details:', error)
      }
    }
  })
  </script>