<template>
  <DetailView 
    title="Voucher - Detail"
    card-title="Data Voucher"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="formattedVoucher"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/voucher')"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoucherStore } from '~/store/voucher'
import type { Voucher } from '~/types/voucher'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const voucherId = computed(() => route.params.id as string)

// Store
const voucherStore = useVoucherStore()
const isLoading = computed(() => voucherStore.isLoading)
const error = computed(() => voucherStore.error)
const voucher = computed(() => voucherStore.selectedVoucher)

// Format helper
const formatDateLong = (date: string): string => {
  if (!date) return "-"
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatPercentage = (value: string | number | null | undefined): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!num || isNaN(num)) return '-'
  return `${num * 100}%`
}

const formatCurrency = (value: string | number | null | undefined): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!num || isNaN(num)) return '-'
  return `Rp${num.toLocaleString('id-ID')}`
}

// Mapping voucher ke field detail
const formattedVoucher = computed(() => {
  const v = voucher.value
  if (!v) return {}

  return {
  
    idVoucher: v.id,
    kodeVoucher: v.voucher_code,
    nilaiVoucher: formatCurrency(parseFloat(v.discount_percentage) * 100000), // bisa disesuaikan logika hitungnya
    persenVoucher: formatPercentage(v.discount_percentage),
    tanggalBerlaku: formatDate(v.start_date),
    tanggalBerakhir: formatDate(v.end_date),
  }
})

// Breadcrumbs
const breadcrumbs = [
  { text: 'Voucher', to: '/admin/voucher' },
  { text: 'Detail' }
]

// Field konfigurasi untuk <DetailView>
const fields = [
  { key: 'idVoucher', label: 'ID Voucher' },
  { key: 'kodeVoucher', label: 'Kode Voucher' },
  { key: 'nilaiVoucher', label: 'Nilai Voucher' },
  { key: 'persenVoucher', label: 'Persen Voucher' },
  { key: 'tanggalBerlaku', label: 'Tanggal Berlaku' },
  { key: 'tanggalBerakhir', label: 'Tanggal Berakhir' },
]

// Lifecycle
const loaded = ref(false)

onMounted(async () => {
  if (!loaded.value && voucherId.value) {
    loaded.value = true
    try {
      await voucherStore.getVoucherDetail(voucherId.value)
    } catch (err) {
      console.error('Error loading voucher details:', err)
    }
  }
})
</script>
