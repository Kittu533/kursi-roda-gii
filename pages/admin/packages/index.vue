<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Data Package</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/packages/create')"
        >
          <span>Tambah Paket</span>
          <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </button>
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
          <NuxtIcon name="material-symbols:filter-list-rounded" class="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <PackageFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- ✅ Ganti ke data-table -->
    <data-table
      title="Data Package"
      :headers="columns"
      :items="transformedPackages"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="Packages"
      :rows-per-page-options="[5, 10, 20, 50]"
      :default-rows-per-page="itemsPerPage"
      @action="handleAction"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
    />

    <!-- Modals -->
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePackageStore } from "~/store/package";
import ExportDropdown from "~/components/export-to.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import dataTable from "~/components/data-table.vue";
import PackageFilter from "~/components/packages/package-filter.vue";

import type { TableHeader, ExportColumn, TableItem, TablePagination } from "~/components/data-table.vue";
import type { Package } from "~/types/package";

const router = useRouter();
const packageStore = usePackageStore();

const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedPackage = ref<Package | null>(null);
const itemsPerPage = ref(10);

const packages = computed(() => packageStore.packages);
const isLoading = computed(() => packageStore.isLoading);
const pagination = computed(() => packageStore.pagination);
const filter = computed(() => packageStore.filter);

const transformedPackages = computed<TableItem[]>(() =>
  packages.value.map((p) => ({
    ...p,
    price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
    creationDate: new Date(p.creationDate).toLocaleDateString("id-ID"),
    updateDate: new Date(p.updateDate).toLocaleDateString("id-ID"),
  }))
);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: transformedPackages.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return { ...pagination.value, itemsPerPage: itemsPerPage.value };
});

const columns: TableHeader[] = [
  { key: "packageId", label: "ID Package" },
  { key: "voucherId", label: "ID Voucher" },
  { key: "name", label: "Nama" },
  { key: "price", label: "Harga" },
  { key: "creationDate", label: "Tanggal Dibuat" },
  { key: "updateDate", label: "Tanggal Diperbarui" },
  { key: "actions", label: "Aksi" }
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "packageId", header: "ID Package" },
  { key: "voucherId", header: "ID Voucher" },
  { key: "name", header: "Nama" },
  { key: "price", header: "Harga" },
  { key: "creationDate", header: "Tanggal Dibuat" },
  { key: "updateDate", header: "Tanggal Diperbarui" }
]);

const exportData = computed(() => transformedPackages.value);

const applyFilter = (newFilter: Partial<any>) => {
  packageStore.setFilter({ ...filter.value, ...newFilter, page: 1, itemsPerPage: itemsPerPage.value });
};

const resetFilter = () => {
  packageStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  packageStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  packageStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = async ({ type, row }: { type: string; row: Package }) => {
  const p = row;
  switch (type) {
    case "view":
      await router.push(`/admin/packages/${p.id}`);
      break;
    case "edit":
      await router.push(`/admin/packages/${p.id}/edit`);
      break;
    case "delete":
      selectedPackage.value = p;
      isDeleteModalOpen.value = true;
      break;
  }
};

const confirmDelete = async () => {
  if (selectedPackage.value) {
    try {
      await packageStore.deletePackage(selectedPackage.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => (isSuccessModalOpen.value = false), 2000);
    } catch (error) {
      console.error("Delete failed", error);
      isDeleteModalOpen.value = false;
    }
  }
};

onMounted(async () => {
  await packageStore.loadPackages();
});
</script>
