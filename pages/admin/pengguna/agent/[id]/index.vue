<template>
  <DetailView title="Agen - Detail" card-title="Data Agen" :breadcrumbs="breadcrumbs" :fields="fields"
    :data="formattedAgent" :loading="isLoading" :error="error" back-button-text="Kembali" save-button-text="Edit"
    @back="router.push('/admin/pengguna/agent')" @save="router.push(`/admin/pengguna/agent/${agent?.id}/edit`)">
    <!-- Foto Profil -->
    <template #field-photo="{ data }">
      <img :src="data.photo || '/default-avatar.png'" alt="Foto Agen"
        class="w-24 h-24 rounded-full object-cover border" />
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

// Format status
const formatStatus = (statusCode: string | undefined): string => {
  switch (statusCode?.toUpperCase()) {
    case 'ACT':
      return 'Aktif'
    case 'NON':
    case 'INC':
      return 'Tidak Aktif'
    case 'DEL':
    case 'HAPUS':
      return 'Hapus'
    default:
      return '-'
  }
}

// Data untuk field binding
const formattedAgent = computed(() => {
  if (!agent.value) return {}
  return {
    // id: agent.value.id, // HAPUS
    name: agent.value.full_name,
    photo: agent.value.photo_profile ?? '/default-avatar.png',
    email: agent.value.email,
    phone: agent.value.phone,
    username: agent.value.username,
    location: agent.value.location,
    openHour: agent.value.open_time?.slice(0, 5),
    closeHour: agent.value.close_time?.slice(0, 5),
    status: formatStatus(agent.value.status?.status),
    boundingbox: Array.isArray(agent.value.boundingbox)
      ? agent.value.boundingbox.join(', ')
      : '-' // Atau tampilkan array lain sesuai format
  }
})

// Fields configuration
const fields = [
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'photo', label: 'Foto Profil' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Nomor Telepon' },
  { key: 'username', label: 'Username' },
  { key: 'location', label: 'Lokasi' },
  { key: 'latitude', label: 'Latitude' },       // Tampilkan ini
  { key: 'longitude', label: 'Longitude' },     // Tampilkan ini
  { key: 'openHour', label: 'Jam Buka' },
  { key: 'closeHour', label: 'Jam Tutup' },
  { key: 'status', label: 'Status', type: 'status' }
]

// Lifecycle
const loaded = ref(false)

onMounted(async () => {
  if (agentId.value) {
    try {
      await agentStore.getAgentDetail(agentId.value)
    } catch (error) {
      console.error('Error loading agent details:', error)
    } finally {
      loaded.value = true
    }
  }
})
</script>
