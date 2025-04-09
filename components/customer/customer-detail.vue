<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pelanggan - detail</h2>
      </div>
    </div>

    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm">
      <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </NuxtLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
      <NuxtLink to="/admin/pengguna" class="text-muted-foreground hover:text-foreground">
        Pengguna
      </NuxtLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
      <span>Pelanggan</span>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
      {{ error }}
    </div>

    <!-- Customer Data Card -->
    <div v-else-if="customer" class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Pelanggan</h3>
      </div>
      <div class="p-4">
        <div class="rounded-md border"> 
          <table class="w-full">
            <tbody>
              <!-- ID Pelanggan -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  ID Pelanggan
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.id }}
                </td>
              </tr>
              
              <!-- Nama Lengkap -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Nama Lengkap
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.name }}
                </td>
              </tr>
              
              <!-- Nomor Telepon -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Nomor Telepon
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.phone }}
                </td>
              </tr>
              
              <!-- Email -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Email
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.email }}
                </td>
              </tr>
              
              <!-- Gender -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Gender
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ formatGender(customer.gender) }}
                </td>
              </tr>
              
              <!-- Akun Dibuat -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Akun dibuat
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.registerDate }}
                </td>
              </tr>
              
              <!-- Akun Diperbarui -->
              <tr class="border-b">
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Akun diperbarui
                </td>
                <td class="w-2/3 px-4 py-3">
                  {{ customer.lastLogin }}
                </td>
              </tr>
              
              <!-- Status -->
              <tr>
                <td class="w-1/3 px-4 py-3 font-medium text-muted-foreground bg-muted/10">
                  Status
                </td>
                <td class="w-2/3 px-4 py-3">
                  <span :class="`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(customer.status)}`">
                    {{ formatStatus(customer.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="customer" class="flex justify-end mt-6">
      <button 
        class="bg-[#4072EE] text-white hover:bg-[#3060DD] px-4 py-2 rounded-md"
        @click="saveCustomer"
      >
        Simpan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '~/store/customer'
import { formatGender, formatStatus, getStatusClass } from '~/utils/formatters'

// Router
const route = useRoute()
const router = useRouter()
const customerId = computed(() => route.params.id as string)

// Store
const customerStore = useCustomerStore()
const customer = computed(() => customerStore.selectedCustomer)
const isLoading = computed(() => customerStore.isLoading)
const error = computed(() => customerStore.error)

// Methods
const saveCustomer = async () => {
  if (customer.value) {
    try {
      await customerStore.updateCustomer(customer.value.id, customer.value)
      await router.push('/admin/pengguna/pelanggan')
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  if (customerId.value) {
    try {
      await customerStore.loadCustomerDetails(customerId.value)
    } catch (error) {
      console.error('Error loading customer details:', error)
    }
  }
})
</script>

