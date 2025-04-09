<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pengembalian</h2>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
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
        </div>
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
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
    <ReturnFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Pengembalian</h3>
      </div>
      <div class="p-4">
        <!-- Error state -->
        <div v-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
          {{ error }}
        </div>

        <!-- Data table -->
        <div v-else>
          <UITable
            :data="returns"
            :columns="tableColumns"
            :loading="isLoading"
            @action="handleTableAction"
          />
        </div>

        <!-- Pagination -->
        <div v-if="pagination" class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Halaman {{ pagination.currentPage }} dari {{ pagination.totalPages }} ({{ pagination.total }} data)
          </div>

          <div class="flex space-x-1">
            <button
              class="px-2 py-1 rounded-md text-sm border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="pagination.currentPage === 1"
              @click="handlePageChange(pagination.currentPage - 1)"
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
                class="w-4 h-4"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <button
              v-for="page in pagination.totalPages"
              :key="page"
              class="px-3 py-1 rounded-md text-sm border bg-transparent hover:bg-muted"
              :class="{ 'border-primary text-primary': page === pagination.currentPage }"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>

            <button
              class="px-2 py-1 rounded-md text-sm border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="pagination.currentPage === pagination.totalPages"
              @click="handlePageChange(pagination.currentPage + 1)"
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
                class="w-4 h-4"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useReturnStore } from "~/store/return";
import ReturnFilter from "~/components/return/return-filter.vue";
import UITable from "~/components/ui/ui-table.vue";

// Router and stores
const router = useRouter();
const returnStore = useReturnStore();

// State
const showFilter = ref(false);

// Table columns configuration
const tableColumns = [
  { key: "id", label: "ID Return" },
  { key: "transactionId", label: "ID Transaksi" },
  { key: "customerId", label: "ID Pelanggan" },
  {
    key: "amount",
    label: "Jumlah",
    render: (value) => `Rp${formatCurrency(value as number)}`,
  },
  { key: "reason", label: "Alasan" },
  { key: "returnDate", label: "Tanggal" },
  { key: "returnTime", label: "Waktu" },
  {
    key: "status",
    label: "Status",
    render: (value) => ({
      component: "span",
      text: formatStatus(value as string),
      class: `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
        value as string
      )}`,
    }),
  },
  { key: "actions", label: "Aksi" },
];

// Computed
const returns = computed(() => returnStore.returns);
const pagination = computed(() => returnStore.pagination);
const filter = computed(() => returnStore.filter);
const isLoading = computed(() => returnStore.isLoading);
const error = computed(() => returnStore.error);

// Methods
const formatCurrency = (value: number): string => {
  return value.toLocaleString("id-ID");
};

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    berhasil: "bg-green-100 text-green-800",
    rusak: "bg-red-100 text-red-800",
    menunggu: "bg-yellow-100 text-yellow-800",
    ditolak: "bg-gray-100 text-gray-800",
  };

  return statusClasses[status] || "";
};

const handleTableAction = (action: { type: string; row: any }) => {
  const { type, row } = action;

  switch (type) {
    case "view":
      viewReturn(row.id);
      break;
    case "edit":
      editReturn(row.id);
      break;
    case "delete":
      deleteReturn(row.id);
      break;
  }
};

const applyFilter = (newFilter: Partial<ReturnFilter>) => {
  returnStore.setFilter(newFilter);
};

const resetFilter = () => {
  returnStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  returnStore.setFilter({ page });
};

const viewReturn = (id: string) => {
  router.push(`/admin/return/${id}`);
};

const editReturn = (id: string) => {
  router.push(`/admin/return/${id}/edit`);
};

const deleteReturn = async (id: string) => {
  if (confirm("Apakah anda yakin ingin menghapus data pengembalian ini?")) {
    try {
      // Implement delete logic here
      await returnStore.loadReturns();
    } catch (error) {
      console.error("Error deleting return:", error);
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await returnStore.loadReturns();
  } catch (error) {
    console.error("Error loading returns:", error);
  }
});
</script>
