<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Guide</h2>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/pengguna/guide/create"
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
        >
          <span>Tambah </span>
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
        </NuxtLink>
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Guide"
          filename="guide"
        />

        <button
          class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
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

    <!-- Filter -->
    <DataTableFilter
      v-if="showFilter"
      :filter="filter"
      :fields="filterFields"
      @apply="applyFilter"
      @reset="resetFilter"
    />

    <!-- Table -->
    <data-table
      title="Data Guide"
      :headers="columns"
      :items="guides"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="guide"
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
import { useGuideStore } from "~/store/guide";
import ExportDropdown from "~/components/export-to.vue";
import DataTableFilter from "~/components/data-table-filter.vue";
import type { Guide } from "~/types/guide";
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from "~/components/data-table.vue";

const router = useRouter();
const guideStore = useGuideStore();

const showFilter = ref(false);
const isLoading = ref(false);
const itemsPerPage = ref(10);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    await guideStore.loadGuides();
  } catch (error) {
    console.error("Error loading guides:", error);
  } finally {
    isLoading.value = false;
  }
};

const guides = computed<TableItem[]>(() => {
  return guideStore.guides.map((g) => ({
    ...g,
    status: capitalize(g.status),
  }));
});

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

const columns: TableHeader[] = [
  { key: "id", label: "ID Guide" },
  {
    key: "photo",
    label: "Foto Profil",
    render: (value: string) => ({
      component: "img",
      src: value,
      alt: "Profile",
      class: "w-8 h-8 rounded-full object-cover",
    }),
  },
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "ktp", label: "KTP" },
  { key: "accountNumber", label: "Nomor Rekening" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status Akun" },
  { key: "actions", label: "Aksi" },
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Guide" },
  { key: "name", header: "Nama Lengkap" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Nomor Telepon" },
  { key: "ktp", header: "KTP" },
  { key: "accountNumber", header: "Nomor Rekening" },
  { key: "status", header: "Status Akun" },
]);

const exportData = computed(() => guides.value);

// Filter config
const filterFields = [
  {
    key: "name",
    label: "Nama",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["aktif", "nonaktif", "menunggu", "dibatalkan"],
  },
];

const applyFilter = (newFilter: Partial<Record<string, any>>) => {
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

const handleAction = async ({ type, row }: { type: string; row: Guide }) => {
  switch (type) {
    case "view":
      await router.push(`/admin/pengguna/guide/${row.id}`);
      break;
    case "edit":
      await router.push(`/admin/pengguna/guide/${row.id}/edit`);
      break;
    case "delete":
      if (confirm(`Apakah anda yakin ingin menghapus ${row.name}?`)) {
        try {
          await guideStore.deleteGuide(row.id);
        } catch (error) {
          console.error("Error deleting guide:", error);
        }
      }
      break;
  }
};

const capitalize = (val: string): string =>
  val.charAt(0).toUpperCase() + val.slice(1);
</script>
