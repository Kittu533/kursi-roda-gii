<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Data Pengembalian</h2>
        </div>
      </div>
  
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm">
        <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <NuxtLink to="/admin/return" class="text-muted-foreground hover:text-foreground">
          Pengembalian
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
  
      <!-- Return Data Card -->
      <div v-else-if="returnItem" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Data Pengembalian</h3>
        </div>
        <div class="p-4">
          <div class="rounded-md border"> 
            <table class="w-full">
              <tbody>
                <!-- ID Pengembalian -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Pengembalian
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.id }}
                  </td>
                </tr>
                
                <!-- ID Transaksi -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Transaksi
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.transactionId }}
                  </td>
                </tr>
                
                <!-- ID Pelanggan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Pelanggan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.customerId }}
                  </td>
                </tr>
                
                <!-- Jumlah -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Jumlah
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    Rp{{ formatCurrency(returnItem.amount) }}
                  </td>
                </tr>
                
                <!-- Alasan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Alasan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.reason }}
                  </td>
                </tr>
                
                <!-- Status -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Status
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    <span 
                      class="px-2 py-1 rounded-md text-xs font-medium"
                      :class="getStatusClass(returnItem.status)"
                    >
                      {{ formatStatus(returnItem.status) }}
                    </span>
                  </td>
                </tr>
                
                <!-- Tanggal Di buat -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Tanggal Di buat
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.createdAt }}
                  </td>
                </tr>
                
                <!-- Terakhir Diperbaharui -->
                <tr>
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Terakhir Diperbaharui
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ returnItem.updatedAt }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div v-if="returnItem" class="flex justify-end mt-6 gap-2">
        <button 
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/return')"
        >
          Kembali
        </button>
        <button 
          class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
          @click="router.push(`/admin/return/${returnItem.id}/edit`)"
        >
          Simpan
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useReturnStore } from '~/store/return'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const returnId = computed(() => route.params.id as string)
  
  // Store
  const returnStore = useReturnStore()
  const returnItem = computed(() => returnStore.selectedReturn)
  const isLoading = computed(() => returnStore.isLoading)
  const error = computed(() => returnStore.error)
  
  // Methods
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('id-ID')
  }
  
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  const getStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      'berhasil': 'bg-green-100 text-green-800',
      'rusak': 'bg-red-100 text-red-800',
      'menunggu': 'bg-yellow-100 text-yellow-800',
      'ditolak': 'bg-gray-100 text-gray-800'
    }
    
    return statusClasses[status] || ''
  }
  
  // Lifecycle
  onMounted(async () => {
    if (returnId.value) {
      try {
        await returnStore.loadReturnDetails(returnId.value)
      } catch (error) {
        console.error('Error loading return details:', error)
      }
    }
  })
  </script>