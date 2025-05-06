<template>
    <div class="p-4">
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm mb-4">
        <NuxtLink to="/admin/product" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <span>Pelanggan</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <span>Tambah</span>
      </div>
  
      <!-- Form Container -->
        <h1 class="text-xl font-bold mb-4">Data Produk Baru</h1>
        
        <div class="bg-white rounded-md p-4">
          <div class="space-y-4">
            <!-- ID Pelanggan -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">ID Pelanggan</label>
              </div>
              <div class="w-3/4 flex">
            <input 
              v-model="formData.idPelanggan" 
              type="text" 
              class="w-full border rounded-md px-3 py-2" 
            />
              </div>
            </div>
            
            <!-- Nama Lengkap -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">Nama Lengkap</label>
              </div>
              <div class="w-3/4 flex">
            <input 
              v-model="formData.namaLengkap" 
              type="text" 
              class="w-full border rounded-md px-3 py-2" 
            />
              </div>
            </div>
            
            <!-- Nomor Telepon -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">Nomor Telepon</label>
              </div>
              <div class="w-3/4 flex">
            <input 
              v-model="formData.nomorTelepon" 
              type="tel" 
              class="w-full border rounded-md px-3 py-2" 
            />
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">Email</label>
              </div>
              <div class="w-3/4 flex">
            <input 
              v-model="formData.email" 
              type="email" 
              class="w-full border rounded-md px-3 py-2" 
            />
              </div>
            </div>

            <!-- Jenis Kelamin -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">Jenis Kelamin</label>
              </div>
              <div class="w-3/4 flex">
            <select 
              v-model="formData.jenisKelamin" 
              class="w-full border rounded-md px-3 py-2"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center">
              <div class="w-1/4">
            <label class="text-sm">Status</label>
              </div>
              <div class="w-3/4 flex">
            <select 
              v-model="formData.status" 
              class="w-full border rounded-md px-3 py-2"
            >
              <option value="">Pilih Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
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
  
  </script>