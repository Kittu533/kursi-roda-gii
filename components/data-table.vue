<template>
  <div class="bg-white rounded-lg shadow overflow-hidden mt-6">
    <div class="p-4 bg-[#EFF1EF] border-b flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>

      <!-- Export dropdown and rows per page selector -->
      <div class="flex items-center space-x-4">
        <div v-if="showRowsPerPage" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">Rows per page:</span>
          <select
            v-model="localRowsPerPage"
            class="border border-gray-300 rounded-md text-sm py-1 px-2 bg-white"
            @change="handleRowsPerPageChange"
          >
            <option
              v-for="size in rowsPerPageOptions"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto relative">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-white">
          <tr>
            <!-- Row number column -->
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            >
              No.
            </th>
            <th
              v-for="header in headers.filter((h) => h.key !== 'actions')"
              :key="header.key"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header.label }}
            </th>
            <!-- Pinned action column -->
            <th
              v-if="hasActionsColumn"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-white shadow-l z-10 w-24"
            >
              {{ actionsHeader.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!isLoading" class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(item, index) in items"
            :key="getItemKey(item, index)"
            class="hover:bg-gray-50"
          >
            <!-- Row number cell -->
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ calculateRowNumber(index) }}
            </td>
            <td
              v-for="header in headers.filter((h) => h.key !== 'actions')"
              :key="header.key"
              class="px-4 py-3 whitespace-nowrap text-sm"
            >
              <!-- Use slot for custom cell rendering if provided -->
              <slot
                :name="`cell-${header.key}`"
                :item="item"
                :index="index"
                :value="getItemValue(item, header.key)"
              >
                <!-- Default cell rendering -->
                <template v-if="header.key === 'status' && header.render">
                  <component
                    :is="
                      header.render(String(getItemValue(item, header.key)))
                        .component || 'span'
                    "
                    :class="
                      header.render(String(getItemValue(item, header.key)))
                        .class
                    "
                  >
                    {{
                      header.render(String(getItemValue(item, header.key))).text
                    }}
                  </component>
                </template>
                <template v-else-if="header.key === 'status' && statusConfig">
                  <span :class="getStatusClass(getItemValue(item, header.key))">
                    {{ getItemValue(item, header.key) }}
                  </span>
                </template>
                <template v-else>
                  {{
                    formatValue(getItemValue(item, header.key), header.format)
                  }}
                </template>
              </slot>
            </td>
            <!-- Pinned action column -->
            <td
              v-if="hasActionsColumn"
              class="px-4 py-3 whitespace-nowrap text-sm sticky right-0 bg-white shadow-l z-10"
            >
              <div class="flex space-x-2 justify-center">
                <slot name="actions" :item="item" :index="index">
                  <button
                    v-if="showViewAction"
                    class="text-blue-500 hover:text-blue-700"
                    @click="handleAction('view', item)"
                    title="View"
                  >
                    <NuxtIcon
                      name="material-symbols:visibility-rounded"
                      class="h-5 w-5"
                    />
                  </button>
                  <button
                    v-if="showEditAction"
                    class="text-yellow-500 hover:text-yellow-700"
                    @click="handleAction('edit', item)"
                    title="Edit"
                  >
                    <NuxtIcon
                      name="material-symbols:edit-square-outline"
                      class="h-5 w-5"
                    />
                  </button>
                  <button
                    v-if="showDeleteAction"
                    class="text-red-500 hover:text-red-700"
                    @click="openDeleteModal(item)"
                    title="Delete"
                  >
                    <NuxtIcon name="material-symbols:delete" class="h-5 w-5" />
                  </button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              :colspan="hasActionsColumn ? headers.length + 1 : headers.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              <div class="flex flex-col items-center justify-center">
                <NuxtIcon
                  name="loader"
                  class="h-8 w-8 animate-spin text-primary-500 mb-2"
                />
                <span>Loading data...</span>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="!isLoading && items.length === 0">
          <tr>
            <td
              :colspan="hasActionsColumn ? headers.length + 1 : headers.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Pagination UI -->
    <div class="px-4 py-3 border-t border-gray-200">
      <div
        v-if="showPagination && pagination && totalPages > 1"
        class="flex justify-between items-center"
      >
        <div class="text-sm text-muted-foreground">
          Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
          (Page {{ currentPage }} of {{ totalPages }})
        </div>

        <div class="flex space-x-1">
          <button
            class="px-2 py-1 rounded-md text-sm border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="$emit('page-change', currentPage - 1)"
          >
            <NuxtIcon name="material-symbols:chevron-left" class="w-4 h-4" />
          </button>

          <button
            v-for="page in paginationRange"
            :key="page"
            class="px-3 py-1 rounded-md text-sm border bg-transparent hover:bg-muted"
            :class="{ 'border-primary text-primary': page === currentPage }"
            :disabled="page === '...'"
            @click="page !== '...' && $emit('page-change', Number(page))"
          >
            {{ page }}
          </button>

          <button
            class="px-2 py-1 rounded-md text-sm border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="$emit('page-change', currentPage + 1)"
          >
            <NuxtIcon name="material-symbols:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="isDeleteModalOpen = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { getPaginationRange } from "~/utils/helpers";

