<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Guide</h2>
      </div>
      <div class="flex items-center gap-2">
        <ExportDropdown
          :data="exportData"
          :columns="exportColumns"
          title="Data Guide"
          filename="Guide"
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
    <GuideFilter
      v-if="showFilter"
      :filter="filter"
      @apply="applyFilter"
      @reset="resetFilter"
      @close="showFilter = false"
    />


     <!-- Data Table -->
     <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Data Guide</h3>
      </div>
      <div class="p-4">
        <UiTable
          :data="guides"
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

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGuideStore } from "~/store/guide";
import GuideFilter from "~/components/guide/guide-filter.vue";
import UiTable from "~/components/ui-table.vue";
import UiPagination from "~/components/ui-pagination.vue";
import ExportDropdown from "~/components/export-to.vue";
import type { Guide } from "~/types/guide";

// Router and stores
const router = useRouter();
const guideStore = useGuideStore();

// State
const showFilter = ref(false);

// Computed
const guides = computed(() => guideStore.guides);
const pagination = computed(() => guideStore.pagination);
const filter = computed(() => guideStore.filter);
const isLoading = computed(() => guideStore.isLoading);

// Table columns configuration
// Table columns configuration
const tableColumns = [
  { key: "id", label: "ID Guide", sortable: true },
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
  { key: "ktp", label: "KTP", sortable: true },
  { key: "accountNumber", label: "Nomor Rekening", sortable: true },
  { key: "createdAt", label: "Akun Dibuat", sortable: true, format: "date" },
  { key: "status", label: "Status Akun", sortable: true },
  { key: "actions", label: "Aksi" }
];

// Export columns configuration 
const exportColumns = computed(() => {
  return [
    { key: "id", header: "ID Guide" },
    { key: "name", header: "Nama Lengkap" },
    { key: "phone", header: "Nomor Telepon" },
    { key: "ktp", header: "KTP" },
    { key: "accountNumber", header: "Nomor Rekening" },
    { key: "createdAt", header: "Akun Dibuat" },
    { key: "status", header: "Status Akun" }
  ];
});

// Export data formatting
const exportData = computed(() => {
  return guides.value.map(guide => {
    const exportGuide = { ...guide };
    if (exportGuide.status) {
      exportGuide.status = exportGuide.status.charAt(0).toUpperCase() + exportGuide.status.slice(1);
    }
    return exportGuide;
  });
});

// Methods
const applyFilter = (newFilter) => {
  guideStore.setFilter(newFilter);
};

const resetFilter = () => {
  guideStore.resetFilter();
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  guideStore.setFilter({ ...filter.value, page });
};

const handleAction = async ({ type, row }: { type: string; row: Guide }) => {
  const guide = row;

  switch (type) {
    case "view":
      await router.push(`/admin/pengguna/guide/${guide.id}`);
      break;
    case "edit":
      await router.push(`/admin/pengguna/guide/${guide.id}/edit`);
      break;
    case "delete":
      if (confirm(`Apakah anda yakin ingin menghapus ${guide.name}?`)) {
        try {
          await guideStore.deleteGuide(guide.id);
        } catch (error) {
          console.error("Error deleting guide:", error);
        }
      }
      break;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await guideStore.loadGuides();
  } catch (error) {
    console.error("Error loading guides:", error);
  }
});
</script>
