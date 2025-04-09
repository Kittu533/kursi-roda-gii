<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">{{ isEditing ? 'Edit Agen' : 'Tambah Agen Baru' }}</h2>
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
      <form @submit.prevent="saveAgent" class="bg-white border rounded-md overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">{{ isEditing ? 'Data Agen' : 'Data Agen Baru' }}</h3>
        </div>
        <div class="p-4 space-y-4">
          <!-- ID Agen (read-only if editing) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="id" class="text-sm font-medium">ID Agen</label>
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
              <label for="name" class="text-sm font-medium">Nama Lengkap</label>
              <input
                id="name"
                type="text"
                v-model="formData.name"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Email and Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                v-model="formData.email"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium">Nomor Telepon</label>
              <input
                id="phone"
                type="tel"
                v-model="formData.phone"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Username and Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium">Username</label>
              <input
                id="username"
                type="text"
                v-model="formData.username"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Kata Sandi</label>
              <input
                id="password"
                type="text"
                v-model="formData.password"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Location -->
          <div class="space-y-2">
            <label for="location" class="text-sm font-medium">Lokasi</label>
            <select
              id="location"
              v-model="formData.location"
              class="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Pilih Lokasi</option>
              <option value="Makkah">Makkah</option>
              <option value="Madinah">Madinah</option>
            </select>
          </div>
          
          <!-- Opening Hours -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="openHour" class="text-sm font-medium">Jam Buka</label>
              <input
                id="openHour"
                type="time"
                v-model="formData.openHour"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="closeHour" class="text-sm font-medium">Jam Tutup</label>
              <input
                id="closeHour"
                type="time"
                v-model="formData.closeHour"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <!-- Coordinates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="latitude" class="text-sm font-medium">Latitude</label>
              <input
                id="latitude"
                type="text"
                v-model="formData.latitude"
                class="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="longitude" class="text-sm font-medium">Longitude</label>
              <input
                id="longitude"
                type="text"
                v-model="formData.longitude"
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
              <option value="menunggu">Menunggu</option>
              <option value="aktif">Aktif</option>
              <option value="dibatalkan">Dibatalkan</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="p-4 border-t flex justify-end gap-2">
          <button 
            type="button"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            @click="router.push('/admin/pengguna/agent')"
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
  import { useAgentStore } from '~/store/agent'
  import type { Agent } from '~/types/agent'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const agentId = computed(() => route.params.id as string)
  const isEditing = computed(() => agentId.value && agentId.value !== 'new')
  
  // Store
  const agentStore = useAgentStore()
  const isLoading = computed(() => agentStore.isLoading)
  const error = computed(() => agentStore.error)
  
  // Form data
  const formData = ref<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    location: '',
    openHour: '',
    closeHour: '',
    latitude: '',
    longitude: '',
    status: '',
    photo: '/placeholder.svg?height=32&width=32',
  })
  
  // Methods
  const saveAgent = async () => {
    try {
      if (isEditing.value) {
        await agentStore.updateAgent(agentId.value, formData.value)
      } else {
        await agentStore.createAgent(formData.value as Omit<Agent, 'id'>)
      }
      router.push('/admin/pengguna/agent')
    } catch (error) {
      console.error('Error saving agent:', error)
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    if (isEditing.value) {
      try {
        const agent = await agentStore.loadAgentDetails(agentId.value)
        if (agent) {
          formData.value = { ...agent }
        }
      } catch (error) {
        console.error('Error loading agent details:', error)
      }
    }
  })
  </script>
  
  