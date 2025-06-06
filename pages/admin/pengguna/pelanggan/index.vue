<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pelanggan</h2>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/pengguna/pelanggan/create"
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
        >
          <span>Tambah </span>
         <NuxtIcon name="material-symbols:add" class="w-5 h-5" />
        </NuxtLink>
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Pelanggan"
          filename="pelanggan"
        />
        <button
          class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
          @click="showFilter = !showFilter"
        >
         <NuxtIcon name="material-symbols:filter-list-rounded" class="w-5 h-5" />
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
      title="Data Pelanggan"
      :headers="columns"
      :items="customers"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="pelanggan"
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
import { useCustomerStore } from "~/store/customer";
import ExportDropdown from "~/components/export-to.vue";
import type {
  Customer,
  CustomerFilter as ICustomerFilter,
} from "~/types/customer";
import type {
  TableHeader,
  ExportColumn,
  TablePagination,
  TableItem,
} from "~/components/data-table.vue";
import DataTableFilter from "~/components/data-table-filter.vue";

const router = useRouter();
const customerStore = useCustomerStore();

// State
const showFilter = ref(false);
const isLoading = ref(false);
const itemsPerPage = ref(5);

// Fetch data on mount
onMounted(async () => {
  await loadData();
});

// Load data
const loadData = async () => {
  isLoading.value = true;
  try {
    await customerStore.loadCustomers();
  } catch (error) {
    console.error("Error loading customers:", error);
  } finally {
    isLoading.value = false;
  }
};

// Computed
const customers = computed<TableItem[]>(() => {
  return customerStore.customers.map((c) => ({
    ...c,
    name: c.full_name,
    phone: c.phone,
    email: c.email,
    gender: formatGender(c.gender),
    status: formatStatus(c.status?.status),
  }));
});


const pagination = computed(() => customerStore.pagination);
const filter = computed(() => customerStore.filter);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: customers.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return { ...pagination.value, itemsPerPage: itemsPerPage.value };
});

// Columns
const columns: TableHeader[] = [
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Alamat Email" },
  { key: "gender", label: "Jenis Kelamin" },
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

// Export columns & data
const exportColumns = computed<ExportColumn[]>(() => [
  { key: "name", header: "Nama Lengkap" },
  { key: "phone", header: "Nomor Telepon" },
  { key: "email", header: "Alamat Email" },
  { key: "gender", header: "Jenis Kelamin" },
  { key: "status", header: "Status Akun" },
]);


const exportData = computed(() => customers.value);


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

function formatGender(code: string): string {
  switch (code.toLowerCase()) {
    case "male":
      return "Laki-laki";
    case "female":
      return "Perempuan";
    default:
      return code;
  }
}

// Handler
const applyFilter = (newFilter: Partial<ICustomerFilter>) => {
  customerStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  customerStore.resetFilter();
  customerStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  customerStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  customerStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = async ({ type, row }: { type: string; row: Customer }) => {
  try {
    switch (type) {
      case "view":
        await router.push(`/admin/pengguna/pelanggan/${row.id}`);
        break;
      case "edit":
        await router.push(`/admin/pengguna/pelanggan/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Apakah Anda yakin ingin menghapus ${row.name}?`)) {
          await customerStore.deleteCustomer(row.id);
        }
        break;
    }
  } catch (error) {
    console.error("Error handling action:", error);
    alert("Terjadi kesalahan saat memproses aksi");
  }
};
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
</script>
