<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pelanggan</h2>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Komponen ExportDropdown -->
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

    <!-- Filter Panel -->
    <CustomerFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Pelanggan</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="customers"
          :columns="tableColumns"
          :loading="isLoading"
          @action="handleAction"
        />

        <UiPagination
          v-if="pagination"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          :items-per-page="pagination.itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "~/store/customer";
import CustomerFilter from "~/components/customer/customer-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const customerStore = useCustomerStore();
// State
const showFilter = ref(false);

// Computed
const customers = computed(() => customerStore.customers);
const pagination = computed(() => customerStore.pagination);
const filter = computed(() => customerStore.filter);
const isLoading = computed(() => customerStore.isLoading);

// Table columns configuration for TanStack Table
const tableColumns = [
  {key :"id", label: "ID Pelanggan", sortable: true, format: "number"},
  { key: "name", label: "Nama Lengkap", sortable: true },
  { key: "phone", label: "Nomor Telepon", sortable: true, 
    format: (value, row) => `${row.phoneCode}${value}` },
  { key: "email", label: "Alamat Email", sortable: true },
  { key: "gender", label: "Jenis Kelamin", sortable: true,
    format: (value) => value.charAt(0).toUpperCase() + value.slice(1) },
  { key: "registerDate", label: "Akun Dibuat", sortable: true, format: "date" },
  { key: "lastLogin", label: "Akun Diperbarui", sortable: true, format: "date" },
  { key: "status", label: "Status Akun", sortable: true,
    format: (value) => value.charAt(0).toUpperCase() + value.slice(1) },
  { key: "actions", label: "Aksi" }
];

// Kolom untuk export (tanpa kolom aksi)
const exportColumns = computed(() => {
  return [
    { key: "id", header: "ID Pelanggan" },
    { key: "name", header: "Nama Lengkap" },
    { key: "phone", header: "Nomor Telepon" },
    { key: "email", header: "Alamat Email" },
    { key: "gender", header: "Jenis Kelamin" },
    { key: "registerDate", header: "Akun Dibuat" },
    { key: "lastLogin", header: "Akun Diperbarui" },
    { key: "status", header: "Status Akun" }
  ];
});

// Data untuk export (format data untuk export)
const exportData = computed(() => {
  return customers.value.map(customer => {
    // Buat salinan data customer untuk export
    const exportCustomer = { ...customer };
    
    // Format status jika diperlukan
    if (exportCustomer.status) {
      exportCustomer.status = exportCustomer.status.charAt(0).toUpperCase() + exportCustomer.status.slice(1);
    }
    
    return exportCustomer;
  });
});

// Methods
const applyFilter = (newFilter) => {
  customerStore.setFilter(newFilter);
};

const resetFilter = () => {
  customerStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page) => {
  customerStore.setFilter({ ...filter.value, page });
};

// Handler untuk action dari TanStack Table
const handleAction = (action) => {
  const { type, row } = action;
  const customer = row;

  switch (type) {
    case "view":
      router.push(`/admin/pengguna/pelanggan/${customer.id}`);
      break;
    case "edit":
      router.push(`/admin/pengguna/pelanggan/${customer.id}/edit`);
      break;
    case "delete":
      if (confirm(`Apakah anda yakin ingin menghapus ${customer.name}?`)) {
        try {
          customerStore.deleteCustomer(customer.id);
        } catch (error) {
          console.error("Error deleting customer:", error);
        }
      }
      break;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await customerStore.loadCustomers();
  } catch (error) {
    console.error("Error loading customers:", error);
  }
});
</script>