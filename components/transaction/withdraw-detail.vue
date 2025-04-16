<template>
  <DetailView
    title="Transaksi - detail penarikan"
    card-title="Data Penarikan"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="withdraw"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/transaction/withdraw')"
    @save="router.push(`/admin/transaction/withdraw/${withdraw?.id}/edit`)"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWithdrawStore } from '~/store/withdraw'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const withdrawId = computed(() => route.params.id as string)

// Store
const withdrawStore = useWithdrawStore()
const withdraw = computed(() => withdrawStore.selectedWithdraw)
const isLoading = computed(() => withdrawStore.isLoading)
const error = computed(() => withdrawStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Transaksi', to: '/admin/transaction/withdraw' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Insentif' },
  { key: 'guideId', label: 'ID Guide' },
  { key: 'agentId', label: 'ID Agent' },
  { key: 'income', label: 'Jumlah Pendapatan', type: 'currency' },
  { key: 'paymentMethod', label: 'Metode Penarikan' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'withdrawDate', label: 'Tanggal Penarikan' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'createdAt', label: 'Tanggal Di buat' },
  { key: 'updatedAt', label: 'Terakhir Diperbaharui' }
]

// Lifecycle
onMounted(async () => {
  const id = withdrawId.value
  if (id) {
    try {
      await withdrawStore.loadWithdrawDetails(id)
    } catch (error) {
      console.error('Error loading withdraw details:', error)
    }
  }
})
</script>