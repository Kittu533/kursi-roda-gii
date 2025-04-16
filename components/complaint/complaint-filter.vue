<template>
  <div class="bg-white border rounded-lg p-4 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Filter Data Pengembalian</h3>
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
    
    <form @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ID Komplain
          </label>
          <input
            v-model="filterData.complaintId"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="K0001"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ID Pelanggan
          </label>
          <input
            v-model="filterData.customerId"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="P0001"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ID Transaksi
          </label>
          <input
            v-model="filterData.transactionId"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="T0001"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Jenis
          </label>
          <select
            v-model="filterData.type"
            class="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Semua</option>
            <option value="Kerusakan produk">Kerusakan produk</option>
            <option value="Produk tidak sesuai">Produk tidak sesuai</option>
            <option value="Pelayanan agen">Pelayanan agen</option>
            <option value="Keterlambatan pengiriman">Keterlambatan pengiriman</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            v-model="filterData.status"
            class="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Semua</option>
            <option value="Open">Open</option>
            <option value="Forwarded">Forwarded</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input
            v-model="filterData.startDate"
            type="date"
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input
            v-model="filterData.endDate"
            type="date"
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      
      <div class="flex justify-end gap-2 mt-4">
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Terapkan Filter
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ComplaintFilter } from '~/types/complaint';

const props = defineProps<{
  filter: ComplaintFilter;
}>();

const emit = defineEmits<{
  (e: 'apply', filter: ComplaintFilter): void;
  (e: 'reset'): void;
  (e: 'close'): void;
}>();

// Create a local copy of filter data
const filterData = ref<ComplaintFilter>({ ...props.filter });

// Update local filter data when props change
watch(() => props.filter, (newFilter) => {
  filterData.value = { ...newFilter };
}, { deep: true });

const applyFilters = () => {
  emit('apply', { ...filterData.value });
};

const resetFilters = () => {
  emit('reset');
};
</script>