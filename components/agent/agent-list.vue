<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Agen</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
          @click="router.push('/admin/pengguna/agent/new')"
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
          :columns="columns"
          :loading="isLoading"
          @action="handleAction"
          :rows-per-page="10"
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
import { useNotification } from "~/composables/use-notification";
import type { Agent } from "~/types/agent";
import AgentFilter from "~/components/agent/agent-filter.vue";
import UiTable from "~/components/ui/ui-table.vue";
import UiPagination from "~/components/ui/ui-pagination.vue";
import ConfirmationModal from "~/components/ui/modals/confirmation-modal.vue";

// Router and stores
const router = useRouter();
const agentStore = useAgentStore();
const notification = useNotification();

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
const columns = [
  { key: "id", label: "ID Agen" },
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
  { key: "name", label: "Nama Lengkap" },
  { key: "phone", label: "Nomor Telepon" },
  { key: "email", label: "Alamat Email" },
  { key: "location", label: "Lokasi" },
  {
    key: "hours",
    label: "Jam Operasional",
    render: (_: any, row: Agent) => ({
      component: "span",
      text: `${row.openHour} - ${row.closeHour}`,
    }),
  },
  { key: "createdAt", label: "Akun Dibuat" },
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
const applyFilter = (newFilter: Partial<AgentFilter>) => {
  agentStore.setFilter(newFilter);
};

const resetFilter = () => {
  agentStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  agentStore.setFilter({ page });
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
      // Open delete confirmation modal instead of using browser confirm
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
      
      // Show success modal
      isSuccessModalOpen.value = true;
      
      // Close success modal after 2 seconds
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