<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Agen - Detail</h2>
        </div>
      </div>
  
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm">
        <NuxtLink to="/" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <NuxtLink to="/admin/pengguna/agent" class="text-muted-foreground hover:text-foreground">
          Pengguna
        </NuxtLink>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
        <NuxtLink to="/admin/pengguna/agent" class="text-muted-foreground hover:text-foreground">
          Agen
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
  
      <!-- Agent Data Card -->
      <div v-else-if="agent" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Data Agen</h3>
        </div>
        <div class="p-4">
          <div class="flex items-center gap-4 mb-6">
            <img :src="agent.photo" alt="Profile" class="w-20 h-20 rounded-full object-cover border" />
            <div>
              <h3 class="text-xl font-medium">{{ agent.name }}</h3>
              <p class="text-gray-500">{{ agent.id }}</p>
            </div>
          </div>
          
          <div class="rounded-md border"> 
            <table class="w-full">
              <tbody>
                <!-- ID Agen -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    ID Agen
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.id }}
                  </td>
                </tr>
                
                <!-- Nama Lengkap -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Nama Lengkap
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.name }}
                  </td>
                </tr>
                
                <!-- Email -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Email
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.email }}
                  </td>
                </tr>
                
                <!-- Nomor Telepon -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Nomor Telepon
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.phone }}
                  </td>
                </tr>
                
                <!-- Username -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Username
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.username }}
                  </td>
                </tr>
                
                <!-- Kata Sandi -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Kata Sandi
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.password }}
                  </td>
                </tr>
                
                <!-- Lokasi -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Lokasi
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.location }}
                  </td>
                </tr>
                
                <!-- Jam Buka -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Jam Buka
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.openHour }}
                  </td>
                </tr>
                
                <!-- Jam Tutup -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Jam Tutup
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.closeHour }}
                  </td>
                </tr>
                
                <!-- Latitude -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Latitude
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.latitude }}
                  </td>
                </tr>
                
                <!-- Longitude -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Longitude
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.longitude }}
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
                      :class="getStatusClass(agent.status)"
                    >
                      {{ formatStatus(agent.status) }}
                    </span>
                  </td>
                </tr>
                
                <!-- Akun Dibuat -->
                <tr class="border-b">
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Akun dibuat
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.createdAt }}
                  </td>
                </tr>
                
                <!-- Akun Diperbarui -->
                <tr>
                  <td class="w-1/3 px-4 py-3 font-medium text-gray-500 bg-gray-50">
                    Akun diperbarui
                  </td>
                  <td class="w-2/3 px-4 py-3">
                    {{ agent.updatedAt }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div v-if="agent" class="flex justify-end mt-6 gap-2">
        <button 
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          @click="router.push('/admin/pengguna/agent')"
        >
          Kembali
        </button>
        <button 
          class="bg-[#4072EE] text-white px-4 py-2 rounded-md hover:bg-[#3060DD]"
          @click="router.push(`/admin/pengguna/agent/${agent.id}/edit`)"
        >
          Edit
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAgentStore } from '~/store/agent'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const agentId = computed(() => route.params.id as string)
  
  // Store
  const agentStore = useAgentStore()
  const agent = computed(() => agentStore.selectedAgent)
  const isLoading = computed(() => agentStore.isLoading)
  const error = computed(() => agentStore.error)
  
  // Methods
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  const getStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      menunggu: 'bg-yellow-100 text-yellow-800',
      aktif: 'bg-green-100 text-green-800',
      dibatalkan: 'bg-red-100 text-red-800',
      nonaktif: 'bg-gray-100 text-gray-800'
    }
  
    return statusClasses[status] || ''
  }
  
  // Lifecycle
  onMounted(async () => {
    if (agentId.value) {
      try {
        await agentStore.loadAgentDetails(agentId.value)
      } catch (error) {
        console.error('Error loading agent details:', error)
      }
    }
  })
  </script>
  
  