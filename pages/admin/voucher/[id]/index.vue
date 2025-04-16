<template>
    <DetailView 
      title="Voucher - Detail"
      card-title="Data Voucher"
      :breadcrumbs="breadcrumbs"
      :fields="fields"
      :data="voucher"
      :loading="isLoading"
      :error="error"
      @back="router.push('/admin/voucher')"
    />
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useVoucherStore } from '~/store/voucher'
  import DetailView from '~/components/detail-view.vue'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const voucherId = computed(() => route.params.id as string)
  
  // Store
  const voucherStore = useVoucherStore()
  const voucher = computed(() => voucherStore.selectedVoucher)
  const isLoading = computed(() => voucherStore.isLoading)
  const error = computed(() => voucherStore.error)
  
  // Breadcrumbs
  const breadcrumbs = [
    { text: 'Voucher', to: '/admin/voucher' },
    { text: 'Detail' }
  ]
  
  // Fields configuration aligned with export columns
  const fields = [
    { key: 'idVoucher', label: 'ID Voucher' },
    { key: 'kodeVoucher', label: 'Kode Voucher' },
    { key: 'nilaiVoucher', label: 'Nilai Voucher' },
    { key: 'persenVoucher', label: 'Persen Voucher' },
    { key: 'tanggalBerlaku', label: 'Tanggal Berlaku' },
    { key: 'tanggalBerakhir', label: 'Tanggal Berakhir' },
    { key: 'jumlahVoucher', label: 'Jumlah Voucher' },
    { key: 'voucherTerpakai', label: 'Voucher Terpakai' },
    { key: 'status', label: 'Status', type: 'status' },

]
  
  // Lifecycle
  const loaded = ref(false)
  
  onMounted(async () => {
    if (!loaded.value && voucherId.value) {
      loaded.value = true
      try {
        await voucherStore.loadVoucherDetails(voucherId.value)
      } catch (error) {
        console.error('Error loading voucher details:', error)
      }
    }
  })
  </script>