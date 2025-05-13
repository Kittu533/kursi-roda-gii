<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold tracking-tight">Agen</h2>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/pengguna/agent/create')"
        >
          <span>Tambah</span>
          <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </button>

        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Agen"
          filename="agent"
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

    <!-- Filter -->
    <DataTableFilter
      v-if="showFilter"
      :filter="filter"
      :fields="filterFields"
      @apply="applyFilter"
      @reset="resetFilter"
    />

    <!-- Data Table -->
    <data-table
      title="Data Agen"
      :headers="columns"
      :items="agents"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="agent"
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
import { useAgentStore } from "~/store/agent";
import ExportDropdown from "~/components/export-to.vue";
import DataTableFilter from "~/components/data-table-filter.vue";
import type { Agent } from "~/types/agent";
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from "~/components/data-table.vue";

const router = useRouter();
const agentStore = useAgentStore();

const showFilter = ref(false);
const isLoading = ref(false);
const itemsPerPage = ref(10);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    await agentStore.loadAgents();
  } catch (error) {
    console.error("Error loading agents:", error);
  } finally {
    isLoading.value = false;
  }
};

const agents = computed<TableItem[]>(() =>
  agentStore.agents.map((a, index) => ({
    no:
      index +
      1 +
      ((pagination.value?.currentPage || 1) - 1) *
        (pagination.value?.itemsPerPage || 10),
    id: a.id,
    name: a.full_name,
    photo: "*jpg", // atau a.photo_profile ?? '/default-avatar.png'
    phone: a.phone,
    location: a.location ?? "-",
    open_time: a.open_time ?? "-",
    close_time: a.close_time ?? "-",
    status: formatStatus(a.status?.status),
  }))
);

const pagination = computed(() => agentStore.pagination);
const filter = computed(() => agentStore.filter);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: agents.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return {
    currentPage: pagination.value.currentPage,
    totalPages: pagination.value.totalPages,
    totalItems: pagination.value.total,
    itemsPerPage: itemsPerPage.value,
  };
});

const columns: TableHeader[] = [
  { key: "id", label: "ID Agen" },
  { key: "name", label: "Nama Lengkap" },
  { key: "photo", label: "Foto Profil" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "location", label: "Lokasi" },
  { key: "open_time", label: "Jam Buka" },
  { key: "close_time", label: "Jam Tutup" },
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
      children: status, // ❌ tidak digunakan di slot
      text: status, // ✅ inilah yang dicari di data-table.vue
    }),
  },
  { key: "actions", label: "Aksi" },
];

const formatStatus = (status: string | undefined) => {
  switch (status?.toUpperCase()) {
    case "ACT":
      return "Aktif";
    case "NON":
      return "Tidak Aktif";
    case "DEL":
    case "HAPUS":
    case "DELTD":
      return "Hapus";
    case "INC":
      return "Tidak Aktif"; // bisa juga ditampilkan sebagai "Menunggu" kalau kamu mau
    default:
      return "-";
  }
};
const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Agen" },
  { key: "full_name", header: "Nama Lengkap" },
  { key: "phone", header: "Nomor Telepon" },
  { key: "location", header: "Lokasi" },
  { key: "open_time", header: "Jam Buka" },
  { key: "close_time", header: "Jam Tutup" },
  { key: "status", header: "Status Akun" },
]);

const exportData = computed(() => agentStore.agents);

const filterFields = [
  { key: "name", label: "Nama", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["aktif", "nonaktif", "menunggu", "dibatalkan"],
  },
];

const applyFilter = (newFilter: Partial<Record<string, any>>) => {
  agentStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  agentStore.resetFilter();
  agentStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  agentStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  agentStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = async ({ type, row }: { type: string; row: Agent }) => {
  switch (type) {
    case "view":
      await router.push(`/admin/pengguna/agent/${row.id}`);
      break;
    case "edit":
      await router.push(`/admin/pengguna/agent/${row.id}/edit`);
      break;
    case "delete":
      await agentStore.deleteAgent(row.id);
      break;
  }
};

</script>