// Define proper TypeScript interfaces
export interface TableHeader {
  key: string;
  label: string;
  format?: string;
  render?: (value: string) => {
    component: string;
    class: string;
    text: string;
  };
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export interface StatusConfig {
  [key: string]: string;
}

export interface ExportColumn {
  key: string;
  header: string;
}

// Define more specific types for table data
export type TableItemValue = string | number | boolean | null | undefined;
export interface TableItem {
  [key: string]: TableItemValue | Record<string, TableItemValue>;
}

const props = defineProps({
  title: {
    type: String,
    default: "Data Table",
  },
  headers: {
    type: Array as () => TableHeader[],
    required: true,
  },
  items: {
    type: Array as () => TableItem[],
    required: true,
  },
  itemKey: {
    type: String,
    default: "id",
  },
  pagination: {
    type: Object as () => TablePagination | null,
    default: null,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  paginationText: {
    type: String,
    default: "",
  },
  statusConfig: {
    type: Object as () => StatusConfig | null,
    default: null,
  },
  showViewAction: {
    type: Boolean,
    default: true,
  },
  showEditAction: {
    type: Boolean,
    default: true,
  },
  showDeleteAction: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showExport: {
    type: Boolean,
    default: false,
  },
  exportColumns: {
    type: Array as () => ExportColumn[],
    default: () => [],
  },
  exportData: {
    type: Array as () => TableItem[],
    default: () => [],
  },
  exportFilename: {
    type: String,
    default: "export",
  },
  // New props for rows per page functionality
  showRowsPerPage: {
    type: Boolean,
    default: true,
  },
  rowsPerPageOptions: {
    type: Array as () => number[],
    default: () => [5, 10, 20, 30, 50, 100],
  },
  defaultRowsPerPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits([
  "view",
  "edit",
  "delete",
  "action",
  "page-change",
  "rows-per-page-change",
]);

// Local state
const localRowsPerPage = ref(props.defaultRowsPerPage);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref<TableItem | null>(null);

// Initialize localRowsPerPage from pagination if available
onMounted(() => {
  if (props.pagination?.itemsPerPage) {
    localRowsPerPage.value = props.pagination.itemsPerPage;
  }
});

// Watch for changes in pagination from parent
watch(
  () => props.pagination?.itemsPerPage,
  (newValue) => {
    if (newValue && newValue !== localRowsPerPage.value) {
      localRowsPerPage.value = newValue;
    }
  },
  { immediate: true }
);

// Get current page and total pages from pagination prop
const currentPage = computed(() => props.pagination?.currentPage || 1);
const totalPages = computed(() => props.pagination?.totalPages || 1);
const totalItems = computed(
  () => props.pagination?.totalItems || props.items.length
);

// Calculate start and end items for pagination text
const startItem = computed(() => {
  if (props.items.length === 0) return 0;
  return (
    (currentPage.value - 1) *
      (props.pagination?.itemsPerPage || localRowsPerPage.value) +
    1
  );
});

const endItem = computed(() => {
  const end =
    startItem.value +
    (props.pagination?.itemsPerPage || localRowsPerPage.value) -
    1;
  return Math.min(end, totalItems.value);
});

// Check if we have an actions column
const hasActionsColumn = computed(() => {
  return props.headers.some((header) => header.key === "actions");
});

// Get the actions header if it exists
const actionsHeader = computed(() => {
  return (
    props.headers.find((header) => header.key === "actions") || {
      key: "actions",
      label: "Actions",
    }
  );
});

// Get pagination range using the helper function
const paginationRange = computed(() => {
  return getPaginationRange(currentPage.value, totalPages.value);
});

// Calculate row number based on pagination
function calculateRowNumber(index: number): number {
  if (!props.pagination) {
    return index + 1;
  }

  const itemsPerPage = props.pagination.itemsPerPage || localRowsPerPage.value;
  return (currentPage.value - 1) * itemsPerPage + index + 1;
}

function handleRowsPerPageChange(): void {
  console.log("Rows per page changed to:", localRowsPerPage.value);
  emit("rows-per-page-change", localRowsPerPage.value);
}

function getItemKey(item: TableItem, index: number): string | number {
  return (item[props.itemKey] as string | number) || index;
}

function getItemValue(item: TableItem, key: string): TableItemValue {
  if (key.includes(".")) {
    return key.split(".").reduce((obj: unknown, k: string) => {
      if (typeof obj === "object" && obj !== null && k in obj) {
        return (obj as Record<string, unknown>)[k];
      }
      return undefined;
    }, item) as TableItemValue;
  }

  return item[key];
}

function formatValue(value: TableItemValue, format?: string): string {
  if (value === undefined || value === null) return "";

  if (format === "date" && value) {
    try {
      return new Date(String(value)).toLocaleDateString("id-ID");
    } catch (e) {
      return String(value);
    }
  }

  if (format === "currency" && value) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(value));
    } catch (e) {
      return String(value);
    }
  }

  if (format === "phone" && value) {
    // Format phone number: +628xxx to +62 8xxx
    return String(value).replace(/(\+\d{2})(\d+)/, "$1 $2");
  }

  return String(value);
}

const statusClass: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-green-100", text: "text-green-800" },
  failed: { bg: "bg-red-100", text: "text-red-800" },
  refunded: { bg: "bg-gray-100", text: "text-gray-800" },
  aktif: { bg: "bg-green-100", text: "text-green-800" },
  nonaktif: { bg: "bg-gray-100", text: "text-gray-800" },
  dibekukan: { bg: "bg-red-100", text: "text-red-800" },
  menunggu: { bg: "bg-orange-100", text: "text-orange-800" },
  perbaikan: { bg: "bg-red-100", text: "text-red-800" },
  tersedia: { bg: "bg-green-100", text: "text-green-800" },
  tersewa: { bg: "bg-gray-100", text: "text-gray-800" },
  expired: { bg: "bg-red-100", text: "text-red-800" },
  open: { bg: "bg-orange-300", text: "text-orange-800" },
  forwarded: { bg: "bg-gray-100", text: "text-gray-800" },
  resolved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
  tertunda: { bg: "bg-gray-100", text: "text-gray-800" },
  berhasil: { bg: "bg-green-100", text: "text-green-800" },
  gagal: { bg: "bg-red-100", text: "text-red-800" },
  batal: { bg: "bg-orange-300", text: "text-orange-800" },
  ditolak: { bg: "bg-red-100", text: "text-red-800" },
};

