<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Guide</h2>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/pengguna/guide/create"
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
          <span>Tambah</span>
          <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </NuxtLink>

        <ExportDropdown :data="exportData" :columns="exportColumns" title="Data Guide" filename="guide" />

        <button
          class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter">
          <NuxtIcon name="material-symbols:filter-list-rounded" class="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <DataTableFilter v-if="showFilter" :filter="filter" :fields="filterFields" @apply="applyFilter"
      @reset="resetFilter" />

    <data-table title="Data Guide" :headers="columns" :items="guides" :pagination="enhancedPagination"
      :is-loading="isLoading" :show-export="true" :export-columns="exportColumns" :export-data="exportData"
      export-filename="guide" :rows-per-page-options="[5, 10, 20, 30, 50, 100]" :default-rows-per-page="itemsPerPage"
      @action="handleAction" @page-change="handlePageChange" @rows-per-page-change="handleRowsPerPageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ExportDropdown from '~/components/export-to.vue';
import DataTableFilter from '~/components/data-table-filter.vue';
import { useGuideStore } from '~/store/guide';
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem
} from '~/components/data-table.vue';

const router = useRouter();
const guideStore = useGuideStore();

// State
const showFilter = ref(false);
const isLoading = ref(false);
const itemsPerPage = ref(5);

// Lifecycle
onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    await guideStore.loadGuides();
  } catch (error) {
    console.error('Error loading guides:', error);
  } finally {
    isLoading.value = false;
  }
};

// Computed
const guides = computed<TableItem[]>(() =>
  guideStore.guides.map((g) => ({
    ...g,
    name: g.full_name,
    phone: g.phone,
    email: g.email,
    status: formatStatus(g.status?.status),
  }))
);

// Table
const columns: TableHeader[] = [
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (status: string) => ({
      component: "span",
      class:
        status === "Aktif"
          ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
          : status === "Hapus"
            ? "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
            : "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs",
      text: status,
    }),
  },
  { key: "actions", label: "Aksi" },
];

// Helper
const formatStatus = (status: string | undefined): string => {
  switch (status?.toUpperCase()) {
    case "ACT":
      return "Aktif";
    case "NON":
    case "INC":
      return "Tidak Aktif";
    case "DEL":
    case "HAPUS":
    case "DELTD":
      return "Hapus";
    default:
      return "-";
  }
};

const pagination = computed(() => guideStore.pagination);
const filter = computed(() => guideStore.filter);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: guides.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return { ...pagination.value, itemsPerPage: itemsPerPage.value };
});

// Export TO PDF/EXCEL
const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Guide" },
  { key: "full_name", header: "Nama Lengkap" },
  { key: "phone", header: "Nomor Telepon" },
  { key: "email", header: "Email" },
  { key: "identity_document", header: "KTP" },
  { key: "bank_account_number", header: "Nomor Rekening" },
  { key: "status", header: "Status" },
]);

const exportData = computed(() => guideStore.guides);

// Filter Field
const filterFields = [
  {
    key: "full_name",
    label: "Nama",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["aktif", "nonaktif", "menunggu", "hapus"],
  },
];

// Action Handlers
const applyFilter = (newFilter: Partial<any>) => {
  guideStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  guideStore.resetFilter();
  guideStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  guideStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  guideStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = async ({ type, row }: { type: string; row: any }) => {
  try {
    switch (type) {
      case "view":
        await router.push(`/admin/pengguna/guide/${row.id}`);
        break;
      case "edit":
        await router.push(`/admin/pengguna/guide/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Apakah Anda yakin ingin menghapus ${row.full_name}?`)) {
          await guideStore.deleteGuide(row.id);
        }
        break;
    }
  } catch (error) {
    console.error("Error handling action:", error);
    alert("Terjadi kesalahan saat memproses aksi");
  }
};
</script>
