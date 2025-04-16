<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Voucher</h2>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/voucher/create')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>Tambah Voucher</span>
        </button>
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Voucher"
          filename="Voucher"
        />
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-filter"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filter</span>
      </button>
      </div>
    </div>

    <!-- Filter Panel -->
    <VoucherFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- View Toggle -->

    <!-- Data Table View -->
    <div v-if="viewMode === 'table'" class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Voucher</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="vouchers"
          :columns="columns"
          :loading="isLoading"
          @action="handleAction"
        />

        <UiPagination
          v-if="pagination"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          :items-per-page="pagination.itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && vouchers.length === 0" class="text-center py-8 bg-white rounded-lg border">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-ticket mx-auto mb-2 text-gray-400"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
      <p class="text-gray-500">Tidak ada data voucher</p>
    </div>
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin ingin menghapus voucher ${selectedVoucher?.kodeVoucher || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Data voucher berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useVoucherStore } from "~/store/voucher";
import type { VoucherAction, Column } from "~/types/voucher";
import VoucherFilter from "~/components/voucher/voucher-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const voucherStore = useVoucherStore();

// State
const showFilter = ref(false);
const viewMode = ref<'table' | 'grid'>('table');
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedVoucher = ref<any>(null);

// Computed
const vouchers = computed(() => voucherStore.vouchers);
const pagination = computed(() => voucherStore.pagination);
const filter = computed(() => voucherStore.filter);
const isLoading = computed(() => voucherStore.isLoading);

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "idVoucher", header: "ID Voucher" },
    { key: "kodeVoucher", header: "Kode Voucher" },
    { key: "nilaiVoucher", header: "Nilai Voucher" },
    { key: "persenVoucher", header: "Persen Voucher" },
    { key: "tanggalBerlaku", header: "Tanggal Berlaku" },
    { key: "tanggalBerakhir", header: "Tanggal Berakhir" },
    { key: "jumlahVoucher", header: "Jumlah Voucher" },
    { key: "voucherTerpakai", header: "Voucher Terpakai" },
    { key: "status", header: "Status" }
  ];
});

// Export data
const exportData = computed(() => {
  return vouchers.value.map(voucher => {
    const exportVoucher = { ...voucher };
    if (exportVoucher.status) {
      exportVoucher.status = exportVoucher.status.charAt(0).toUpperCase() + exportVoucher.status.slice(1);
    }
    return exportVoucher;
  });
});

// Table columns configuration
const columns: Column[] = [
  { key: "idVoucher", label: "ID Voucher" },
  { key: "kodeVoucher", label: "Kode Voucher" },
  { key: "nilaiVoucher", label: "Nilai Voucher" },
  { key: "persenVoucher", label: "Persen Voucher" },
  { key: "tanggalBerlaku", label: "Tanggal Berlaku" },
  { key: "tanggalBerakhir", label: "Tanggal Berakhir" },
  { key: "jumlahVoucher", label: "Jumlah Voucher" },
  { key: "voucherTerpakai", label: "Voucher Terpakai" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const statusClasses = getStatusClasses(value);
      return {
        component: "span",
        class: `px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`,
        text: value.charAt(0).toUpperCase() + value.slice(1),
      };
    },
  },
  { key: "actions", label: "Aksi" }
];

// Helper function for status classes
const getStatusClasses = (status: string): string => {
  const statusMap: Record<string, string> = {
    aktif: "bg-green-100 text-green-800",
    nonaktif: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
    menunggu: "bg-yellow-100 text-yellow-800",
  };
  
  return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

// Methods
const applyFilter = (newFilter: Partial<VoucherFilter>) => {
  voucherStore.setFilter(newFilter);
};

const resetFilter = () => {
  voucherStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  voucherStore.setFilter({ page });
};

const handleAction = async ({ type, row }: VoucherAction) => {
  const voucher = row;

  switch (type) {
    case "view":
      await router.push(`/admin/voucher/${voucher.idVoucher}`);
      break;
    case "edit":
      await router.push(`/admin/voucher/${voucher.idVoucher}/edit`);
      break;
    case "delete":
      selectedVoucher.value = voucher;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedVoucher.value) {
    try {
      await voucherStore.deleteVoucher(selectedVoucher.value.idVoucher);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting voucher:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await voucherStore.loadVouchers();
  } catch (error) {
    console.error("Error loading vouchers:", error);
  }
});
</script>