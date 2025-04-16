<template>
    <div class="border rounded-lg p-4 bg-white shadow-sm space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Filter Package</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
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
            class="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Package ID Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">ID Package</label>
          <input
            v-model="localFilter.packageId"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Cari ID Package"
          />
        </div>
  
        <!-- Voucher ID Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">ID Voucher</label>
          <input
            v-model="localFilter.voucherId"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Cari ID Voucher"
          />
        </div>
  
        <!-- Name Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Nama Package</label>
          <input
            v-model="localFilter.name"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Cari nama package"
          />
        </div>
        
        <!-- Price Range Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Harga Minimum</label>
          <input
            v-model.number="localFilter.minPrice"
            type="number"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Harga minimum"
          />
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Harga Maksimum</label>
          <input
            v-model.number="localFilter.maxPrice"
            type="number"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Harga maksimum"
          />
        </div>
  
        <!-- Status Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Status</label>
          <select
            v-model="localFilter.status"
            class="w-full border rounded-md px-3 py-2"
          >
            <option value="">Semua</option>
            <option value="Active">Aktif</option>
            <option value="Inactive">Tidak Aktif</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
  
        <!-- Date Range Filter -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal Mulai</label>
          <input
            v-model="localFilter.startDate"
            type="date"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal Selesai</label>
          <input
            v-model="localFilter.endDate"
            type="date"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>
  
      <div class="flex justify-end gap-2 pt-2">
        <button
          @click="$emit('reset')"
          class="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          @click="applyFilter"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Terapkan
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import type { PackageFilter } from "~/types/package";
  
  const props = defineProps<{
    filter: PackageFilter;
  }>();
  
  const emit = defineEmits<{
    (e: "apply", filter: Partial<PackageFilter>): void;
    (e: "reset"): void;
    (e: "close"): void;
  }>();
  
  // Create a local copy of the filter to manipulate
  const localFilter = ref<PackageFilter>({
    packageId: "",
    voucherId: "",
    name: "",
    minPrice: undefined,
    maxPrice: undefined,
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    itemsPerPage: 5,
  });
  
  // Sync with parent filter
  watch(
    () => props.filter,
    (newFilter) => {
      localFilter.value = { ...newFilter };
    },
    { deep: true }
  );
  
  // Set initial value on mount
  onMounted(() => {
    localFilter.value = { ...props.filter };
  });
  
  // Apply filter changes
  const applyFilter = () => {
    emit("apply", { ...localFilter.value });
  };
  </script>