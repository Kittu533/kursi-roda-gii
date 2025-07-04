  <template>
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">Data Maintenance</h2>
        <div class="flex items-center gap-2">
          <ExportDropdown :data="exportData" :columns="exportColumns" title="Data Maintenance" filename="maintenance" />
          <button class="bg-white border px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
            @click="showFilter = !showFilter">
            <Filter class="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <DataTableFilter v-if="showFilter" :filter="filter" :fields="filterFields" @apply="applyFilter"
        @reset="resetFilter" />

      <data-table title="Data Maintenance" :headers="columns" :items="maintenances" :pagination="enhancedPagination"
        :is-loading="isLoading" :show-export="true" :export-columns="exportColumns" :export-data="exportData"
        export-filename="maintenance" :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
        :default-rows-per-page="itemsPerPage" @action="handleAction" @page-change="handlePageChange"
        @rows-per-page-change="handleRowsPerPageChange" />
    </div>
  </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMaintenanceStore } from '~/store/maintenance';
import type { MaintenanceRecord } from '~/types/maintenance';
import { Plus, Filter } from 'lucide-vue-next';
import ExportDropdown from '~/components/export-to.vue';
import DataTableFilter from '~/components/data-table-filter.vue';
import type { TableHeader, ExportColumn, TablePagination, TableItem } from '~/components/data-table.vue';

const router = useRouter();
const maintenanceStore = useMaintenanceStore();

const showFilter = ref(false);
const itemsPerPage = ref(10);

const isLoading = computed(() => maintenanceStore.isLoading);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  await maintenanceStore.loadMaintenance();
};

const maintenances = computed<TableItem[]>(() =>
  maintenanceStore.maintenanceRecords.map((m, index) => {
    const statusLabel = m.maintenance_status.status === 'completed' ? 'Selesai' : 'Perbaikan';

    return {
      id: m.id,
      serialNumber: m.wheelchair.serial_number,
      description: m.issue_description || '',
      startDate: new Date(m.start_date).toLocaleDateString("id-ID"),
      endDate: m.end_date ? new Date(m.end_date).toLocaleDateString("id-ID") : '-',
      status: statusLabel,
      actions: ''
    };
  })
);


const pagination = computed(() => maintenanceStore.pagination);
const filter = computed(() => maintenanceStore.filter);

const enhancedPagination = computed<TablePagination>(() => {
  if (!pagination.value) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: maintenances.value.length,
      itemsPerPage: itemsPerPage.value,
    };
  }
  return {
    currentPage: pagination.value.currentPage,
    totalPages: pagination.value.totalPages,
    totalItems: pagination.value.total,
    itemsPerPage: pagination.value.itemsPerPage,
  };
});

const columns: TableHeader[] = [

  { key: 'serialNumber', label: 'Nomor Seri' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'startDate', label: 'Tanggal Pemeliharaan' },
  { key: 'endDate', label: 'Tanggal Selesai Pemeliharaan' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => {
      const className = value === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
      return {
        component: 'span',
        text: value,
        class: `px-2 py-1 rounded-full text-sm ${className}`
      };
    }
  },
  { key: 'actions', label: 'Aksi' }
];

const exportColumns = computed<ExportColumn[]>(() => [
  { key: 'id', header: 'ID Pemeliharaan' },
  { key: 'model', header: 'Model' },
  { key: 'serialNumber', header: 'Nomor Seri' },
  { key: 'description', header: 'Deskripsi' },
  { key: 'startDate', header: 'Tanggal Pemeliharaan' },
  { key: 'endDate', header: 'Tanggal Selesai Pemeliharaan' },
  { key: 'status', header: 'Status' }
]);


const exportData = computed(() => maintenances.value);

const applyFilter = (newFilter: any) => {
  maintenanceStore.setFilter({
    ...filter.value,
    ...newFilter,
    page: 1,
    itemsPerPage: itemsPerPage.value,
  });
};

const resetFilter = () => {
  maintenanceStore.resetFilter();
  maintenanceStore.setFilter({ itemsPerPage: itemsPerPage.value });
  showFilter.value = false;
};

const handlePageChange = (page: number) => {
  maintenanceStore.setFilter({ ...filter.value, page });
};

const handleRowsPerPageChange = (size: number) => {
  itemsPerPage.value = size;
  maintenanceStore.setFilter({ page: 1, itemsPerPage: size });
};

const handleAction = ({ type, row }: { type: string; row: MaintenanceRecord }) => {
  switch (type) {
    case 'view':
      router.push(`/admin/maintenance/${row.id}`);
      break;
    case 'edit':
      router.push(`/admin/maintenance/${row.id}/edit`);
      break;
    case 'delete':
      if (confirm(`Hapus maintenance dengan ID ${row.id}?`)) {
        maintenanceStore.deleteMaintenance(row.id);
      }
      break;
  }
};

const filterFields = [
  { key: 'startDate', label: 'Tanggal Mulai', type: 'date' },
  { key: 'endDate', label: 'Tanggal Selesai', type: 'date' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['maintenances', 'completed'],
  },
];
</script>
