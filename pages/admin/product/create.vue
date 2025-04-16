<template>
    <div class="p-4">
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm mb-4">
        <NuxtLink to="/admin/product" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <span>Produk</span>
      </div>
  
      <!-- Form Container -->
        <h1 class="text-xl font-bold mb-4">Data Produk Baru</h1>
        
        <div class="bg-white rounded-md p-4">
          <div class="space-y-4">
            <!-- Nama -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Nama</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- ID Produk -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">ID Produk</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- ID Agen -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">ID Agen</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />

              </div>
            </div>
            
            <!-- Foto Produk -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Foto Produk</label>
              </div>
              <div class="w-3/4">
                <button class="flex items-center text-gray-600 border rounded-md px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Unggah Foto
                </button>
              </div>
            </div>
            
            <!-- Nomor Seri -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Nomor Seri</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Model -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Model</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Kapasitas Berat -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Kapasitas Berat</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Kapasitas Baterai -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Kapasitas Baterai</label>
              </div>
              <div class="w-3/4 flex">
                <input type="text" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Status -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Status</label>
              </div>
              <div class="w-3/4 flex">
                <select class="w-full border rounded-md px-3 py-2">
                  <option value="">Pilih Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
               
              </div>
            </div>
            
            <!-- Terakhir Perbaikan -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Terakhir Perbaikan</label>
              </div>
              <div class="w-3/4 flex">
                <input type="date" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Tanggal Dibuat -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Tanggal Dibuat</label>
              </div>
              <div class="w-3/4 flex">
                <input type="date" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
            
            <!-- Terakhir Diperbarui -->
            <div class="flex items-center">
              <div class="w-1/4">
                <label class="text-sm">Terakhir Diperbarui</label>
              </div>
              <div class="w-3/4 flex">
                <input type="date" class="w-full border rounded-md px-3 py-2" />
               
              </div>
            </div>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="flex justify-end mt-4">
          <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Simpan
          </button>
        </div>
      </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface ProductForm {
    nama: string
    idProduk: string
    idAgen: string
    fotoProduk: File | null
    nomorSeri: string
    model: string
    kapasitasBerat: string
    kapasitasBaterai: string
    status: 'aktif' | 'nonaktif' | ''
    terakhirPerbaikan: string
    tanggalDibuat: string
    terakhirDiperbarui: string
  }
  
  const formData = ref<ProductForm>({
    nama: '',
    idProduk: '',
    idAgen: '',
    fotoProduk: null,
    nomorSeri: '',
    model: '',
    kapasitasBerat: '',
    kapasitasBaterai: '',
    status: '',
    terakhirPerbaikan: '',
    tanggalDibuat: '',
    terakhirDiperbarui: ''
  })
  
  const saveProduct = async (): Promise<void> => {
    try {
      // Logic to save product
      console.log('Saving product:', formData.value)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }
  </script>