<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold tracking-tight">Voucher</h2>

      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/voucher/create"
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
          <span>Tambah</span>
          <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </NuxtLink>

        <ExportDropdown :data="exportData" :columns="exportColumns" title="Data Voucher" filename="voucher" />

        <button
          class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter">
          <NuxtIcon name="material-symbols:filter-list-rounded" class="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <VoucherFilter v-if="showFilter" :filter="filter" @apply="applyFilter" @reset="resetFilter"
      @close="showFilter = false" />

    <data-table title="Data Voucher" :headers="columns" :items="vouchers" :pagination="enhancedPagination"
      :is-loading="isLoading" :show-export="true" :export-columns="exportColumns" :export-data="exportData"
      export-filename="voucher" :rows-per-page-options="[5, 10, 20, 50, 100]" :default-rows-per-page="itemsPerPage"
      @action="handleAction" @page-change="handlePageChange" @rows-per-page-change="handleRowsPerPageChange" />

    <ConfirmationModal v-model:isOpen="isDeleteModalOpen" type="delete"
      :message="`Apakah anda yakin ingin menghapus voucher ${selectedVoucher?.kodeVoucher || ''}?`"
      @confirm="confirmDelete" @cancel="isDeleteModalOpen = false" />

    <ConfirmationModal v-model:isOpen="isSuccessModalOpen" type="success" message="Data voucher berhasil dihapus"
      :showButtons="false" @cancel="isSuccessModalOpen = false" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVoucherStore } from '~/store/voucher'
import type { Voucher } from '~/types/voucher'
import VoucherFilter from '~/components/voucher/voucher-filter.vue'
import ExportDropdown from '~/components/export-to.vue'
import ConfirmationModal from '~/components/ui/modals/confirmation-modal.vue'
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from '~/components/data-table.vue'

const router = useRouter()
const voucherStore = useVoucherStore()

// State
const showFilter = ref(false)
const isDeleteModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const selectedVoucher = ref<any>(null)
const itemsPerPage = ref(10)

// Computed
const filter = computed(() => voucherStore.filter)
const pagination = computed(() => voucherStore.pagination)
const isLoading = computed(() => voucherStore.isLoading)

const formatDate = (date: string): string => {
  if (!date) return "-"
  const d = new Date(date)
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const formatCurrency = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return "-"
  const num = typeof value === "string" ? parseFloat(value) : value
  return `Rp${num.toLocaleString("id-ID")}`
}

const formatPercentage = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value
  return `${num * 100}%`
}

const vouchers = computed<TableItem[]>(() =>
  voucherStore.vouchers.map((v: Voucher) => ({
    idVoucher: v.id,
    kodeVoucher: v.voucher_code,
    nilaiVoucher: formatCurrency(parseFloat(v.discount_percentage) * 100000), // bisa disesuaikan logika hitungnya
    persenVoucher: formatPercentage(v.discount_percentage),
    tanggalBerlaku: formatDate(v.start_date),
    tanggalBerakhir: formatDate(v.end_date),
  }))
)

const enhancedPagination = computed<TablePagination>(() => {
  const pag = pagination.value
  return {
    currentPage: pag?.page || 1,
    totalPages: pag?.totalPages || 1,
    totalItems: pag?.totalItems || vouchers.value.length,
    itemsPerPage: itemsPerPage.value,
  }
})

// Table config
const columns: TableHeader[] = [
  { key: "idVoucher", label: "ID Voucher" },
  { key: "kodeVoucher", label: "Kode Voucher" },
  { key: "nilaiVoucher", label: "Nilai Voucher" },
  { key: "persenVoucher", label: "Persen Voucher" },
  { key: "tanggalBerlaku", label: "Tanggal Berlaku" },
  { key: "tanggalBerakhir", label: "Tanggal Berakhir" },
  { key: "actions", label: "Aksi" },
]

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "idVoucher", header: "ID Voucher" },
  { key: "kodeVoucher", header: "Kode Voucher" },
  { key: "nilaiVoucher", header: "Nilai Voucher" },
  { key: "persenVoucher", header: "Persen Voucher" },
  { key: "tanggalBerlaku", header: "Tanggal Berlaku" },
  { key: "tanggalBerakhir", header: "Tanggal Berakhir" },
])

const exportData = computed(() => vouchers.value)

// Event handlers
const handleAction = async ({ type, row }: { type: string; row: any }) => {
  const voucher = row
  switch (type) {
    case "view":
      await router.push(`/admin/voucher/${voucher.idVoucher}`)
      break
    case "edit":
      await router.push(`/admin/voucher/${voucher.idVoucher}/edit`)
      break
    case "delete":
      selectedVoucher.value = voucher
      isDeleteModalOpen.value = true
      break
  }
}

const applyFilter = (newFilter: Partial<any>) => {
  voucherStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  })
}

const resetFilter = () => {
  voucherStore.resetFilter()
  voucherStore.setFilter({ itemsPerPage: itemsPerPage.value })
  showFilter.value = false
}

const handlePageChange = (page: number) => {
  voucherStore.setFilter({ ...filter.value, page })
}

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size
  voucherStore.setFilter({ ...filter.value, page: 1, itemsPerPage: size })
}

const confirmDelete = async () => {
  if (selectedVoucher.value) {
    try {
      await voucherStore.deleteVoucher(selectedVoucher.value.idVoucher)
      isDeleteModalOpen.value = false
      isSuccessModalOpen.value = true
      setTimeout(() => {
        isSuccessModalOpen.value = false
      }, 2000)
    } catch (error) {
      console.error("Error deleting voucher:", error)
      isDeleteModalOpen.value = false
    }
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await voucherStore.loadVouchers()
  } catch (error) {
    console.error("Error loading vouchers:", error)
  }
})
</script>
