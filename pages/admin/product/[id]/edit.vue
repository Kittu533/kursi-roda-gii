<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
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
        <span>{{ isEditing ? 'Edit' : 'Tambah' }}</span>
      </div>
  
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
  
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
        {{ error }}
      </div>
  
      <!-- Form -->
      <form @submit.prevent="saveProduct" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">{{ isEditing ? 'Data Produk' : 'Data Produk Baru' }}</h3>
        </div>
        <div class="p-4 space-y-4">
          <!-- ID Produk and ID Agent -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="id" class="text-sm font-medium">ID Produk</label>
              <input
                id="id"
                type="text"
                v-model="formData.id"
                class="w-full px-3 py-2 border rounded-md"
                :disabled="isEditing"
                placeholder="ID akan dibuat otomatis"
                readonly
              />
            </div>
            
            <div class="space-y-2">
              <label for="agentId" class="text-sm font-medium">ID Agent</label>
              <input
                id="agentId"
                type="text"
                v-model="formData.agentId"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Foto Produk -->
          <div class="space-y-2">
            <label for="photo" class="text-sm font-medium">Foto Produk</label>
            <input
              id="photo"
              type="file"
              @change="handleFileUpload"
              class="w-full px-3 py-2 border rounded-md"
            />
            <div v-if="formData.photo" class="mt-2">
              <img :src="formData.photo" class="w-20 h-20 object-cover rounded" />
            </div>
          </div>
          
          <!-- Serial Number and Product Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="serialNumber" class="text-sm font-medium">Nomor Seri</label>
              <input
                id="serialNumber"
                type="text"
                v-model="formData.serialNumber"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="productName" class="text-sm font-medium">Nama Produk</label>
              <input
                id="productName"
                type="text"
                v-model="formData.productName"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Model and Max Weight -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="model" class="text-sm font-medium">Model Produk</label>
              <input
                id="model"
                type="text"
                v-model="formData.model"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="maxWeight" class="text-sm font-medium">Max Berat (kg)</label>
              <input
                id="maxWeight"
                type="number"
                v-model="formData.maxWeight"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Battery Life and Stock -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="batteryLife" class="text-sm font-medium">Daya Baterai</label>
              <input
                id="batteryLife"
                type="text"
                v-model="formData.batteryLife"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="stock" class="text-sm font-medium">Stok Barang</label>
              <input
                id="stock"
                type="number"
                v-model="formData.stock"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Status -->
          <div class="space-y-2">
            <label for="status" class="text-sm font-medium">Status</label>
            <select
              id="status"
              v-model="formData.status"
              class="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Pilih Status</option>
              <option value="tersedia">Tersedia</option>
              <option value="rusak">Rusak</option>
              <option value="tersewa">Tersewa</option>
              <option value="perbaikan">Perbaikan</option>
            </select>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="p-4 border-t flex justify-end gap-2">
          <button 
            type="button"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            @click="router.push('/admin/product')"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductStore } from '~/store/product'
  import type { Product } from '~/types/product'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const productId = computed(() => route.params.id as string)
  const isEditing = computed(() => productId.value && productId.value !== 'new')
  
  // Store
  const productStore = useProductStore()
  const isLoading = computed(() => productStore.isLoading)
  const error = computed(() => productStore.error)
  
  // Form data
  const formData = ref<Partial<Product>>({
    id: '',
    agentId: '',
    photo: '',
    serialNumber: '',
    productName: '',
    model: '',
    maxWeight: 0,
    batteryLife: '',
    stock: 0,
    status: ''
  })
  
  // Methods
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.photo = e.target?.result as string
      }
      reader.readAsDataURL(input.files[0])
    }
  }
  
  const saveProduct = async () => {
    try {
      if (isEditing.value) {
        await productStore.updateProduct(productId.value, formData.value)
      } else {
        await productStore.createProduct(formData.value as Omit<Product, 'id'>)
      }
      router.push('/admin/product')
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    if (isEditing.value) {
      try {
        const product = await productStore.loadProductDetails(productId.value)
        if (product) {
          formData.value = { ...product }
        }
      } catch (error) {
        console.error('Error loading product details:', error)
      }
    }
  })
  </script>