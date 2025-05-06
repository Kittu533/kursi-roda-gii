<template>
  <div class="space-y-6">
    <!-- Detail View -->
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

    <!-- Produk Section -->
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

      <!-- Filter Panel -->
      <DataTableFilter
        v-if="showFilter"
        :filter="filter"
        :fields="filterFields"
        @apply="applyFilter"
        @reset="resetFilter"
      />

      <!-- Data Table -->
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
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAgentStore } from "~/store/agent";
import DetailView from "~/components/detail-view.vue";
import { useProductStore } from "~/store/product";
import ExportDropdown from "~/components/export-to.vue";
import DataTableFilter from "~/components/data-table-filter.vue";
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from "~/components/data-table.vue";
import type { Product } from "~/types/product";

// Router
const route = useRoute();
const router = useRouter();
const agentId = computed(() => route.params.id as string);

// Agent Store
const agentStore = useAgentStore();
const agent = computed(() => agentStore.selectedAgent);
const isLoading = computed(() => agentStore.isLoading);
const error = computed(() => agentStore.error);



// Agent Detail Fields
const breadcrumbs = [
  { text: "Kursi Roda", to: "/admin/model-wheelchair" },
  { text: "Model", to: "/admin/model-wheelchair" },
  { text: "Detail" },
];


const fields = [
  { key: "id", label: "ID Model" },
  { key: "name", label: "Nama Model" },
  { key: "photo", label: "Foto", type: "image" },
  { key: "stock", label: "Stok Tersedia" },
  { key: "price", label: "Harga", type: "currency" },
  { key: "maxWeight", label: "Maks. Berat" },
  { key: "batteryCapacity", label: "Daya Baterai" },
  { key: "status", label: "Status", type: "status" },
];

// Product Section
const productStore = useProductStore();
const showFilter = ref(false);
const itemsPerPage = ref(10);
const selectedProduct = ref<Product | null>(null);

onMounted(async () => {
  if (agentId.value) {
    await agentStore.loadAgentDetails(agentId.value);
  }
  await productStore.loadProducts();
});

const filter = computed(() => productStore.filter);
const products = computed<TableItem[]>(() =>
  productStore.products.map((p) => ({
    ...p,
    status: capitalize(p.status),
  }))
);
const pagination = computed(() => productStore.pagination);
const enhancedPagination = computed<TablePagination>(() => ({
  ...pagination.value,
  itemsPerPage: itemsPerPage.value,
}));

const columns: TableHeader[] = [
  { key: "id", label: "ID Produk" },
  { key: "agentId", label: "ID Agen" },
  { key: "serialNumber", label: "Nomor Seri" },
  { key: "productName", label: "Nama Produk" },
  {key:"tanggalPemeliharaan",label:"tanggalPemeliharaan"},
  { key: "actions", label: "Aksi" },
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Produk" },
  { key: "agentId", header: "ID Agen" },
  { key: "serialNumber", header: "Nomor Seri" },
  { key: "productName", header: "Nama Produk" },
  {key:"tanggalPemeliharaan",header:"tanggalPemeliharaan"}
]);

const exportData = computed(() => products.value);

const filterFields = [
  { key: "productName", label: "Nama Produk", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["tersedia", "rusak", "disewa", "perbaikan"],
  },
];

const applyFilter = (newFilter: Partial<Record<string, any>>) => {
  productStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  productStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  productStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  productStore.setFilter({ ...filter.value, page: 1, itemsPerPage: size });
};

const handleAction = ({ type, row }: { type: string; row: Product }) => {
  switch (type) {
    case "view":
      router.push(`/admin/product/${row.id}`);
      break;
    case "edit":
      router.push(`/admin/product/${row.id}/edit`);
      break;
    case "delete":
      selectedProduct.value = row;
      break;
  }
};

const confirmDelete = async () => {
  if (selectedProduct.value) {
    await productStore.deleteProduct(selectedProduct.value.id);
    selectedProduct.value = null;
  }
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
</script>
