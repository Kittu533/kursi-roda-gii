<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold tracking-tight">Data Package</h2>
      <div class="flex items-center gap-2">
        <button class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/packages/create')">
          <span>Tambah Paket</span>
          <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </button>
        <ExportDropdown :data="exportData" :columns="exportColumns" title="Data Package" filename="packages" />
      </div>
    </div>

    <data-table title="Data Package" :headers="columns" :items="transformedPackages" :pagination="enhancedPagination"
      :is-loading="isLoading" :show-export="true" :export-columns="exportColumns" :export-data="exportData"
      export-filename="packages" :rows-per-page-options="[5, 10, 20, 50]" :default-rows-per-page="itemsPerPage"
      @action="handleAction" @page-change="handlePageChange" @rows-per-page-change="handleRowsPerPageChange" />

    <!-- Modals -->
    <ConfirmationModal v-model:isOpen="isDeleteModalOpen" type="delete"
      :message="`Apakah Anda yakin ingin menghapus package '${selectedPackage?.name}'?`" @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false" />
    <ConfirmationModal v-model:isOpen="isSuccessModalOpen" type="success" message="Package berhasil dihapus"
      :showButtons="false" @cancel="isSuccessModalOpen = false" />
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePackageStore } from "~/store/package";
import ExportDropdown from "~/components/export-to.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import dataTable from "~/components/data-table.vue";

import type { TableHeader, ExportColumn, TableItem, TablePagination } from "~/components/data-table.vue";
import type { Package } from "~/types/packages";

const router = useRouter();
const packageStore = usePackageStore();

const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedPackage = ref<Package | null>(null);
const itemsPerPage = ref(10);

const packages = computed(() => packageStore.packages);
const isLoading = computed(() => packageStore.isLoading);

// Transform data untuk ditampilkan di tabel
const transformedPackages = computed<TableItem[]>(() =>
  packages.value.map((p) => ({
    id: p.id,
    name: p.name,
    price: `Rp ${parseFloat(p.price).toLocaleString("id-ID")}`
  }))
);

const enhancedPagination = computed<TablePagination>(() => {
  return {
    currentPage: 1,
    totalPages: 1,
    totalItems: transformedPackages.value.length,
    itemsPerPage: itemsPerPage.value
  };
});

const columns: TableHeader[] = [
  { key: "id", label: "ID Package" },
  { key: "name", label: "Nama Paket" },
  { key: "price", label: "Harga" },
  { key: "actions", label: "Aksi" }
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Package" },
  { key: "name", header: "Nama Paket" },
  { key: "price", header: "Harga" }
]);

const exportData = computed(() => transformedPackages.value);

const handlePageChange = (page: number) => {
  // optional: jika pakai pagination API
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
};

const handleAction = async ({ type, row }: { type: string; row: TableItem }) => {
  const pkg = row as Package;
  switch (type) {
    case "view":
      await router.push(`/admin/packages/${pkg.id}`);
      break;
    case "edit":
      await router.push(`/admin/packages/${pkg.id}/edit`);
      break;
    case "delete":
      selectedPackage.value = pkg;
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
