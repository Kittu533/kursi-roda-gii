<template>
  <DetailView 
    title="Laporan Admin - Detail"
    card-title="Data Laporan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="reportData"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/report')"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReportStore } from '~/store/report'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const reportId = computed(() => route.params.id as string)

// Store
const reportStore = useReportStore()
const reportData = computed(() => reportStore.selectedReport)
const isLoading = computed(() => reportStore.isLoading)
const error = computed(() => reportStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Laporan Admin', to: '/admin/report' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Laporan' },
  { key: 'agent.full_name', label: 'Nama Agen' },
  { key: 'agent.email', label: 'Email' },
  { key: 'agent.phone', label: 'Telepon' },
  { key: 'agent.location', label: 'Lokasi' },
  { key: 'report_date', label: 'Tanggal Laporan', format: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
  { key: 'created_at', label: 'Dibuat Pada', format: (v) => v ? new Date(v).toLocaleString('id-ID') : '-' },
  { key: 'updated_at', label: 'Update Terakhir', format: (v) => v ? new Date(v).toLocaleString('id-ID') : '-' },
  // Tambah field lain jika ada di response, misal status, catatan, dsb
]

const loaded = ref(false)

onMounted(async () => {
  if (!loaded.value && reportId.value) {
    loaded.value = true
    try {
      await reportStore.getReportDetail(reportId.value)
    } catch (error) {
      console.error('Error loading report details:', error)
    }
  }
})
</script>