function getStatusClass(status: TableItemValue): string {
  if (!status) {
    return "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800";
  }

  const statusStr = String(status).toLowerCase();

  const classInfo = statusClass[statusStr];
  if (classInfo) {
    return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classInfo.bg} ${classInfo.text}`;
  }

  // fallback default
  return "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800";
}

function handleAction(type: string, item: TableItem): void {
  if (type === "view") {
    emit("view", item);
  } else if (type === "edit") {
    emit("edit", item);
  } else if (type === "delete") {
    openDeleteModal(item);
  }

  emit("action", { type, row: item });
}

// Delete modal functions
function openDeleteModal(item: TableItem): void {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
}

function confirmDelete(): void {
  if (itemToDelete.value) {
    emit("delete", itemToDelete.value);
    emit("action", { type: "delete", row: itemToDelete.value });
    isDeleteModalOpen.value = false;
    itemToDelete.value = null;
  }
}
</script>

<style scoped>
/* Add shadow to the left side of the sticky column */
.shadow-l {
  box-shadow: -4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

/* Ensure the table has proper layout for sticky columns */
table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

/* Fix for sticky positioning */
.sticky {
  position: sticky;
  z-index: 10;
}

/* Pagination styles */
.text-muted-foreground {
  color: #6b7280;
}

.bg-muted {
  background-color: #f3f4f6;
}

.border-primary {
  border-color: #ff9100;
}

.text-primary {
  color: #000000;
}

/* Add these color definitions to ensure status colors are properly loaded */
.bg-green-100 {
  background-color: #dcfce7;
}
.text-green-800 {
  color: #166534;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-800 {
  color: #991b1b;
}
.bg-blue-100 {
  background-color: #dbeafe;
}
.text-blue-800 {
  color: #1e40af;
}
.bg-orange-100 {
  background-color: #ffedd5;
}
.text-orange-800 {
  color: #9a3412;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.text-gray-800 {
  color: #1f2937;
}
</style>
