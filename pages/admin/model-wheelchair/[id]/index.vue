<template>
  <div class="space-y-6">
    <!-- Detail Model Kursi Roda -->
    <DetailView
      title="Model Kursi Roda - Detail"
      card-title="Data Model Kursi Roda"
      :breadcrumbs="breadcrumbs"
      :fields="fields"
      :data="model"
      :loading="isLoading"
      :error="error"
      back-button-text="Kembali"
      save-button-text="Edit"
      @back="router.push('/admin/model-wheelchair')"
      @save="router.push(`/admin/model-wheelchair/${model?.id}/edit`)"
    />

    <!-- Tabel Produk -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Produk</h2>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/product/create"
            class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          >
            <span>Tambah</span>
          </NuxtLink>
          <ExportDropdown
            :data="exportData"
            :columns="exportColumns"
            title="Data Produk"
            filename="produk"
          />
          <button
            class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
            @click="showFilter = !showFilter"
          >
            <span>Filter</span>
          </button>
        </div>
      </div>

      <DataTableFilter
        v-if="showFilter"
        :filter="filter"
        :fields="filterFields"
        @apply="applyFilter"
        @reset="resetFilter"
      />

      <data-table
        title="Data Produk"
        :headers="columns"
        :items="products"
        :pagination="enhancedPagination"
        :is-loading="isLoading"
        :show-export="true"
        :export-columns="exportColumns"
        :export-data="exportData"
        export-filename="produk"
        :rows-per-page-options="[5, 10, 20, 50]"
        :default-rows-per-page="itemsPerPage"
        @action="handleAction"
        @page-change="handlePageChange"
        @rows-per-page-change="handleRowsPerPageChange"
        @delete="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModelStore } from '~/store/model'
import { useWheelchairStore } from '~/store/wheelchair'
import DetailView from '~/components/detail-view.vue'
import ExportDropdown from '~/components/export-to.vue'
import DataTableFilter from '~/components/data-table-filter.vue'
import type { TableHeader, ExportColumn, TablePagination, TableItem } from '~/components/data-table.vue'
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

const fields = [
  { key: 'id', label: 'ID Model' },
  { key: 'name', label: 'Nama Model' },
  { key: 'model', label: 'Kode Model' },
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

const showFilter = ref(false)
const itemsPerPage = ref(10)
const selectedWheelchair = ref<Wheelchair | null>(null)

onMounted(async () => {
  if (modelId.value) {
    await modelStore.getModelDetail(modelId.value)
    await wheelchairStore.setFilter({ model_id: modelId.value, page: 1, itemsPerPage: itemsPerPage.value })
  }
})

const filter = computed(() => wheelchairStore.filter)
const products = computed<TableItem[]>(() =>
  wheelchairStore.wheelchairs.map((w) => ({
    id: w.id,
    modelId: w.model_id,
    serialNumber: w.serial_number,
    productName: w.model.name,
    tanggalPemeliharaan: '-', // isi jika ada
    status: capitalize(w.wheelchair_status?.status ?? '')
  }))
)

const pagination = computed(() => wheelchairStore.pagination)
const enhancedPagination = computed<TablePagination>(() => ({
  ...pagination.value,
  itemsPerPage: itemsPerPage.value
}))

const columns: TableHeader[] = [
  { key: 'id', label: 'ID Kursi Roda' },
  { key: 'modelId', label: 'ID Model' },
  { key: 'serialNumber', label: 'Nomor Seri' },
  { key: 'productName', label: 'Nama Produk' },
  { key: 'tanggalPemeliharaan', label: 'Tanggal Pemeliharaan' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi' }
]

const exportColumns = computed<ExportColumn[]>(() => [
  { key: 'id', header: 'ID Kursi Roda' },
  { key: 'modelId', header: 'ID Model' },
  { key: 'serialNumber', header: 'Nomor Seri' },
  { key: 'productName', header: 'Nama Produk' },
  { key: 'tanggalPemeliharaan', header: 'Tanggal Pemeliharaan' }
])

const exportData = computed(() => products.value)

const filterFields = [
  { key: 'serialNumber', label: 'Nomor Seri', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['available', 'broken', 'used', 'maintenance']
  }
]

const applyFilter = (newFilter: Partial<Record<string, any>>) => {
  wheelchairStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value
  })
}

const resetFilter = () => {
  wheelchairStore.resetFilter()
  showFilter.value = false
}

const handlePageChange = (page: number) => {
  wheelchairStore.setFilter({ ...filter.value, page })
}

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size
  wheelchairStore.setFilter({ ...filter.value, page: 1, itemsPerPage: size })
}

const handleAction = ({ type, row }: { type: string; row: Wheelchair }) => {
  switch (type) {
    case 'view':
      router.push(`/admin/product/${row.id}`)
      break
    case 'edit':
      router.push(`/admin/product/${row.id}/edit`)
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
  }
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
</script>
