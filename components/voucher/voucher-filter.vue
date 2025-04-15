<template>
    <div class="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">Filter Voucher</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
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
            class="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="localFilter.status"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            v-model="localFilter.startDate"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
          <input
            type="date"
            v-model="localFilter.endDate"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pencarian</label>
          <input
            type="text"
            v-model="localFilter.search"
            placeholder="Cari ID atau kode voucher..."
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div class="flex justify-end gap-2">
        <button
          @click="$emit('reset')"
          class="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          @click="applyFilter"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    filter: {
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page: number;
      itemsPerPage: number;
    };
  }>();
  
  const emit = defineEmits<{
    (e: 'apply', filter: any): void;
    (e: 'reset'): void;
    (e: 'close'): void;
  }>();
  
  // Local filter state
  const localFilter = ref({ ...props.filter });
  
  // Watch for changes in the filter prop
  watch(() => props.filter, (newFilter) => {
    localFilter.value = { ...newFilter };
  }, { deep: true });
  
  // Apply filter
  const applyFilter = () => {
    emit('apply', localFilter.value);
  };
  </script>