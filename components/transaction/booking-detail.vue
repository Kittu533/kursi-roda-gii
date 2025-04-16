<template>
  <DetailView
    title="Transaksi - detail pemesanan"
    card-title="Data Transaksi"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="booking"
    :loading="isLoading"
    :error="error"
    @back="goBack"
    @save="goToEdit"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '~/store/booking'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const bookingId = computed(() => route.params.id as string)

// Store
const bookingStore = useBookingStore()
const booking = computed(() => bookingStore.selectedBooking)
const isLoading = computed(() => bookingStore.isLoading)
const error = computed(() => bookingStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Transaksi', to: '/admin/transaction/booking' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Transaksi' },
  { key: 'voucherId', label: 'ID Voucher' },
  { key: 'amount', label: 'Jumlah', type: 'currency' },
  { key: 'paymentMethod', label: 'Metode Pembayaran' },
  { key: 'detail', label: 'Detail', formatter: () => 'Pembayaran Berhasil' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'createdAt', label: 'Tanggal Di buat' },
  { key: 'updatedAt', label: 'Terakhir Diperbaharui' }
]

// Methods
const goBack = () => {
  router.push('/admin/transaction/booking')
}

const goToEdit = () => {
  if (booking.value?.id) {
    router.push(`/admin/transaction/booking/${booking.value.id}/edit`)
  }
}

// Lifecycle
onMounted(async () => {
  if (bookingId.value) {
    try {
      await bookingStore.loadBookingDetails(bookingId.value)
    } catch (error) {
      console.error('Error loading booking details:', error)
    }
  }
})
</script>