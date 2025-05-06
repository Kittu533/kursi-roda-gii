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
          title="Data Pelanggan"
          filename="pelanggan"
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
const itemsPerPage = ref(10);

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
    phone: `${(c as any).phoneCode ?? ""}${c.phone}`,
    gender: capitalize(c.gender),
    status: capitalize(c.status),
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
  { key: "id", label: "ID Pelanggan" },
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Alamat Email" },
  { key: "gender", label: "Jenis Kelamin" },
  { key: "status", label: "Status Akun" },
  { key: "actions", label: "Aksi" },
];

// Export columns & data
const exportColumns = computed<ExportColumn[]>(() => [
  { key: "id", header: "ID Pelanggan" },
  { key: "name", header: "Nama Lengkap" },
  { key: "phone", header: "Nomor Telepon" },
  { key: "email", header: "Alamat Email" },
  { key: "gender", header: "Jenis Kelamin" },
  { key: "status", header: "Status Akun" },
]);

const exportData = computed(() => customers.value);

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

const handleAction = ({ type, row }: { type: string; row: Customer }) => {
  switch (type) {
    case "view":
      router.push(`/admin/pengguna/pelanggan/${row.id}`);
      break;
    case "edit":
      router.push(`/admin/pengguna/pelanggan/${row.id}/edit`);
      break;
    case "delete":
      if (confirm(`Apakah Anda yakin ingin menghapus ${row.name}?`)) {
        customerStore.deleteCustomer(row.id);
      }
      break;
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

// Util
const capitalize = (val: string): string =>
  val.charAt(0).toUpperCase() + val.slice(1);
</script>
