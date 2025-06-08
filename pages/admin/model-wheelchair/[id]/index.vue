<template>
  <div class="space-y-6">
    <!-- Detail Model Kursi Roda -->
    <DetailView title="Model Kursi Roda - Detail" card-title="Data Model Kursi Roda" :breadcrumbs="breadcrumbs"
      :fields="fields" :data="model" :loading="isLoading" :error="error" back-button-text="Kembali"
      save-button-text="Edit" @back="router.push('/admin/model-wheelchair')"
      @save="router.push(`/admin/model-wheelchair/${model?.id}/edit`)" />

    <!-- Tabel Kursi Roda -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Daftar Kursi Roda</h2>
        <div class="flex items-center gap-2">
          <NuxtLink :to="`/admin/model-wheelchair/${modelId}/product/create`"
            class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
            <span>Tambah</span>
          </NuxtLink>
        </div>
      </div>

      <data-table title="Data Kursi Roda" :headers="columns" :items="products" :pagination="enhancedPagination"
        :is-loading="isLoading" :rows-per-page-options="[5, 10, 20, 50]" :default-rows-per-page="itemsPerPage"
        @action="handleAction" @page-change="handlePageChange" @rows-per-page-change="handleRowsPerPageChange"
        @delete="confirmDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModelStore } from '~/store/model'
import { useWheelchairStore } from '~/store/wheelchair'
import DetailView from '~/components/detail-view.vue'
import type { TableHeader, TablePagination, TableItem } from '~/components/data-table.vue'
import type { Wheelchair } from '~/types/wheelchair'

const route = useRoute()
const router = useRouter()
const modelStore = useModelStore()
const wheelchairStore = useWheelchairStore()

const modelId = computed(() => route.params.id as string)

const isLoading = computed(() => modelStore.isLoading || wheelchairStore.isLoading)
const error = computed(() => modelStore.error)
const model = computed(() => modelStore.selectedModel)

const breadcrumbs = [
  { text: 'Kursi Roda', to: '/admin/model-wheelchair' },
  { text: 'Detail', active: true }
]
// Fields untuk detail model kursi roda
// Menyesuaikan dengan struktur data model yang ada
const fields = [
  { key: 'id', label: 'ID Model' },
  { key: 'model', label: 'Model' },
  { key: 'picture', label: 'Foto', type: 'image' },
  { key: 'stock', label: 'Stok Tersedia' },
  { key: 'price', label: 'Harga', type: 'currency' },
  { key: 'max_weight', label: 'Maks. Berat (kg)' },
  { key: 'battery_capacity', label: 'Kapasitas Baterai (mAh)' },
  {
    key: 'guide_compatible',
    label: 'Kompatibel Guide',
    type: 'status',
    format: (val: boolean) => (val ? 'Ya' : 'Tidak')
  }
]

const itemsPerPage = ref(10)
const selectedWheelchair = ref<Wheelchair | null>(null)
const pagination = computed(() => wheelchairStore.pagination || {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: itemsPerPage.value,
})

const enhancedPagination = computed<TablePagination>(() => ({
  ...pagination.value,
  itemsPerPage: itemsPerPage.value,
}))

// LOAD model detail & data kursi roda (filtered by model id)
onMounted(async () => {
  if (modelId.value && modelId.value !== 'undefined') {
    await modelStore.getModelDetail(modelId.value)
    wheelchairStore.setFilter({
      model_id: modelId.value,
      page: 1,
      itemsPerPage: itemsPerPage.value
    })
    await wheelchairStore.loadWheelchairs()
  } else {
    console.warn('ID model tidak ditemukan di route!')
    // router.push('/admin/model-wheelchair') // optional
  }
})

// Wheelchair table
const columns: TableHeader[] = [
  { key: 'name', label: 'Nama Kursi Roda' },
  { key: 'serialNumber', label: 'Nomor Seri' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi' }
]


const products = computed(() =>
  wheelchairStore.wheelchairs.map(w => ({
    id: w.id,
    name: w.name || '-',              // langsung ambil dari w.name
    serialNumber: w.serial_number || '-', // langsung ambil dari w.serial_number
    description: w.description || '-',
    status: capitalize(w.wheelchair_status?.status ?? ''),
  }))
)



const handlePageChange = (page: number) => {
  wheelchairStore.setFilter({
    ...wheelchairStore.filter,
    page
  })
}
const handleRowsPerPageChange = (size: number) => {
  wheelchairStore.setFilter({
    ...wheelchairStore.filter,
    page: 1,
    itemsPerPage: size
  })
}

const handleAction = ({ type, row }: { type: string; row: Wheelchair }) => {
  switch (type) {
    case 'view':
      router.push(`/admin/model-wheelchair/${modelId.value}/product/${row.id}`)
      break
    case 'edit':
      router.push(`/admin/model-wheelchair/${modelId.value}/product/${row.id}/edit`)
      break
    case 'delete':
      selectedWheelchair.value = row
      break
  }
}
const confirmDelete = async () => {
  if (selectedWheelchair.value) {
    await wheelchairStore.deleteWheelchair(selectedWheelchair.value.id)
    selectedWheelchair.value = null
    // reload daftar kursi roda
    await wheelchairStore.loadWheelchairs()
  }
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
</script>
