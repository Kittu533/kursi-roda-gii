<template>
  <div class="data-table-container">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
    </div>
    
    <!-- Table Controls -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
      <!-- Search Filter -->
      <div class="relative w-full md:w-64">
        <div class="absolute left-3 top-2.5 text-gray-400">
          <NuxtIcon name="search" class="w-4 h-4" />
        </div>
        <input
          v-model="globalFilter"
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
        />
      </div>

      <!-- Row count display -->
      <div class="text-sm text-gray-500">
        Showing {{ Math.min(pagination.pageSize, table.getRowModel().rows.length) }} of {{ totalRowCount }} entries
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!table.getRowModel().rows.length"
      class="text-center py-8 text-gray-500 bg-gray-50 rounded-md"
    >
      <NuxtIcon name="database-x" class="mx-auto mb-2 w-6 h-6" />
      <p>No data available</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto border rounded-md relative">
      <table class="w-full border-collapse">
        <thead class="bg-white">
          <tr class="border-b">
            <th
              v-for="header in table.getHeaderGroups()[0].headers"
              :key="header.id"
              class="px-4 py-3 text-left text-sm font-medium text-gray-600"
              :class="[
                {
                  'cursor-pointer hover:bg-gray-50': header.column.getCanSort(),
                },
                header.id === 'actions' ? 'sticky right-0 z-10 bg-white shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)]' : '',
              ]"
              @click="
                header.column.getCanSort()
                  ? header.column.toggleSorting()
                  : null
              "
            >
              <div class="flex items-center gap-1">
                {{ header.column.columnDef.header }}
                <span v-if="header.column.getCanSort()" class="inline-flex text-gray-400">
                  <NuxtIcon
                    v-if="header.column.getIsSorted() === 'asc'"
                    name="chevron-up"
                    class="w-3.5 h-3.5"
                  />
                  <NuxtIcon
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    name="chevron-down"
                    class="w-3.5 h-3.5"
                  />
                  <NuxtIcon
                    v-else
                    name="chevron-down"
                    class="w-3.5 h-3.5 opacity-30"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in table.getRowModel().rows"
            :key="row.id"
            class="border-b hover:bg-gray-50 transition-colors"
            :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 text-sm text-gray-700"
              :class="[
                cell.column.id === 'actions' ? 
                  'sticky right-0 z-10 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)]' : '',
                cell.column.id === 'actions' && rowIndex % 2 === 0 ? 'bg-white' : '',
                cell.column.id === 'actions' && rowIndex % 2 !== 0 ? 'bg-gray-50' : '',
              ]"
            >
              <!-- Special handling for No column -->
              <template v-if="cell.column.id === 'no'">
                {{ calculateRowNumber(rowIndex) }}
              </template>
              
              <!-- Special handling for image/avatar column -->
              <template v-else-if="cell.column.id === 'foto_profil'">
                <div class="text-blue-600">{{ cell.getValue() }}</div>
              </template>
              
              <!-- Special handling for action column -->
              <template v-else-if="cell.column.id === 'actions'">
                <div class="flex space-x-2">
                  <button
                    @click="emitAction('view', row.original)"
                    class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="View"
                  >
                    <span class="sr-only">View</span>
                    <NuxtIcon name="eye" class="w-5 h-5" />
                  </button>
                  <button
                    @click="emitAction('edit', row.original)"
                    class="p-1 text-orange-500 hover:text-orange-700 transition-colors"
                    title="Edit"
                  >
                    <span class="sr-only">Edit</span>
                    <NuxtIcon name="pencil" class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDelete(row.original)"
                    class="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <span class="sr-only">Delete</span>
                    <NuxtIcon name="trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </template>
              
              <!-- Status column with badge -->
              <template v-else-if="cell.column.id === 'status'">
                <span
                  class="px-3 py-1 rounded-md text-xs font-medium capitalize"
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

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-600">
        Halaman {{ pagination.pageIndex + 1 }} dari {{ Math.ceil(totalRowCount / pagination.pageSize) }}
      </div>
      <div class="flex space-x-1">
        <button
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
          class="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <NuxtIcon name="chevron-left" class="w-4 h-4" />
        </button>
        
        <div class="flex">
          <button
            v-for="page in getPageNumbers()"
            :key="page"
            @click="table.setPageIndex(page - 1)"
            class="w-8 h-8 flex items-center justify-center rounded-md border text-sm"
            :class="pagination.pageIndex === page - 1 ? 'bg-blue-50 text-blue-600 border-blue-300' : 'hover:bg-gray-50'"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
          class="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <NuxtIcon name="chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
        <p class="mb-6">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
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
import { ref, computed, watch } from "vue"
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from "@tanstack/vue-table"

// Define types
interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  format?: string
  render?: (value: unknown, row?: Record<string, unknown>) => RenderResult
}

type RenderResult =
  | string
  | {
      component?: string
      text?: string
      slots?: Record<string, string>
      class?: string
      [key: string]: unknown
    }

// Status color mapping
interface StatusColorMap {
  [key: string]: {
    bg: string
    text: string
  }
}

