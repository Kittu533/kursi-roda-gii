<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold tracking-tight">Model Kursi Roda</h2>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/model/create"
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
        >
          <span>Tambah</span>
          <Plus class="w-4 h-4" />
        </NuxtLink>
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Model"
          filename="model"
        />
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter"
        >
          <Filter class="w-4 h-4" />
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
      title="Data Model"
      :headers="columns"
      :items="models"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="model"
      :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
      :default-rows-per-page="itemsPerPage"
      @action="handleAction"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ExportDropdown from "~/components/export-to.vue";
import DataTableFilter from "~/components/data-table-filter.vue";
import { Plus, Filter } from "lucide-vue-next";
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from "~/components/data-table.vue";
import { useModelStore } from "~/store/model"; // ganti sesuai lokasi store kamu
import type { Model } from "~/types/model"; // ganti sesuai definisi tipe Model kamu

const router = useRouter();
const modelStore = useModelStore();

const showFilter = ref(false);
const isLoading = ref(false);
const itemsPerPage = ref(10);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    if (modelStore.models.length === 0) {
      await modelStore.loadModels(); // hanya jika belum ada dummy
    }
  } catch (error) {
    console.error("Error loading models:", error);
  } finally {
    isLoading.value = false;
  }
};
modelStore.models = [
  {
    id: "M001",
    name: "Model Breeze A",
    photo: "https://via.placeholder.com/80x80.png?text=Breeze+A",
    stock: 10,
    price: 2750000,
    maxWeight: 120,
    batteryCapacity: 10000,
    status: "aktif",
  },
  {
    id: "M002",
    name: "Model Swift B",
    photo: "https://via.placeholder.com/80x80.png?text=Swift+B",
    stock: 5,
    price: 2450000,
    maxWeight: 110,
    batteryCapacity: 9000,
    status: "nonaktif",
  },
];

const models = computed<TableItem[]>(() =>
  modelStore.models.map((m, index) => ({
    no: index + 1,
    ...m,
    status: capitalize(m.status),
  }))
);

const pagination = computed(() => modelStore.pagination);
const filter = computed(() => modelStore.filter);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: models.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return { ...pagination.value, itemsPerPage: itemsPerPage.value };
});

const columns: TableHeader[] = [
  { key: "no", label: "No" },
  { key: "id", label: "ID Model" },
  { key: "name", label: "Model" },
  {
    key: "photo",
    label: "Foto",
    render: (value: string) => ({
      component: "img",
      src: value,
      alt: "Foto Model",
      class: "w-10 h-10 object-cover rounded",
    }),
  },
  { key: "stock", label: "Stok" },
  { key: "price", label: "Harga" },
  { key: "maxWeight", label: "Max Berat" },
  { key: "batteryCapacity", label: "Daya Baterai" },
  { key: "status", label: "Status Guide" },
  { key: "actions", label: "Aksi" },
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Model" },
  { key: "name", header: "Model" },
  { key: "stock", header: "Stok" },
  { key: "price", header: "Harga" },
  { key: "maxWeight", header: "Max Berat" },
  { key: "batteryCapacity", header: "Daya Baterai" },
  { key: "status", header: "Status Guide" },
]);

const exportData = computed(() => models.value);

const applyFilter = (newFilter: any) => {
  modelStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  modelStore.resetFilter();
  modelStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  modelStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  modelStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = ({ type, row }: { type: string; row: Model }) => {
  switch (type) {
    case "view":
      router.push(`/admin/model-wheelchair/${row.id}`);
      break;
    case "edit":
      router.push(`/admin/model-wheelchair/${row.id}/edit`);
      break;
    case "delete":
      if (confirm(`Hapus model ${row.name}?`)) {
        modelStore.deleteModel(row.id);
      }
      break;
  }
};

const filterFields = [
  { key: "name", label: "Nama Model", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["aktif", "nonaktif", "tidak tersedia"],
  },
];

const capitalize = (val: string): string =>
  val.charAt(0).toUpperCase() + val.slice(1);
</script>
