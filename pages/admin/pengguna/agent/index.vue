<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Agen</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/pengguna/agent/create')"
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
            class="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>Tambah Agent</span>
        </button>
         <!-- Komponen ExportDropdown -->
         <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Agent"
          filename="Agent"
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
    <AgentFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />

    <!-- Data Table -->
    <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Agent</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="agents"
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
    
    <!-- Confirmation Modals -->
    <ConfirmationModal
      v-model:isOpen="isDeleteModalOpen"
      type="delete"
      :message="`Apakah anda yakin menghapus data ${selectedAgent?.name || ''}?`"
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
    
    <ConfirmationModal
      v-model:isOpen="isSuccessModalOpen"
      type="success"
      message="Data agen berhasil dihapus"
      :showButtons="false"
      @cancel="isSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAgentStore } from "~/store/agent";
import type { Agent } from "~/types/agent";
import AgentFilter from "~/components/agent/agent-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";
import ExportDropdown from "~/components/export-to.vue";  
// Router and stores
const router = useRouter();

const agentStore = useAgentStore();

// State
const showFilter = ref(false);
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const selectedAgent = ref<Agent | null>(null);

// Computed
const agents = computed(() => agentStore.agents);
const pagination = computed(() => agentStore.pagination);
const filter = computed(() => agentStore.filter);
const isLoading = computed(() => agentStore.isLoading);

// Table columns configuration
const tableColumns = [
  { key: "id", label: "ID Agen", sortable: true },
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
  { key: "name", label: "Nama Lengkap", sortable: true },
  { key: "phone", label: "Nomor Telepon", sortable: true },
  { key: "email", label: "Alamat Email", sortable: true },
  { key: "location", label: "Lokasi", sortable: true },
  {
    key: "hours",
    label: "Jam Operasional",
    sortable: true,
    render: (_: any, row: Agent) => ({
      component: "span",
      text: `${row.openHour} - ${row.closeHour}`,
    }),
  },
  { key: "createdAt", label: "Akun Dibuat", sortable: true, format: "date" },
  { key: "status", label: "Status Akun", sortable: true },
  { key: "actions", label: "Aksi" }
];

// Export columns
const exportColumns = computed(() => {
  return [
    { key: "id", header: "ID Agen" },
    { key: "name", header: "Nama Lengkap" },
    { key: "phone", header: "Nomor Telepon" },
    { key: "email", header: "Alamat Email" },
    { key: "location", header: "Lokasi" },
    { key: "hours", header: "Jam Operasional" },
    { key: "createdAt", header: "Akun Dibuat" },
    { key: "status", header: "Status Akun" }
  ];
});

// Export data
const exportData = computed(() => {
  return agents.value.map(agent => {
    const exportAgent = { ...agent };
    if (exportAgent.status) {
      exportAgent.status = exportAgent.status.charAt(0).toUpperCase() + exportAgent.status.slice(1);
    }
    exportAgent.openHour = `${agent.openHour} - ${agent.closeHour}`;
    return exportAgent;
  });
});

// Methods
const applyFilter = (newFilter: Partial<AgentFilter>) => {
  agentStore.setFilter(newFilter);
};

const resetFilter = () => {
  agentStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  agentStore.setFilter({ ...filter.value, page });
};

const handleAction = async ({ type, row }: { type: string; row: Agent }) => {
  const agent = row;

  switch (type) {
    case "view":
      await router.push(`/admin/pengguna/agent/${agent.id}`);
      break;
    case "edit":
      await router.push(`/admin/pengguna/agent/${agent.id}/edit`);
      break;
    case "delete":
      selectedAgent.value = agent;
      isDeleteModalOpen.value = true;
      break;
  }
};

// Confirm delete handler
const confirmDelete = async () => {
  if (selectedAgent.value) {
    try {
      await agentStore.deleteAgent(selectedAgent.value.id);
      isDeleteModalOpen.value = false;
      isSuccessModalOpen.value = true;
      setTimeout(() => {
        isSuccessModalOpen.value = false;
      }, 2000);
    } catch (error) {
      console.error("Error deleting agent:", error);
      isDeleteModalOpen.value = false;
    }
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await agentStore.loadAgents();
  } catch (error) {
    console.error("Error loading agents:", error);
  }
});
</script>