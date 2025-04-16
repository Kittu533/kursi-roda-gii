<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Data Pengembaliann</h2>
      </div>
      <div class="flex items-center gap-2">
        <!-- Komponen ExportDropdown -->
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Pengembalian"
          filename="Complaints"
        />
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
    <ComplaintFilter
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
        <UiTable
          :data="complaints"
          :columns="columns"
          :loading="isLoading"
          @action="handleAction"
        />

        <UiPagination
          v-if="pagination && pagination.totalPages > 1"
          :current-page="pagination.currentPage"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          :items-per-page="pagination.itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin ingin menghapus data pengembalian dengan ID ${selectedComplaint?.complaintId || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Data pengembalian berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useComplaintStore } from "~/store/complaint";
import { useNotification } from "~/composables/use-notification";
import type { Complaint } from "~/types/complaint";
import ComplaintFilter from "~/components/complaint/complaint-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";

// Router and stores
const router = useRouter();
const complaintStore = useComplaintStore();
const notification = useNotification();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedComplaint = ref<Complaint | null>(null);

// Computed
const complaints = computed(() => complaintStore.complaints);
const pagination = computed(() => complaintStore.pagination);
const filter = computed(() => complaintStore.filter);
const isLoading = computed(() => complaintStore.isLoading);

// Table columns configuration
const columns = [
  { key: "complaintId", label: "ID Komplain" },
  { key: "customerId", label: "ID Pelanggan" },
  { key: "transactionId", label: "ID Transaksi" },
  { key: "type", label: "Jenis" },
  { key: "description", label: "Deskripsi" },
  { key: "startDate", label: "Tanggal Dibuat" },
  { key: "completionDate", label: "Tanggal Diperbarui" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        open: "bg-orange-100 text-orange-800",
        forwarded: "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800"
      };
      
      const status = value.toLowerCase();
      return {
        component: "span",
        class: `px-2 py-1 rounded-md text-xs font-medium ${
          statusClasses[status] || ""
        }`,
        text: value,
      };
    },
  },
  { key: "actions", label: "Aksi" }
];

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "complaintId", header: "ID Komplain" },
    { key: "customerId", header: "ID Pelanggan" },
    { key: "transactionId", header: "ID Transaksi" },
    { key: "type", header: "Jenis" },
    { key: "description", header: "Deskripsi" },
    { key: "startDate", header: "Tanggal Dibuat" },
    { key: "completionDate", header: "Tanggal Diperbarui" },
    { key: "status", header: "Status" }
  ];
});

// Export data
const exportData = computed(() => {
  return complaints.value;
});

// Methods
const applyFilter = (newFilter: Partial<ComplaintFilter>) => {
  complaintStore.setFilter(newFilter);
};

const resetFilter = () => {
  complaintStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  complaintStore.setFilter({ page });
};

const handleAction = async ({ type, row }: { type: string; row: Complaint }) => {
  const complaintData = row;

  switch (type) {
    case "view":
      await router.push(`/admin/complaint/${complaintData.id}`);
      break;
    case "edit":
      await router.push(`/admin/complaint/${complaintData.id}/edit`);
      break;
    case "delete":
      selectedComplaint.value = complaintData;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedComplaint.value) {
    try {
      await complaintStore.deleteComplaint(selectedComplaint.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await complaintStore.loadComplaints();
  } catch (error) {
    console.error("Error loading complaints:", error);
  }
});
</script>