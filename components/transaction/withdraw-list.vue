<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Transaksi - Penarikan</h2>
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
    <TransactionFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Insentif</h3>
      </div>
      <div class="p-4">
        <!-- Error state -->
        <div v-if="error" class="bg-red-100 p-4 rounded-md text-red-800">
          {{ error }}
        </div>

        <!-- Data table -->
        <div v-else>
          <UITable
            :data="withdraws"
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
import { useWithdrawStore } from "~/store/withdraw";
import TransactionFilter from "~/components/transaction/transaction-filter.vue";
import UITable from "~/components/ui/ui-table.vue";

// Router and stores
const router = useRouter();
const withdrawStore = useWithdrawStore();

// State
const showFilter = ref(false);

// Table columns configuration
const tableColumns = [
  { key: "id", label: "ID Insentif" },
  { key: "guideId", label: "Nama Guide" },
  { key: "voucherId", label: "Nomor Rekening" },
  {
    key: "amount",
    label: "Jumlah Pendapatan",
    render: (value) => `Rp${formatCurrency(value as number)}`,
  },
  { key: "paymentMethod", label: "Metode Penarikan" },
  { key: "transactionDate", label: "Tanggal Penarikan" },
  { key: "transactionTime", label: "Waktu Penarikan" },
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
const withdraws = computed(() => withdrawStore.withdraws);
const pagination = computed(() => withdrawStore.pagination);
const filter = computed(() => withdrawStore.filter);
const isLoading = computed(() => withdrawStore.isLoading);
const error = computed(() => withdrawStore.error);

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
    batal: "bg-yellow-100 text-yellow-800",
    gagal: "bg-red-100 text-red-800",
    tertunda: "bg-gray-100 text-gray-800",
    masuk: "bg-blue-100 text-blue-800",
  };

  return statusClasses[status] || "";
};

const handleTableAction = (action: { type: string; row: any }) => {
  const { type, row } = action;

  switch (type) {
    case "view":
      viewWithdraw(row.id);
      break;
    case "edit":
      editWithdraw(row.id);
      break;
    case "delete":
      deleteWithdraw(row.id);
      break;
  }
};

const applyFilter = (newFilter: Partial<TransactionFilter>) => {
  withdrawStore.setFilter(newFilter);
};

const resetFilter = () => {
  withdrawStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  withdrawStore.setFilter({ page });
};

const viewWithdraw = (id: string) => {
  router.push(`/admin/transaction/withdraw/${id}`);
};

const editWithdraw = (id: string) => {
  router.push(`/admin/transaction/withdraw/${id}/edit`);
};

const deleteWithdraw = async (id: string) => {
  if (confirm("Apakah anda yakin ingin menghapus transaksi ini?")) {
    try {
      // Implement delete logic here
      await withdrawStore.loadWithdraws();
    } catch (error) {
      console.error("Error deleting withdraw:", error);
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await withdrawStore.loadWithdraws();
  } catch (error) {
    console.error("Error loading withdraws:", error);
  }
});
</script>
