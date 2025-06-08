<template>
  <DetailView title="Voucher - Detail" card-title="Data Voucher" :breadcrumbs="breadcrumbs" :fields="fields"
    :data="formattedVoucher" :loading="isLoading" :error="error" back-button-text="Kembali" save-button-text="Edit"
    @back="router.push('/admin/voucher')" @save="router.push(`/admin/voucher/${voucherId}/edit`)">
    <!-- STATUS FIELD -->
    <template #field-status="{ data }">
  <span :class="statusColor(data['status'])">
    {{ statusLabel(data['status']) }}
  </span>
</template>
<template #field-discount_percentage="{ data }">
  <span>{{ formatPercentage(data['discount_percentage']) }}</span>
</template>
<template #field-start_date="{ data }">
  <span>{{ formatDate(data['start_date']) }}</span>
</template>
<template #field-end_date="{ data }">
  <span>{{ formatDate(data['end_date']) }}</span>
</template>
<template #field-max_discount="{ data }">
  <span>{{ formatRupiah(data['max_discount']) }}</span>
</template>
<template #field-min_order_amount="{ data }">
  <span>{{ formatRupiah(data['min_order_amount']) }}</span>
</template>

  </DetailView>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVoucherStore } from '~/store/voucher'
import { useVoucherStatusStore } from '~/store/voucher-status'
import DetailView from '~/components/detail-view.vue'

const route = useRoute()
const router = useRouter()
const voucherId = computed(() => route.params.id as string)
const voucherStore = useVoucherStore()
const voucherStatusStore = useVoucherStatusStore()
const voucher = computed(() => voucherStore.selectedVoucher)
const isLoading = computed(() => voucherStore.isLoading || voucherStatusStore.isLoading)
const error = computed(() => voucherStore.error || voucherStatusStore.error)

const breadcrumbs = [
  { text: 'Voucher', to: '/admin/voucher' },
  { text: 'Detail' }
]

const fields = [
  { key: 'voucher_code', label: 'Kode Voucher' },
  { key: 'discount_percentage', label: 'Diskon' },
  { key: 'max_discount', label: 'Maks. Diskon' },
  { key: 'min_order_amount', label: 'Min. Belanja' },
  { key: 'usage_limit', label: 'Batas Penggunaan' },
  { key: 'used_count', label: 'Telah Dipakai' },
  { key: 'start_date', label: 'Tanggal Berlaku' },
  { key: 'end_date', label: 'Tanggal Berakhir' },
  { key: 'status', label: 'Status' }
]

// Helper: Konversi UUID status jadi label
const statusLabel = (statusId: string) => {
  const found = voucherStatusStore.statuses.find(s => s.id === statusId)
  return found ? found.status.charAt(0).toUpperCase() + found.status.slice(1) : '-'
}
// Helper: Styling status
const statusColor = (statusId: string) => {
  const found = voucherStatusStore.statuses.find(s => s.id === statusId)
  if (!found) return 'bg-gray-200 text-gray-700'
  return found.status === 'active'
    ? 'bg-green-100 text-green-700'
    : 'bg-[#585B58] text-white'
}
// Helper: Format diskon persen
const formatPercentage = (value: number | string) => {
  if (!value) return '-'
  return (parseFloat(value as string) * 100).toFixed(0) + '%'
}
// Helper: Format rupiah
const formatRupiah = (angka: number | string) => {
  if (!angka) return '-'
  return 'Rp ' + Number(angka).toLocaleString('id-ID')
}
// Helper: Format tanggal
const formatDate = (tgl: string) => {
  if (!tgl) return '-'
  return new Date(tgl).toLocaleDateString('id-ID')
}

// Data detail voucher sudah dipetakan ke fields (biar ga error kalau null)
const formattedVoucher = computed(() => {
  if (!voucher.value) return {}
  return {
    voucher_code: voucher.value.voucher_code ?? '-',
    discount_percentage: voucher.value.discount_percentage ?? '-',
    max_discount: voucher.value.max_discount ?? '-',
    min_order_amount: voucher.value.min_order_amount ?? '-',
    usage_limit: voucher.value.usage_limit ?? '-',
    used_count: voucher.value.used_count ?? '-',
    start_date: voucher.value.start_date ?? '-',
    end_date: voucher.value.end_date ?? '-',
    status: voucher.value.vouchers_status_id ?? '-'
  }
})

onMounted(async () => {
  await voucherStatusStore.loadVoucherStatuses()
  if (voucherId.value) {
    await voucherStore.getVoucherDetail(voucherId.value)
  }
})
</script>
