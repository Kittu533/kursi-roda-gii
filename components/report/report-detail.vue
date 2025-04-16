<template>
  <DetailView
    title="Data Laporan"
    card-title="Data Laporan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="report"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/report')"
    @save="router.push(`/admin/report/${report?.id}/edit`)"
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
const reportId = ref(route.params.id as string)

// Store
const reportStore = useReportStore()
const report = computed(() => reportStore.selectedReport)
const isLoading = computed(() => reportStore.isLoading)
const error = computed(() => reportStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Laporan', to: '/admin/report' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Laporan' },
  { key: 'agentId', label: 'ID Agen' },
  { key: 'reportDate', label: 'Tanggal Laporan' },
  { key: 'totalTersedia', label: 'Total Tersedia' },
  { key: 'totalTersewa', label: 'Total Tersewa' },
  { key: 'totalKerusakan', label: 'Total Kerusakan' },
  { key: 'jumlahPerawatan', label: 'Jumlah Perawatan' },
  { key: 'totalPendapatan', label: 'Total Pendapatan', type: 'currency' },
  { key: 'totalPengembalian', label: 'Total Pengembalian', type: 'currency' },
  { key: 'totalTransaksi', label: 'Total Transaksi' },
  { key: 'pembayaranMenunggu', label: 'Pembayaran Menunggu' },
  { key: 'catatanTambahan', label: 'Catatan Tambahan', formatter: (value) => value || '-' },
  { key: 'tanggalDibuat', label: 'Tanggal Dibuat' },
  { key: 'terakhirDiperbarui', label: 'Terakhir Diperbarui' }
]

// Lifecycle
onMounted(async () => {
  try {
    await reportStore.loadReportDetails(reportId.value)
  } catch (error) {
    console.error('Error loading report details:', error)
  }
})
</script>