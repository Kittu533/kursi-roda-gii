import { ref, computed, watch, onMounted } from "vue"
import type { TableItem, TableHeader } from "../types/data-table"
import { getPaginationRange } from "../utils/helpers"

export function useDataTable(props: any, emit: any) {
  // Local state
  const localRowsPerPage = ref(props.defaultRowsPerPage)
  const isDeleteModalOpen = ref(false)
  const itemToDelete = ref<TableItem | null>(null)

  // Initialize localRowsPerPage from pagination if available
  onMounted(() => {
    if (props.pagination?.itemsPerPage) {
      localRowsPerPage.value = props.pagination.itemsPerPage
    }
  })

  // Watch for changes in pagination from parent
  watch(
    () => props.pagination?.itemsPerPage,
    (newValue) => {
      if (newValue && newValue !== localRowsPerPage.value) {
        localRowsPerPage.value = newValue
      }
    },
    { immediate: true },
  )

  // Get current page and total pages from pagination prop
  const currentPage = computed(() => props.pagination?.currentPage || 1)
  const totalPages = computed(() => props.pagination?.totalPages || 1)
  const totalItems = computed(() => props.pagination?.totalItems || props.items.length)

  // Calculate start and end items for pagination text
  const startItem = computed(() => {
    if (props.items.length === 0) return 0
    return (currentPage.value - 1) * (props.pagination?.itemsPerPage || localRowsPerPage.value) + 1
  })

  const endItem = computed(() => {
    const end = startItem.value + (props.pagination?.itemsPerPage || localRowsPerPage.value) - 1
    return Math.min(end, totalItems.value)
  })

  // Check if we have an actions column
  const hasActionsColumn = computed(() => {
    return props.headers.some((header: TableHeader) => header.key === "actions")
  })

  // Get the actions header if it exists
  const actionsHeader = computed(() => {
    return (
      props.headers.find((header: TableHeader) => header.key === "actions") || {
        key: "actions",
        label: "Actions",
      }
    )
  })

  // Get pagination range using the helper function
  const paginationRange = computed(() => {
    return getPaginationRange(currentPage.value, totalPages.value)
  })

  function handleRowsPerPageChange(): void {
    console.log("Rows per page changed to:", localRowsPerPage.value)
    emit("rows-per-page-change", localRowsPerPage.value)
  }

  function getItemKey(item: TableItem, index: number): string | number {
    return (item[props.itemKey] as string | number) || index
  }

  function handleAction(type: string, item: TableItem): void {
    if (type === "view") {
      emit("view", item)
    } else if (type === "edit") {
      emit("edit", item)
    } else if (type === "delete") {
      openDeleteModal(item)
    }

    emit("action", { type, row: item })
  }

  // Delete modal functions
  function openDeleteModal(item: TableItem): void {
    itemToDelete.value = item
    isDeleteModalOpen.value = true
  }

  function confirmDelete(): void {
    if (itemToDelete.value) {
      emit("delete", itemToDelete.value)
      emit("action", { type: "delete", row: itemToDelete.value })
      isDeleteModalOpen.value = false
      itemToDelete.value = null
    }
  }

  return {
    localRowsPerPage,
    isDeleteModalOpen,
    itemToDelete,
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    hasActionsColumn,
    actionsHeader,
    paginationRange,
    handleRowsPerPageChange,
    getItemKey,
    handleAction,
    openDeleteModal,
    confirmDelete,
  }
}
