<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Data Maintenance</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/maintenance/create')"
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
          <span>Tambah Maintenance</span>
        </button>
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Maintenance"
          filename="Maintenances"
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
    <MaintenanceFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Maintenance</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="maintenances"
          :columns="columns"
          :loading="isLoading"
          @action="handleAction"
        />

        <UiPagination
          v-if="pagination && pagination.totalPages > 1"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          :items-per-page="pagination.itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin ingin menghapus maintenance dengan ID ${selectedMaintenance?.maintenanceId || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Maintenance berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMaintenanceStore } from "~/store/maintenance";
import type { Maintenance } from "~/types/maintenance";
import MaintenanceFilter from "~/components/maintenances/maintenance-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const maintenanceStore = useMaintenanceStore();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedMaintenance = ref<Maintenance | null>(null);

// Computed
const maintenances = computed(() => maintenanceStore.maintenances);
const pagination = computed(() => maintenanceStore.pagination);
const filter = computed(() => maintenanceStore.filter);
const isLoading = computed(() => maintenanceStore.isLoading);

// Table columns configuration
const columns = [
  { key: "maintenanceId", label: "ID Maintenance" },
  { key: "productId", label: "ID Produk" },
  { key: "date", label: "Tanggal" },
  { key: "description", label: "Deskripsi" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aksi" }
];

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "maintenanceId", header: "ID Maintenance" },
    { key: "productId", header: "ID Produk" },
    { key: "date", header: "Tanggal" },
    { key: "description", header: "Deskripsi" },
    { key: "photoUrl", header: "URL Foto" },
    { key: "status", header: "Status" }
  ];
});

// Export data
const exportData = computed(() => {
  return maintenances.value;
});

// Methods
const applyFilter = (newFilter: Partial<MaintenanceFilter>) => {
  maintenanceStore.setFilter(newFilter);
};

const resetFilter = () => {
  maintenanceStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  maintenanceStore.setFilter({ page });
};

const handleAction = async ({ type, row }: { type: string; row: Maintenance }) => {
  const maintenanceData = row;

  switch (type) {
    case "view":
      await router.push(`/admin/maintenance/${maintenanceData.id}`);
      break;
    case "edit":
      await router.push(`/admin/maintenance/${maintenanceData.id}/edit`);
      break;
    case "delete":
      selectedMaintenance.value = maintenanceData;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedMaintenance.value) {
    try {
      await maintenanceStore.deleteMaintenance(selectedMaintenance.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await maintenanceStore.loadMaintenances();
  } catch (error) {
    console.error("Error loading maintenances:", error);
  }
});
</script>