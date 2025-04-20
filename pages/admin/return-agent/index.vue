<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pengembalian</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/return/create')"
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
          <span>Tambah Pengembalian</span>
        </button>
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Pengembalian"
          filename="Pengembalian"
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
    <ReturnFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Pengembalian</h3>
      </div>
      <div class="p-4">
        <!-- Error state -->
        <div v-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
          {{ error }}
        </div>

        <!-- Data table -->
        <div v-else>
          <UiTable
            :data="returns"
            :columns="columns"
            :loading="isLoading"
            @action="handleAction"
          />
        </div>

        <UiPagination
          v-if="pagination"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin ingin menghapus pengembalian ${selectedReturn?.idPengembalian || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Data pengembalian berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useReturnItemStore } from "~/store/return-agent";
import type { ReturnItem } from "~/types/return-agent";
import ReturnFilter from "~/components/return/return-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const returnStore = useReturnItemStore();


// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedReturn = ref<ReturnItem | null>(null);

// Computed
const returns = computed(() => returnStore.returns);
const pagination = computed(() => returnStore.pagination);
const filter = computed(() => returnStore.filter);
const isLoading = computed(() => returnStore.isLoading);
const error = computed(() => returnStore.error);

// Table columns configuration
const columns = [
  { key: "idPengembalian", label: "ID Pengembalian" },
  { key: "idTransaksi", label: "ID Transaksi" },
  { key: "jenisKerusakan", label: "Jenis Kerusakan" },
  {
    key: "biayaTambahan",
    label: "Biaya Tambahan",
    render: (value: number) => `Rp${formatCurrency(value)}`,
  },
  { key: "catatan", label: "Catatan" },
  { key: "tanggalPengembalian", label: "Tanggal" },
  {
    key: "bukti",
    label: "Bukti",
    render: (value: string) => ({
      component: "a",
      text: "Lihat Foto",
      attrs: {
        href: value,
        target: "_blank"
      }
    })
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        berhasil: "bg-green-100 text-green-800",
        rusak: "bg-red-100 text-red-800",
        menunggu: "bg-yellow-100 text-yellow-800",
        ditolak: "bg-gray-100 text-gray-800",
      };
      return {
        component: "span",
        class: `px-2 py-1 rounded-md text-xs font-medium ${
          statusClasses[value.toLowerCase()] || ""
        }`,
        text: value.charAt(0).toUpperCase() + value.slice(1),
      };
    },
  },
  { key: "actions", label: "Aksi" }
];

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "idPengembalian", header: "ID Pengembalian" },
    { key: "idTransaksi", header: "ID Transaksi" },
    { key: "jenisKerusakan", header: "Jenis Kerusakan" },
    { key: "biayaTambahan", header: "Biaya Tambahan" },
    { key: "catatan", header: "Catatan" },
    { key: "tanggalPengembalian", header: "Tanggal" },
    { key: "bukti", header: "Bukti" },
    { key: "status", header: "Status" }
  ];
});

// Export data
const exportData = computed(() => {
  return returns.value.map(returnItem => {
    const exportReturn = { ...returnItem };
    if (exportReturn.status) {
      exportReturn.status = exportReturn.status.charAt(0).toUpperCase() + exportReturn.status.slice(1);
    }
    if (exportReturn.biayaTambahan) {
      exportReturn.biayaTambahan = `Rp${formatCurrency(exportReturn.biayaTambahan)}`;
    }
    return exportReturn;
  });
});

// Methods
const formatCurrency = (value: number): string => {
  return value.toLocaleString("id-ID");
};

const applyFilter = (newFilter: Partial<ReturnItemFilter>) => {
  returnStore.setFilter(newFilter);
};

const resetFilter = () => {
  returnStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  returnStore.setFilter({ page });
};

const handleAction = async ({ type, row }: { type: string; row: ReturnItem }) => {
  const returnItem = row;

  switch (type) {
    case "view":
      await router.push(`/admin/return-agent/${returnItem.idPengembalian}`);
      break;
    case "edit":
      await router.push(`/admin/return-agent/${returnItem.idPengembalian}/edit`);
      break;
    case "delete":
      selectedReturn.value = returnItem;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedReturn.value) {
    try {
      await returnStore.deleteReturn(selectedReturn.value.idPengembalian);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting return:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await returnStore.loadReturns();
  } catch (error) {
    console.error("Error loading returns:", error);
  }
});
</script>