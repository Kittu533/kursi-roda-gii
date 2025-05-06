<template>
  <DetailView
    title="Produk - Detail"
    card-title="Data Produk"
    :breadcrumbs="breadcrumbs"
    :fields="fields"
    :data="product"
    :loading="isLoading"
    :error="error"
    @back="router.push('/admin/product')"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '~/store/product'
import DetailView from '~/components/detail-view.vue'

// Router
const route = useRoute()
const router = useRouter()
const productId = computed(() => route.params.id as string)

// Store
const productStore = useProductStore()
const product = computed(() => productStore.selectedProduct)
const isLoading = computed(() => productStore.isLoading)
const error = computed(() => productStore.error)

// Breadcrumbs
const breadcrumbs = [
  { text: 'Produk', to: '/admin/product' },
  { text: 'Detail' }
]

// Fields configuration
const fields = [
  { key: 'id', label: 'ID Produk' },
  { key: 'agentId', label: 'ID Agent' },
  { key: 'serialNumber', label: 'Nomor Seri' },
  { key: 'productName', label: 'Nama Produk' },
  { key: 'photo', label: 'Foto', type: 'image' },
  { key: 'model', label: 'Model' },
  { key: 'status', label: 'Status', type: 'status' },
  {key:'Tanggal Pemeliharaan',label:'Tanggal Pemeliharaan'}
]

// Lifecycle
const loaded = ref(false)

onMounted(async () => {
  if (!loaded.value && productId.value) {
    loaded.value = true
    try {
      await productStore.loadProductDetails(productId.value)
    } catch (error) {
      console.error('Error loading product details:', error)
    }
  }
})
</script>