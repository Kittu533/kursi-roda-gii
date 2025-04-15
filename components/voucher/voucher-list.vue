<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Voucher</h2>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            class="bg-white border px-[10px] py-[10px] rounded-[10px] w-[97px] h-[39px] flex items-center gap-2 hover:bg-gray-50"
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
          <button
            class="bg-primary text-white px-[10px] py-[10px] rounded-[10px] h-[39px] flex items-center gap-2 hover:bg-primary/90"
            @click="router.push('/admin/voucher/create')"
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
            <span>Tambah</span>
          </button>
        </div>
      </div>
  
      <!-- Filter Panel -->
      <VoucherFilter
        v-if="showFilter"
        :filter="filter"
        @apply="applyFilter"
        @reset="resetFilter"
        @close="showFilter = false"
      />
  
      <!-- View Toggle -->
      <div class="flex justify-end mb-2">
        <div class="bg-white border rounded-lg p-1 inline-flex">
          <button 
            @click="viewMode = 'table'" 
            class="p-2 rounded" 
            :class="viewMode === 'table' ? 'bg-gray-100' : ''"
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
              class="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3" y1="6" y2="6" />
              <line x1="3" x2="3" y1="12" y2="12" />
              <line x1="3" x2="3" y1="18" y2="18" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'grid'" 
            class="p-2 rounded" 
            :class="viewMode === 'grid' ? 'bg-gray-100' : ''"
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
              class="lucide lucide-grid"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Data Table View -->
      <div v-if="viewMode === 'table'" class="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div class="p-4 border-b">
          <h3 class="text-lg font-medium">Data Voucher</h3>
        </div>
        <div class="p-4">
          <UiTable
            :data="vouchers"
            :columns="columns"
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
  
      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="voucher in vouchers" 
          :key="voucher.idVoucher" 
          class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-ticket text-primary"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
              <h3 class="font-medium">{{ voucher.idVoucher }}</h3>
            </div>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              :class="getStatusClasses(voucher.status)"
            >
              {{ voucher.status }}
            </span>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-500">Kode Voucher</p>
                <p class="font-medium">{{ voucher.kodeVoucher }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nilai</p>
                <p class="font-medium">{{ voucher.nilaiVoucher }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Persen</p>
                <p class="font-medium">{{ voucher.persenVoucher }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jumlah</p>
                <p class="font-medium">{{ voucher.jumlahVoucher }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">Periode</p>
              <p class="font-medium">{{ voucher.tanggalBerlaku }} - {{ voucher.tanggalBerakhir }}</p>
            </div>
            
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">Terpakai</p>
                <p class="font-medium">{{ voucher.voucherTerpakai }} dari {{ voucher.jumlahVoucher }}</p>
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="handleAction({ type: 'view', row: voucher })"
                  class="p-1 text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button 
                  @click="handleAction({ type: 'edit', row: voucher })"
                  class="p-1 text-yellow-600 hover:text-yellow-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button 
                  @click="handleAction({ type: 'delete', row: voucher })"
                  class="p-1 text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
  
      <!-- Empty state -->
      <div v-if="!isLoading && vouchers.length === 0" class="text-center py-8 bg-white rounded-lg border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-ticket mx-auto mb-2 text-gray-400"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
        <p class="text-gray-500">Tidak ada data voucher</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useVoucherStore } from "~/store/voucher";
  import type { VoucherAction, Column } from "~/types/voucher";
  import VoucherFilter from "~/components/voucher/voucher-filter.vue";
  import UiTable from "~/components/ui-table.vue";
  import UiPagination from "~/components/ui-pagination.vue";
  
  // Router and stores
  const router = useRouter();
  const voucherStore = useVoucherStore();
  
  // State
  const showFilter = ref(false);
  const viewMode = ref<'table' | 'grid'>('table');
  
  // Computed
  const vouchers = computed(() => voucherStore.vouchers);
  const pagination = computed(() => voucherStore.pagination);
  const filter = computed(() => voucherStore.filter);
  const isLoading = computed(() => voucherStore.isLoading);
  
  // Table columns configuration
  const columns: Column[] = [
    { key: "idVoucher", label: "ID Voucher" },
    { key: "kodeVoucher", label: "Kode Voucher" },
    { key: "nilaiVoucher", label: "Nilai Voucher" },
    { key: "persenVoucher", label: "Persen Voucher" },
    { key: "tanggalBerlaku", label: "Tanggal Berlaku" },
    { key: "tanggalBerakhir", label: "Tanggal Berakhir" },
    { key: "jumlahVoucher", label: "Jumlah Voucher" },
    { key: "voucherTerpakai", label: "Voucher Terpakai" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const statusClasses = getStatusClasses(value);
        return {
          component: "span",
          class: `px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`,
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
  
  // Helper function for status classes
  const getStatusClasses = (status: string): string => {
    const statusMap: Record<string, string> = {
      aktif: "bg-green-100 text-green-800",
      nonaktif: "bg-gray-100 text-gray-800",
      expired: "bg-red-100 text-red-800",
      menunggu: "bg-yellow-100 text-yellow-800",
    };
    
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };
  
  // Methods
  const applyFilter = (newFilter: Partial<VoucherFilter>) => {
    voucherStore.setFilter(newFilter);
  };
  
  const resetFilter = () => {
    voucherStore.resetFilter();
    showFilter.value = false;
  };
  
  const handlePageChange = (page: number) => {
    voucherStore.setFilter({ page });
  };
  
  const handleAction = async ({ type, row }: VoucherAction) => {
    const voucher = row;
  
    switch (type) {
      case "view":
        await router.push(`/admin/voucher/${voucher.idVoucher}`);
        break;
      case "edit":
        await router.push(`/admin/voucher/${voucher.idVoucher}/edit`);
        break;
      case "delete":
        if (confirm(`Apakah anda yakin ingin menghapus voucher ${voucher.idVoucher}?`)) {
          try {
            await voucherStore.deleteVoucher(voucher.idVoucher);
          } catch (error) {
            console.error("Error deleting voucher:", error);
          }
        }
        break;
    }
  };
  
  // Lifecycle
  onMounted(async () => {
    try {
      await voucherStore.loadVouchers();
    } catch (error) {
      console.error("Error loading vouchers:", error);
    }
  });
  </script>