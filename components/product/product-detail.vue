<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Produk - Detail</h2>
        </div>
      </div>
    
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm">
        <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <NuxtLink to="/admin/product" class="text-muted-foreground hover:text-foreground">
          Produk
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
    
      <!-- Product Data Card -->
      <div v-else-if="product" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Data Produk</h3>
        </div>
        <div class="p-4">
          <div class="rounded-md border"> 
            <table class="w-full">
              <tbody>
                <!-- ID Produk -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Produk
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.id }}
                  </td>
                </tr>
                
                <!-- ID Agent -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Agent
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.agentId }}
                  </td>
                </tr>
                
                <!-- Nomor Seri -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Nomor Seri
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.serialNumber }}
                  </td>
                </tr>
                
                <!-- Nama Produk -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Nama Produk
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.productName }}
                  </td>
                </tr>
                
                <!-- Model -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Model
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.model }}
                  </td>
                </tr>
                
                <!-- Kapasitas Berat -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Kapasitas Berat
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.weight }}
                  </td>
                </tr>
                
                <!-- Kapasitas Stok -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Kapasitas Stok
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.stock }} item
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
                      :class="getStatusClass(product.status)"
                    >
                      {{ formatStatus(product.status) }}
                    </span>
                  </td>
                </tr>
                
                <!-- Terakhir Perbaikan -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Terakhir Perbaikan
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.updatedAt }}
                  </td>
                </tr>
                
                <!-- Tanggal Di buat -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Tanggal Di buat
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.createdAt }}
                  </td>
                </tr>
                
                <!-- Terakhir Diperbaharui -->
                <tr>
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Terakhir Diperbaharui
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ product.updatedAt }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
      <!-- Action Buttons -->
      <div v-if="product" class="flex justify-end mt-6 gap-2">
        <button 
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/product')"
        >
          Kembali
        </button>
        <button 
          class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
          @click="router.push(`/admin/product/${product.id}/edit`)"
        >
          Simpan
        </button>
      </div>
    </div>
    </template>
    
    <script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useProductStore } from '~/store/product'
    
    // Router
    const route = useRoute()
    const router = useRouter()
    const productId = computed(() => route.params.id as string)
    
    // Store
    const productStore = useProductStore()
    const product = computed(() => productStore.selectedProduct)
    const isLoading = computed(() => productStore.isLoading)
    const error = computed(() => productStore.error)
    
    // Methods
    const formatStatus = (status: string): string => {
      return status.charAt(0).toUpperCase() + status.slice(1)
    }
    
    const getStatusClass = (status: string): string => {
      const statusClasses: Record<string, string> = {
        tersedia: 'bg-green-100 text-green-800',
        rusak: 'bg-red-100 text-red-800',
        disewa: 'bg-blue-100 text-blue-800'
      }
    
      return statusClasses[status] || ''
    }
    
    // Lifecycle
    onMounted(async () => {
      if (productId.value) {
        try {
          await productStore.loadProductDetails(productId.value)
        } catch (error) {
          console.error('Error loading product details:', error)
        }
      }
    })
    </script>