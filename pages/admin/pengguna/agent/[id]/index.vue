<template>
  <DetailView
    title="Agen - Detail"
    card-title="Data Agen"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="agent"
    :loading="isLoading"
    :error="error"
    back-button-text="Kembali"
    save-button-text="Edit"
    @back="router.push('/admin/pengguna/agent')"
    @save="router.push(`/admin/pengguna/agent/${agent?.id}/edit`)"
  >
    <template #before-table v-if="agent">
      <div class="flex items-center gap-4 mb-6">
        <img 
          :src="agent.photo" 
          alt="Profile" 
          class="w-20 h-20 rounded-full object-cover border" 
        />
        <div>
          <h3 class="text-xl font-medium">{{ agent.name }}</h3>
          <p class="text-gray-500">{{ agent.id }}</p>
        </div>
      </div>
    </template>
  </DetailView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgentStore } from '~/store/agent'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const agentId = computed(() => route.params.id as string)

// Store
const agentStore = useAgentStore()
const agent = computed(() => agentStore.selectedAgent)
const isLoading = computed(() => agentStore.isLoading)
const error = computed(() => agentStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Pengguna', to: '/admin/pengguna/agent' },
  { text: 'Agen', to: '/admin/pengguna/agent' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Agen' },
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Nomor Telepon' },
  { key: 'username', label: 'Username' },
  { key: 'password', label: 'Kata Sandi' },
  { key: 'location', label: 'Lokasi' },
  { key: 'openHour', label: 'Jam Buka' },
  { key: 'closeHour', label: 'Jam Tutup' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'createdAt', label: 'Akun dibuat' },
  { key: 'updatedAt', label: 'Akun diperbarui' }
]

// Lifecycle
const loaded = ref(false)

onMounted(async () => {
  if (agentId.value) {
    try {
      await agentStore.loadAgentDetails(agentId.value)
    } catch (error) {
      console.error('Error loading agent details:', error)
    } finally {
      loaded.value = true
    }
  }
})
</script>