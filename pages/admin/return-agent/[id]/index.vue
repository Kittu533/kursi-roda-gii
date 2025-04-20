<template>
    <DetailView
      title="Pengembalian - Detail"
      card-title="Data Pengembalian"
      :breadcrumbs="breadcrumbs"
      :fields="fields"
      :data="returnItem"
      :loading="isLoading"
      :error="error"
      @back="router.push('/admin/return-agent')"
    />
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useReturnItemStore } from '~/store/return-agent'
  import DetailView from '~/components/detail-view.vue'
  // Router
  const route = useRoute()
  const router = useRouter()
  const returnId = computed(() => route.params.id as string)
  
  // Store
  const returnStore = useReturnItemStore()
  const returnItem = computed(() => returnStore.selectedReturn)
  const isLoading = computed(() => returnStore.isLoading)
  const error = computed(() => returnStore.error)
  
  // Breadcrumbs
  const breadcrumbs = [
    { text: 'Pengembalian', to: '/admin/return' },
    { text: 'Detail' }
  ]
  
  // Fields configuration
  const fields = [
    { key: 'idPengembalian', label: 'ID Pengembalian' },
    { key: 'idTransaksi', label: 'ID Transaksi' },
    { key: 'jenisKerusakan', label: 'Jenis Kerusakan' },
    { 
      key: 'biayaTambahan', 
      label: 'Biaya Tambahan',
      formatter: (value: number) => `Rp${value.toLocaleString('id-ID')}`
    },
    { key: 'catatan', label: 'Catatan' },
    { key: 'tanggalPengembalian', label: 'Tanggal Pengembalian' },
    { 
      key: 'bukti', 
      label: 'Bukti',
      type: 'image',
      formatter: (value: string) => value ? 'Lihat Foto' : 'Tidak ada bukti'
    },
    { 
      key: 'status', 
      label: 'Status',
      type: 'status',
    }
  ]
  
  
  // Lifecycle
  const loaded = ref(false)
  
  onMounted(async () => {
    if (!loaded.value && returnId.value) {
      loaded.value = true
      try {
        await returnStore.loadReturnDetails(returnId.value)
      } catch (error) {
        console.error('Error loading return details:', error)
      }
    }
  })
  </script>