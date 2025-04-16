<template>
    <div class="p-4">
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm mb-4">
        <NuxtLink to="/admin/package" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <span>Package</span>
      </div>
  
      <!-- Form Container -->
      <h1 class="text-xl font-bold mb-4">Data Package Baru</h1>
      
      <div class="bg-white rounded-md p-4">
        <div class="space-y-4">
          <!-- Nama -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Nama</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.name" 
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Masukkan nama package"
              />
            </div>
          </div>
          
          <!-- ID Package -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">ID Package</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.packageId" 
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Masukkan ID package"
              />
            </div>
          </div>
          
          <!-- ID Voucher -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">ID Voucher</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.voucherId" 
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Masukkan ID voucher"
              />
            </div>
          </div>
          
          <!-- Harga -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Harga</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="text" 
                v-model="formData.price" 
                class="w-full border rounded-md px-3 py-2" 
                placeholder="Masukkan harga package"
              />
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
                <option value="Active">Aktif</option>
                <option value="Inactive">Nonaktif</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          
          <!-- Tanggal Dibuat -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Tanggal Dibuat</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="date" 
                v-model="formData.creationDate" 
                class="w-full border rounded-md px-3 py-2" 
              />
            </div>
          </div>
          
          <!-- Tanggal Diperbarui -->
          <div class="flex items-center">
            <div class="w-1/4">
              <label class="text-sm">Tanggal Diperbarui</label>
            </div>
            <div class="w-3/4 flex">
              <input 
                type="date" 
                v-model="formData.updateDate" 
                class="w-full border rounded-md px-3 py-2" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Button -->
      <div class="flex justify-end mt-4">
        <button 
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          @click="savePackage"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
  
      <!-- Confirmation Modal -->
      <ConfirmationModal
        v-model:isOpen="isSuccessModalOpen"
        type="success"
        message="Package berhasil dibuat"
        :showButtons="false"
        @cancel="handleSuccessClose"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { usePackageStore } from '~/store/package'
  import type { Package } from '~/types/package'
  import ConfirmationModal from '~/components/ui/modals/confirmation-modal.vue'
  
  interface PackageForm {
    name: string
    packageId: string
    voucherId: string
    price: string
    status: 'Active' | 'Inactive' | 'Pending' | ''
    creationDate: string
    updateDate: string
  }
  
  // Router and store
  const router = useRouter()
  const packageStore = usePackageStore()
  
  // State
  const isSubmitting = ref(false)
  const isSuccessModalOpen = ref(false)
  
  // Get current date for default values
  const today = new Date().toISOString().split('T')[0]
  
  // Form data
  const formData = ref<PackageForm>({
    name: '',
    packageId: '',
    voucherId: '',
    price: '',
    status: '',
    creationDate: today,
    updateDate: today
  })
  
  // Save package
  const savePackage = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }
  
    isSubmitting.value = true
    
    try {
      // Convert form data to package data
      const packageData: Omit<Package, 'id'> = {
        name: formData.value.name,
        packageId: formData.value.packageId,
        voucherId: formData.value.voucherId,
        price: formData.value.price,
        status: formData.value.status as 'Active' | 'Inactive' | 'Pending',
        creationDate: formData.value.creationDate,
        updateDate: formData.value.updateDate
      }
      
      await packageStore.createPackage(packageData)
      isSuccessModalOpen.value = true
    } catch (error) {
      console.error('Error creating package:', error)
    } finally {
      isSubmitting.value = false
    }
  }
  
  // Form validation
  const validateForm = (): boolean => {
    // Simple validation
    if (!formData.value.name) {
      alert('Nama package tidak boleh kosong')
      return false
    }
    
    if (!formData.value.packageId) {
      alert('ID package tidak boleh kosong')
      return false
    }
    
    if (!formData.value.voucherId) {
      alert('ID voucher tidak boleh kosong')
      return false
    }
    
    if (!formData.value.price) {
      alert('Harga tidak boleh kosong')
      return false
    }
    
    if (!formData.value.status) {
      alert('Status tidak boleh kosong')
      return false
    }
    
    return true
  }
  
  // Handle success modal close
  const handleSuccessClose = () => {
    isSuccessModalOpen.value = false
    router.push('/admin/package')
  }
  </script>