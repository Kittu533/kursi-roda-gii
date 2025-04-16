<template>
    <div class="p-4">
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm mb-4">
        <NuxtLink to="/admin/voucher" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span>Voucher</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span>Buat Baru</span>
      </div>
  
      <!-- Form Container -->
      <h1 class="text-xl font-bold mb-4">Voucher Baru</h1>
      
      <div class="bg-white rounded-md p-4">
        <div class="space-y-4">
          <!-- ID Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">ID Voucher</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.idVoucher"
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Akan digenerate otomatis"
                readonly
              />
            </div>
          </div>
          
          <!-- Kode Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Kode Voucher*</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.kodeVoucher"
                class="w-full border rounded-md px-3 py-2" 
                required
              />
            </div>
          </div>
          
          <!-- Nilai Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Nilai Voucher (Rp)</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.nilaiVoucher"
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Contoh: 50000"
              />
            </div>
          </div>
          
          <!-- Persen Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Persen Voucher (%)</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.persenVoucher"
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Contoh: 10"
              />
            </div>
          </div>
          
          <!-- Tanggal Berlaku -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Tanggal Berlaku*</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="date" 
                v-model="formData.tanggalBerlaku"
                class="w-full border rounded-md px-3 py-2" 
                required
              />
            </div>
          </div>
          
          <!-- Tanggal Berakhir -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Tanggal Berakhir*</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="date" 
                v-model="formData.tanggalBerakhir"
                class="w-full border rounded-md px-3 py-2" 
                required
              />
            </div>
          </div>
          
          <!-- Jumlah Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Jumlah Voucher*</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="number" 
                v-model="formData.jumlahVoucher"
                class="w-full border rounded-md px-3 py-2" 
                min="1"
                required
              />
            </div>
          </div>
          
          <!-- Voucher Terpakai -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Voucher Terpakai</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="number" 
                v-model="formData.voucherTerpakai"
                class="w-full border rounded-md px-3 py-2" 
                min="0"
                readonly
              />
            </div>
          </div>
          
          <!-- Status -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Status*</label>
            </div>
            <div class="w-3/4 flex">
              <select 
                v-model="formData.status"
                class="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Pilih Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
                <option value="habis">Habis</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end mt-4 space-x-2">
        <button 
          type="button"
          @click="cancelForm"
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          Batal
        </button>
        <button 
          type="button"
          @click="saveVoucher"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Simpan Voucher
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  interface VoucherForm {
    idVoucher: string
    kodeVoucher: string
    nilaiVoucher: string
    persenVoucher: string
    tanggalBerlaku: string
    tanggalBerakhir: string
    jumlahVoucher: number
    voucherTerpakai: number
    status: string
  }
  
  const formData = ref<VoucherForm>({
    idVoucher: 'VCH' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    kodeVoucher: '',
    nilaiVoucher: '',
    persenVoucher: '',
    tanggalBerlaku: '',
    tanggalBerakhir: '',
    jumlahVoucher: 1,
    voucherTerpakai: 0,
    status: ''
  })
  
  const saveVoucher = async (): Promise<void> => {
    try {
      // Validate form
      if (!formData.value.kodeVoucher || !formData.value.tanggalBerlaku || 
          !formData.value.tanggalBerakhir || !formData.value.jumlahVoucher || 
          !formData.value.status) {
        alert('Harap isi semua field yang wajib diisi!')
        return
      }
  
      // Logic to save voucher
      console.log('Menyimpan voucher:', formData.value)
      
      // Redirect after save
      router.push('/admin/voucher')
    } catch (error) {
      console.error('Gagal menyimpan voucher:', error)
      alert('Terjadi kesalahan saat menyimpan voucher')
    }
  }
  
  const cancelForm = (): void => {
    if (confirm('Apakah Anda yakin ingin membatalkan? Perubahan tidak akan disimpan.')) {
      router.push('/admin/voucher')
    }
  }
  </script>
  
  <style scoped>
  /* Optional: Add custom styles here */
  </style>