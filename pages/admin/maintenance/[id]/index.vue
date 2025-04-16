<template>
  <DetailView 
    title="Maintenance - Detail"
    card-title="Data Maintenance"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="maintenanceData"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/maintenances')"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '~/store/maintenance'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const maintenanceId = computed(() => route.params.id as string)

// Store
const maintenanceStore = useMaintenanceStore()
const maintenanceData = computed(() => maintenanceStore.selectedMaintenance)
const isLoading = computed(() => maintenanceStore.isLoading)
const error = computed(() => maintenanceStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Maintenance', to: '/admin/maintenances' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'maintenanceId', label: 'ID Maintenance' },
  { key: 'productId', label: 'ID Produk' },
  { key: 'date', label: 'Tanggal', type: 'date' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'photoUrl', label: 'Foto', type: 'image' },
  { key: 'status', label: 'Status' },
]

// Lifecycle
const loaded = ref(false)

onMounted(async () => {
  if (!loaded.value && maintenanceId.value) {
    loaded.value = true
    try {
      await maintenanceStore.loadMaintenanceDetails(maintenanceId.value)
    } catch (error) {
      console.error('Error loading maintenance details:', error)
    }
  }
})
</script>