<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold tracking-tight">Laporan Admin</h2>
      <div class="flex items-center gap-2">
        <ExportDropdown :data="exportData" :columns="exportColumns" title="Laporan Admin" filename="laporan-admin" />
        <button class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter">
          <Filter class="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <DataTableFilter v-if="showFilter" :filter="filter" :fields="filterFields" @apply="applyFilter"
      @reset="resetFilter" />

    <data-table title="Laporan Admin" :headers="columns" :items="reports" :pagination="enhancedPagination"
      :is-loading="isLoading" :show-export="true" :export-columns="exportColumns" :export-data="exportData"
      export-filename="laporan-admin" :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
      :default-rows-per-page="itemsPerPage" @action="handleAction" @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '~/store/report'
import { Filter } from 'lucide-vue-next'
import ExportDropdown from '~/components/export-to.vue'
import DataTableFilter from '~/components/data-table-filter.vue'
import type { TableHeader, ExportColumn, TablePagination, TableItem } from '~/components/data-table.vue'

const router = useRouter()
const reportStore = useReportStore()

const showFilter = ref(false)
const itemsPerPage = ref(10)

const isLoading = computed(() => reportStore.isLoading)
const filter = computed(() => reportStore.filter)
const pagination = computed(() => reportStore.pagination)

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  await reportStore.loadReports()
}

const reports = computed<TableItem[]>(() =>
  reportStore.reports.map((r) => ({
    id: r.id,
    agent: r.agent.full_name,
    location: r.agent.location,
    reportDate: new Date(r.report_date).toLocaleDateString('id-ID'),
    email: r.agent.email,
    phone: r.agent.phone,
    createdAt: new Date(r.created_at).toLocaleString('id-ID'),
    updatedAt: new Date(r.updated_at).toLocaleString('id-ID'),
    actions: ''
  }))
)

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: reports.value.length,
      itemsPerPage: itemsPerPage.value,
    }
  }
  return {
    currentPage: pagination.value.currentPage,
    totalPages: pagination.value.totalPages,
    totalItems: pagination.value.total,
    itemsPerPage: pagination.value.itemsPerPage,
  }
})

const columns: TableHeader[] = [
  { key: 'agent', label: 'Nama Agen' },
  { key: 'location', label: 'Lokasi' },
  { key: 'reportDate', label: 'Tanggal Laporan' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telepon' },
  { key: 'createdAt', label: 'Dibuat Pada' },
  { key: 'updatedAt', label: 'Update Terakhir' },
  { key: 'actions', label: 'Aksi' }
]


const exportColumns = computed<ExportColumn[]>(() => [
  { key: 'id', header: 'ID Laporan' },
  { key: 'agent', header: 'Nama Agen' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'No. Telepon' },
  { key: 'location', header: 'Lokasi' },
  { key: 'reportDate', header: 'Tanggal Laporan' },
  { key: 'createdAt', header: 'Dibuat Pada' },
  { key: 'updatedAt', header: 'Update Terakhir' }
])

const exportData = computed(() => reports.value)

const applyFilter = (newFilter: any) => {
  reportStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  })
}

const resetFilter = () => {
  reportStore.resetFilter()
  reportStore.setFilter({ itemsPerPage: itemsPerPage.value })
  showFilter.value = false
}

const handlePageChange = (page: number) => {
  reportStore.setFilter({ ...filter.value, page })
}

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size
  reportStore.setFilter({ page: 1, itemsPerPage: size })
}

const handleAction = ({ type, row }: { type: string; row: any }) => {
  switch (type) {
    case 'view':
      router.push(`/admin/report/${row.id}`)
      break
    // tambah 'edit', 'delete' kalau endpoint-nya sudah ada
  }
}

const filterFields = [
  { key: 'reportDate', label: 'Tanggal Laporan', type: 'date' },
  { key: 'agent', label: 'Nama Agen', type: 'text' },
  { key: 'location', label: 'Lokasi', type: 'text' },
]
</script>