// Props with proper types
const props = defineProps<{
  data: Record<string, unknown>[]
  columns: TableColumn[]
  loading?: boolean
  initialSortKey?: string
  initialSortOrder?: "asc" | "desc"
  initialPerPage?: number
  statusColorMap?: StatusColorMap
  title?: string
}>()

// Emits with proper types
const emit = defineEmits<{
  (e: "action", action: { type: string; row: Record<string, unknown> }): void
  (e: "sort", sortData: { key: string; order: "asc" | "desc" }): void
  (e: "per-page-change", perPage: number): void
}>()

// State
const showDeleteModal = ref(false)
const rowToDelete = ref<Record<string, unknown> | null>(null)
const globalFilter = ref("")

// Sorting state
const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: props.initialPerPage || 10,
})

// Calculate total row count
const totalRowCount = computed(() => props.data.length)

// Function to calculate row number based on pagination
const calculateRowNumber = (rowIndex: number): number => {
  const pageIndex = pagination.value.pageIndex || 0
  const pageSize = pagination.value.pageSize || 10
  return rowIndex + 1 + (pageIndex * pageSize)
}

// Default status color mapping
const defaultStatusColorMap: StatusColorMap = {
  // Map from the image
  aktif: { bg: "bg-green-100", text: "text-green-800" },
  nonaktif: { bg: "bg-gray-100", text: "text-gray-800" },
  dibekukan: { bg: "bg-red-100", text: "text-red-800" },
  menunggu: { bg: "bg-orange-100", text: "text-orange-800" },
  dibatalkan: { bg: "bg-blue-100", text: "text-blue-800" },
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
}

// Combine default and custom status color mappings
const statusColorMap = computed(() => {
  return { ...defaultStatusColorMap, ...props.statusColorMap }
})

// Get CSS classes for a status value
const getStatusClasses = (status: unknown): string => {
  if (status === null || status === undefined) return ""

  const statusKey = String(status).toLowerCase()
  const colorConfig = statusColorMap.value[statusKey] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
  }

  return `${colorConfig.bg} ${colorConfig.text}`
}

// TanStack Table setup
const columnHelper = createColumnHelper<Record<string, unknown>>()

// Convert columns prop to TanStack column definitions
const tableColumns = computed(() => {
  const noColumn = columnHelper.display({
    id: "no",
    header: "No",
    cell: (info) => calculateRowNumber(info.row.index)
  })

  const mappedColumns = props.columns.map((column) => {
    return columnHelper.accessor(column.key, {
      id: column.key,
      header: column.label,
      cell: (info) => {
        const value = info.getValue()
        if (column.render) {
          const renderResult = column.render(value, info.row.original)
          return typeof renderResult === "string" ? renderResult : renderResult.text || String(value)
        }
        return column.format ? formatCellValue(value, column.format) : value
      },
      enableSorting: column.sortable,
    })
  })

  return [noColumn, ...mappedColumns]
})

// Initialize sorting outside the table instance
if (props.initialSortKey && props.initialSortOrder) {
  sorting.value = [{ id: props.initialSortKey, desc: props.initialSortOrder === "desc" }]
}

// Create the table instance
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return tableColumns.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater

    // Emit sort event
    if (sorting.value.length > 0) {
      const { id, desc } = sorting.value[0]
      emit("sort", { key: id, order: desc ? "desc" : "asc" })
    }
  },
  onPaginationChange: (updater) => {
    pagination.value = typeof updater === "function" ? updater(pagination.value) : updater
    
    // Emit per-page-change event when pageSize changes
    emit("per-page-change", pagination.value.pageSize)
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === "function" ? updater(globalFilter.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  // Enable debugging in development
  debugTable: process.env.NODE_ENV === "development",
})

// Watch for pagination changes
watch(
  () => pagination.value.pageSize,
  (newPageSize) => {
    emit("per-page-change", newPageSize)
  },
)

// Format cell values based on format type
const formatCellValue = (value: unknown, format?: string): string => {
  if (value === null || value === undefined) return ""

  if (!format) return String(value)

  switch (format) {
    case "date":
      return new Date(String(value)).toLocaleDateString()
    case "datetime":
      return new Date(String(value)).toLocaleString()
    case "currency":
      return typeof value === "number"
        ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        : String(value)
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value)
    case "percent":
      return typeof value === "number" ? `${(value * 100).toFixed(2)}%` : String(value)
    default:
      return String(value)
  }
}

// Get page numbers for pagination
const getPageNumbers = () => {
  const totalPages = Math.ceil(totalRowCount.value / pagination.value.pageSize)
  const currentPage = pagination.value.pageIndex + 1
  
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5]
  }
  
  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
}

// Delete confirmation
const confirmDelete = (row: Record<string, unknown>): void => {
  rowToDelete.value = row
  showDeleteModal.value = true
}

const handleDelete = (): void => {
  if (rowToDelete.value) {
    emitAction("delete", rowToDelete.value)
    showDeleteModal.value = false
    rowToDelete.value = null
  }
}

// Helper method to emit actions
const emitAction = (type: string, row: Record<string, unknown>): void => {
  emit("action", { type, row })
}
</script>