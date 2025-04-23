<template>
  <div class="data-table-container">
    <!-- Table Controls -->
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-3"
    >
      <!-- Search Filter -->
      <div class="relative w-full md:w-64">
        <input
          v-model="globalFilter"
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
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
            class="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!table.getRowModel().rows.length"
      class="text-center py-8 text-muted-foreground bg-muted/20 rounded-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-database-x mx-auto mb-2"
      >
        <path d="M12 6c4.97 0 9-1.79 9-4s-4.03-4-9-4-9 1.79-9 4 4.03 4 9 4Z" />
        <path d="M21 12c0 2.21-4.03 4-9 4s-9-1.79-9-4" />
        <path d="M21 6v6" />
        <path d="M3 6v6" />
        <path d="m14 15-4 4" />
        <path d="m10 15 4 4" />
      </svg>
      <p>No data available</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto border rounded-md relative">
      <table class="w-full border-collapse">
        <thead class="bg-muted/30">
          <tr>
            <th
              class="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12"
            >
              No
            </th>
            <th
              v-for="header in table.getHeaderGroups()[0].headers"
              :key="header.id"
              class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
              :class="[
                {
                  'cursor-pointer hover:bg-muted/50':
                    header.column.getCanSort(),
                },
                header.id === 'actions'
                  ? 'sticky right-0 z-10 hover:bg-muted bg-muted shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)]'
                  : '',
              ]"
              @click="
                header.column.getCanSort()
                  ? header.column.toggleSorting()
                  : null
              "
            >
              <div class="flex items-center gap-1">
                {{ header.column.columnDef.header }}
                <span v-if="header.column.getCanSort()" class="inline-flex">
                  <svg
                    v-if="header.column.getIsSorted() === 'asc'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-up"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <svg
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevrons-up-down opacity-30"
                  >
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in table.getRowModel().rows"
            :key="row.id"
            class="border-b hover:bg-muted/30 transition-colors"
          >
            <td class="px-4 py-3 text-sm w-12">
              {{ index + 1 }}
            </td>
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 text-sm"
              :class="[
                cell.column.id === 'actions'
                  ? 'sticky right-0  z-10 bg-white hover:bg-white shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)] hover:bg-muted/30'
                  : '',
              ]"
            >
              <!-- Special handling for action column -->
              <template v-if="cell.column.id === 'actions'">
                <div class="flex space-x-2 z-10">
                  <button
                    @click="emitAction('view', row.original)"
                    class="p-1 text-[#2D59D4] hover:text-primary/80 transition-colors"
                    title="View"
                  >
                    <span class="sr-only">View</span>
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
                      class="lucide lucide-eye"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    @click="emitAction('edit', row.original)"
                    class="p-1 text-[#FF780A] hover:text-amber-700 transition-colors"
                    title="Edit"
                  >
                    <span class="sr-only">Edit</span>
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
                      class="lucide lucide-pencil"
                    >
                      <path
                        d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                      />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(row.original)"
                    class="p-1 text-red-600 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <span class="sr-only">Delete</span>
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
                      class="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              </template>
              <!-- Status column with badge -->
              <template v-else-if="cell.column.id === 'status'">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                  :class="getStatusClasses(cell.getValue())"
                >
                  {{ cell.getValue() }}
                </span>
              </template>
              <!-- Default cell rendering -->
              <template v-else>
                {{ cell.getValue() }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
        <p class="mb-6">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-md hover:bg-muted/30"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  type SortingState,
} from "@tanstack/vue-table";

// Define types
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  format?: string;
  render?: (value: unknown, row?: Record<string, unknown>) => RenderResult;
}

type RenderResult =
  | string
  | {
      component?: string;
      text?: string;
      slots?: Record<string, string>;
      class?: string;
      [key: string]: unknown;
    };

// Status color mapping
interface StatusColorMap {
  [key: string]: {
    bg: string;
    text: string;
  };
}

// Props with proper types
const props = defineProps<{
  data: Record<string, unknown>[];
  columns: TableColumn[];
  loading?: boolean;
  initialSortKey?: string;
  initialSortOrder?: "asc" | "desc";
  statusColorMap?: StatusColorMap;
}>();

// Emits with proper types
const emit = defineEmits<{
  (
    e: "action",
    action: { type: string; row: Record<string, unknown> }
  ): void | Promise<void>;
  (e: "sort", sortData: { key: string; order: "asc" | "desc" }): void;
}>();

// State
const showDeleteModal = ref(false);
const rowToDelete = ref<Record<string, unknown> | null>(null);
const globalFilter = ref("");

// Sorting state
const sorting = ref<SortingState>([]);

// Default status color mapping
const defaultStatusColorMap: StatusColorMap = {
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

// Combine default and custom status color mappings
const statusColorMap = computed(() => {
  return { ...defaultStatusColorMap, ...props.statusColorMap };
});

// Get CSS classes for a status value
const getStatusClasses = (status: unknown): string => {
  if (status === null || status === undefined) return "";

  const statusKey = String(status).toLowerCase();
  const colorConfig = statusColorMap.value[statusKey] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
  };

  return `${colorConfig.bg} ${colorConfig.text}`;
};

// TanStack Table setup
const columnHelper = createColumnHelper<Record<string, unknown>>();

// Convert columns prop to TanStack column definitions
const tableColumns = computed(() => {
  return props.columns.map((column) => {
    return columnHelper.accessor(column.key, {
      id: column.key,
      header: column.label,
      cell: (info) => {
        const value = info.getValue();

        if (column.render) {
          const renderResult = column.render(value, info.row.original);
          if (typeof renderResult === "string") {
            return renderResult;
          }
          return renderResult.text || String(value);
        }

        if (column.format) {
          return formatCellValue(value, column.format);
        }

        return value;
      },
      enableSorting: column.sortable,
    });
  });
});

if (props.initialSortKey && props.initialSortOrder) {
  sorting.value = [
    { id: props.initialSortKey, desc: props.initialSortOrder === "desc" },
  ];
}

// Create the table instance without pagination
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return tableColumns.value;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;

    // Emit sort event
    if (sorting.value.length > 0) {
      const { id, desc } = sorting.value[0];
      emit("sort", { key: id, order: desc ? "desc" : "asc" });
    }
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === "function" ? updater(globalFilter.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  debugTable: process.env.NODE_ENV === "development",
});

// Format cell values based on format type
const formatCellValue = (value: unknown, format?: string): string => {
  if (value === null || value === undefined) return "";

  if (!format) return String(value);

  switch (format) {
    case "date":
      return new Date(String(value)).toLocaleDateString();
    case "datetime":
      return new Date(String(value)).toLocaleString();
    case "currency":
      return typeof value === "number"
        ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        : String(value);
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "percent":
      return typeof value === "number"
        ? `${(value * 100).toFixed(2)}%`
        : String(value);
    default:
      return String(value);
  }
};

// Delete confirmation
const confirmDelete = (row: Record<string, unknown>): void => {
  rowToDelete.value = row;
  showDeleteModal.value = true;
};

const handleDelete = (): void => {
  if (rowToDelete.value) {
    emitAction("delete", rowToDelete.value);
    showDeleteModal.value = false;
    rowToDelete.value = null;
  }
};

// Helper method to emit actions
const emitAction = (type: string, row: Record<string, unknown>): void => {
  emit("action", { type, row });
};
</script>
