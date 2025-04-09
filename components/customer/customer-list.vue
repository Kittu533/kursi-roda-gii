<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pelanggan</h2>
      </div>
      
        <div class="flex items-center gap-2">
          <button
            class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
          >
            <span>Cetak</span>
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
              class="lucide lucide-chevron-down"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
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
          :columns="columns"
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

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "~/store/customer";
import { useNotification } from "~/composables/use-notification";
import type { Customer, CustomerAction, Column } from "~/types/customer";
import CustomerFilter from "~/components/customer/customer-filter.vue";
import UiTable from "~/components/ui/ui-table.vue";
import UiPagination from "~/components/ui/ui-pagination.vue";

// Router and stores
const router = useRouter();
const customerStore = useCustomerStore();
const notification = useNotification();

// State
const showFilter = ref(false);

// Computed
const customers = computed(() => customerStore.customers);
const pagination = computed(() => customerStore.pagination);
const filter = computed(() => customerStore.filter);
const isLoading = computed(() => customerStore.isLoading);

// Table columns configuration
const columns: Column[] = [
  { key: "id", label: "ID Pelanggan" },
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Alamat Email" },
  { key: "gender", label: "Jenis Kelamin" },
  { key: "registerDate", label: "Akun Dibuat" },
  { key: "lastLogin", label: "Akun Diperbarui" },
  {
    key: "status",
    label: "Status Akun",
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        menunggu: "bg-yellow-100 text-yellow-800",
        aktif: "bg-green-100 text-green-800",
        dibatalkan: "bg-red-100 text-red-800",
        nonaktif: "bg-gray-100 text-gray-800",
      };
      return {
        component: "span",
        class: `px-2 py-1 rounded-md text-xs font-medium ${
          statusClasses[value] || ""
        }`,
        text: value.charAt(0).toUpperCase() + value.slice(1),
      };
    },
  },
  {
    key: "actions",
    label: "Aksi",
    render: (_, row) => {
      return {
        component: "div",
        class: "flex space-x-2",
        slots: {
          default: `
            <button 
              @click="$emit('action', { type: 'view', row: ${JSON.stringify(
                row
              )} })"
              class="p-1 text-blue-600 hover:text-blue-800"
            >
              <span class="sr-only">View</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button 
              @click="$emit('action', { type: 'edit', row: ${JSON.stringify(
                row
              )} })"
              class="p-1 text-yellow-600 hover:text-yellow-800"
            >
              <span class="sr-only">Edit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button 
              @click="$emit('action', { type: 'delete', row: ${JSON.stringify(
                row
              )} })"
              class="p-1 text-red-600 hover:text-red-800"
            >
              <span class="sr-only">Delete</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          `,
        },
      };
    },
  },
];

// Methods
const applyFilter = (newFilter: Partial<CustomerFilter>) => {
  customerStore.setFilter(newFilter);
};

const resetFilter = () => {
  customerStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  customerStore.setFilter({ page });
};

const handleAction = async ({ type, row }: CustomerAction) => {
  const customer = row;

  switch (type) {
    case "view":
      await router.push(`/admin/pengguna/pelanggan/${customer.id}`);
      break;
    case "edit":
      await router.push(`/admin/pengguna/pelanggan/${customer.id}/edit`);
      break;
    case "delete":
      if (confirm(`Apakah anda yakin ingin menghapus ${customer.name}?`)) {
        try {
          await customerStore.deleteCustomer(customer.id);
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
