<template>
    <DetailView 
      title="Paket - Detail"
      card-title="Data Paket"
      :breadcrumbs="breadcrumbs"
      :fields="fields"
      :data="packageData"
      :loading="isLoading"
      :error="error"
      @back="router.push('/admin/package')"
    />
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePackageStore } from '~/store/package'
  import DetailView from '~/components/detail-view.vue'
  
  // Router
  const route = useRoute()
  const router = useRouter()
  const packageId = computed(() => route.params.id as string)
  
  // Store
  const packageStore = usePackageStore()
  const packageData = computed(() => packageStore.selectedPackage)
  const isLoading = computed(() => packageStore.isLoading)
  const error = computed(() => packageStore.error)
  
  // Breadcrumbs
  const breadcrumbs = [
    { text: 'Paket', to: '/admin/packages' },
    { text: 'Detail' }
  ]
  
  // Fields configuration
  const fields = [
    { key: 'packageId', label: 'ID Paket' },
    { key: 'voucherId', label: 'ID Voucher' },
    { key: 'name', label: 'Nama Paket' },
    { key: 'price', label: 'Harga', type: 'currency' },
    { key: 'creationDate', label: 'Tanggal Dibuat', type: 'date' },
    { key: 'updateDate', label: 'Tanggal Diperbarui', type: 'date' },
  ]
  
  // Lifecycle
  const loaded = ref(false)
  
  onMounted(async () => {
    if (!loaded.value && packageId.value) {
      loaded.value = true
      try {
        await packageStore.loadPackageDetails(packageId.value)
      } catch (error) {
        console.error('Error loading package details:', error)
      }
    }
  })
  </script>