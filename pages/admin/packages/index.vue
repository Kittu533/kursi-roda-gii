<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Data Package</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/packages/create')"
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
          <span>Tambah Paket</span>
        </button>
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Package"
          filename="Packages"
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
    <PackageFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Package</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="packages"
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
      :message="`Apakah anda yakin ingin menghapus package dengan ID ${selectedPackage?.packageId || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Package berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { usePackageStore } from "~/store/package";
import type { Package } from "~/types/package";
import PackageFilter from "~/components/packages/package-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const packageStore = usePackageStore();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedPackage = ref<Package | null>(null);

// Computed
const packages = computed(() => packageStore.packages);
const pagination = computed(() => packageStore.pagination);
const filter = computed(() => packageStore.filter);
const isLoading = computed(() => packageStore.isLoading);

// Table columns configuration
const columns = [
  { key: "packageId", label: "ID Package" },
  { key: "voucherId", label: "ID Voucher" },
  { key: "name", label: "Nama" },
  { key: "price", label: "Harga" },
  { key: "creationDate", label: "Tanggal Dibuat" },
  { key: "updateDate", label: "Tanggal Diperbarui" },
  { key: "actions", label: "Aksi" }
];

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "packageId", header: "ID Package" },
    { key: "voucherId", header: "ID Voucher" },
    { key: "name", header: "Nama" },
    { key: "price", header: "Harga" },
    { key: "creationDate", header: "Tanggal Dibuat" },
    { key: "updateDate", header: "Tanggal Diperbarui" },
    { key: "status", header: "Status" }
  ];
});

// Export data
const exportData = computed(() => {
  return packages.value;
});

// Methods
const applyFilter = (newFilter: Partial<PackageFilter>) => {
  packageStore.setFilter(newFilter);
};

const resetFilter = () => {
  packageStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  packageStore.setFilter({ page });
};

const handleAction = async ({ type, row }: { type: string; row: Package }) => {
  const packageData = row;

  switch (type) {
    case "view":
      await router.push(`/admin/packages/${packageData.id}`);
      break;
    case "edit":
      await router.push(`/admin/packages/${packageData.id}/edit`);
      break;
    case "delete":
      selectedPackage.value = packageData;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedPackage.value) {
    try {
      await packageStore.deletePackage(selectedPackage.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting package:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await packageStore.loadPackages();
  } catch (error) {
    console.error("Error loading packages:", error);
  }
});
</script>