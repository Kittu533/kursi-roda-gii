<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Komplain</h2>
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
    <ComplaintFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <data-table
      title="Data Komplain"
      :headers="columns"
      :items="complaints"
      :pagination="enhancedPagination"
      :is-loading="isLoading"
      :show-export="true"
      :export-columns="exportColumns"
      :export-data="exportData"
      export-filename="complaints-data"
      :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
      :default-rows-per-page="itemsPerPage"
      @action="handleAction"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
      @delete="handleDelete"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="isDeleteModalOpen"
      title="Delete Complaint"
      message="Are you sure you want to delete this complaint? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />

    <!-- Success Modal -->
    <ConfirmationModal
      v-if="isSuccessModalOpen"
      title="Success"
      message="Complaint has been deleted successfully."
      confirm-text="OK"
      :show-cancel="false"
      @confirm="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useComplaintStore } from "~/store/complaint";
import type { Complaint } from "~/types/complaint";
import type {
  TableHeader,
  ExportColumn,
  TableItem,
  TablePagination,
} from "~/components/data-table.vue";
import ExportDropdown from "~/components/export-to.vue";
import ComplaintFilter from "~/components/complaint/complaint-filter.vue";
// Router and stores
const router = useRouter();
const complaintStore = useComplaintStore();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedComplaint = ref<Complaint | null>(null);
const isLoading = ref(false);
const itemsPerPage = ref(10); // Default items per page

// Initialize from store filter if available
onMounted(() => {
  if (complaintStore.filter.itemsPerPagePage) {
    itemsPerPage.value = complaintStore.filter.itemsPerPage;
  }
});

// Load data function
const loadData = async () => {
  isLoading.value = true;
  try {
    await complaintStore.loadComplaints();
  } catch (error) {
    console.error("Error loading complaints:", error);
  } finally {
    isLoading.value = false;
  }
};

// Computed
const complaints = computed<TableItem[]>(() => {
  // Make sure we're returning data that matches the TableItem interface
  return complaintStore.complaints.map((complaint) => ({
    ...complaint,
    // Ensure all properties are properly typed
    id: complaint.id || "",
    complaintId: complaint.complaintId || "",
    customerId: complaint.customerId || "",
    transactionId: complaint.transactionId || "",
    type: complaint.type || "",
    description: complaint.description || "",
    startDate: complaint.startDate || "",
    completionDate: complaint.completionDate || "",
    status: complaint.status || "",
  }));
});

const pagination = computed(() => complaintStore.pagination);
const filter = computed(() => complaintStore.filter);

// Enhanced pagination with items per page
const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: complaints.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }

  return {
    ...pagination.value,
    itemsPerPage: itemsPerPage.value,
  };
});

// Table columns configuration
const columns: TableHeader[] = [
  { key: "complaintId", label: "ID Komplain" },
  { key: "customerId", label: "ID Pelanggan" },
  { key: "transactionId", label: "ID Transaksi" },
  { key: "type", label: "Jenis" },
  { key: "description", label: "Deskripsi" },
  { key: "startDate", label: "Tanggal Dibuat", format: "date" },
  { key: "completionDate", label: "Tanggal Diperbarui", format: "date" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        open: "bg-orange-100 text-orange-800",
        forwarded: "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
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
  { key: "actions", label: "Aksi" },
];

// Export columns
const exportColumns = computed<ExportColumn[]>(() => {
  return [
    { key: "complaintId", header: "ID Komplain" },
    { key: "customerId", header: "ID Pelanggan" },
    { key: "transactionId", header: "ID Transaksi" },
    { key: "type", header: "Jenis" },
    { key: "description", header: "Deskripsi" },
    { key: "startDate", header: "Tanggal Dibuat" },
    { key: "completionDate", header: "Tanggal Diperbarui" },
    { key: "status", header: "Status" },
  ];
});

// Export data
const exportData = computed(() => {
  return complaints.value;
});

// Methods
const applyFilter = (newFilter: Partial<ComplaintFilter>) => {
  complaintStore.setFilter({
    ...newFilter,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  complaintStore.resetFilter();
  // Keep the current itemsPerPage value after reset
  complaintStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  complaintStore.setFilter({
    page,
    itemsPerPage: itemsPerPage.value,
  });
};

const handleRowsPerPageChange = (size: number) => {
  console.log("Rows per page changed to:", size);
  itemsPerPage.value = size;

  // Reset to page 1 when changing page size and update the store
  complaintStore.setFilter({
    page: 1,
    itemsPerPage: size,
  });
};

const handleAction = ({ type, row }: { type: string; row: Complaint }) => {
  const complaintData = row;

  switch (type) {
    case "view":
      router.push(`/admin/complaint/${complaintData.id}`);
      break;
    case "edit":
      router.push(`/admin/complaint/${complaintData.id}/edit`);
      break;
  }
};

// Handle delete from data-table component
const handleDelete = (row: Complaint) => {
  selectedComplaint.value = row;
  isDeleteModalOpen.value = true;
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
  await loadData();
});
</script>
